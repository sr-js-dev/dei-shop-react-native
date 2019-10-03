import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
  FlatList,
  ScrollView
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {
  StoreBanner,
  isNetworkConnected,
  AXIOS_CONFIG,
  ShowAlert,
  DEIMediumText,
  DEIBoldText
} from './../../components/index';
import Spinner from 'react-native-loading-spinner-overlay';
import AppSessionManager from '../../components/AppSessionManager';
import Axios from 'axios';
import Grid from '../../components/EasyGrid';
import { NavigationEvents } from 'react-navigation';

import API from '../../components/API';
import HomeBannerList from '../../components/HomeBannerList';
import HomeSectionItem from '../../components/HomeSectionItem';
import HomeCategoryItem from '../../components/HomeCategoryItem';

const scrWidth = Dimensions.get('screen').width;

export class HomePage extends Component {
  static navigationOptions = {
    headerTitle: (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image
          source={require('../../assets/Tabs/ic_homelogo.png')}
          style={{ height: 35, width: 35, resizeMode: 'contain' }}
        />
      </View>
    ),
    headerLeft: null,
    headerRight: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      home: {},
      activeSlide: 0,
      stores: [],
      banners: [],
      sections: [],
      categories: []
    };
  }

  componentDidMount() {
    this.fetchHome();
  }

  updateDisplay(homeResponse) {
    if (homeResponse != null) {
      var storesList = [];
      if (Array.isArray(homeResponse.stores)) {
        storesList = homeResponse.stores;
      }

      var bannerList = [];
      if (Array.isArray(homeResponse.banner)) {
        bannerList = homeResponse.banner;
      }

      var sectionList = [];
      if (Array.isArray(homeResponse.sections)) {
        sectionList = homeResponse.sections;
      }

      var categoriesList = [];
      if (Object.keys(homeResponse.categories).length > 0) {
        var categoryDict = homeResponse.categories;
        for (var key in categoryDict) {
          categoriesList.push(categoryDict[key]);
        }
      }
      this.setState({
        isLoading: false,
        home: homeResponse,
        stores: storesList,
        banners: bannerList,
        sections: sectionList,
        categories: categoriesList
      });
    }
  }

  fetchHome() {
    // var response = require('../../assets/home2.json');
    // this.updateDisplay(response.Home);
    // return;
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        //
        var header = AppSessionManager.shared().getAuthorizationHeader();
        console.log(header);
        this.setState({ isLoading: true });
        Axios.get(API.launch, header, AXIOS_CONFIG)
          .then(res => {
            console.log(res);
            const homeResponse = res.data.Home;
            let urls = res.data.Urls;
            let aboutURL = urls.about_url;
            let termsURL = urls.terms_url;
            AppSessionManager.shared().saveAboutUrl(aboutURL);
            AppSessionManager.shared().saveTermsUrl(termsURL);
            if (homeResponse != null) {
              this.updateDisplay(homeResponse);
            } else {
              this.setState({ isLoading: false });
              setTimeout(() => {
                ShowAlert(
                  'Unable to get Home Details - Please try again later'
                );
              }, 200);
            }
          })
          .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
          });
      }
    });
  }

  storeBannerItemClicked = item => {
    console.log(item);
    this.props.navigation.navigate('StoreDetail', { Store: item });
  };

  renderBanners() {
    let banners = this.state.banners;
    if (banners.length > 0) {
      return (
        <View
          style={{
            height: 180,
            width: '100%',
            alignItems: 'center'
          }}
        >
          <Carousel
            layout={'default'}
            removeClippedSubviews={false}
            ref={c => {
              this._carousel = c;
            }}
            data={banners}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => this.storeBannerItemClicked(item)}
                style={{ alignItems: 'center' }}
              >
                <StoreBanner item={item} mWidth={scrWidth} mHeight={220} />
              </TouchableOpacity>
            )}
            sliderWidth={scrWidth}
            itemWidth={scrWidth}
            onSnapToItem={index => this.setState({ activeSlide: index })}
          />
        </View>
      );
    }
  }

  pagination() {
    let banners = this.state.banners;
    const { activeSlide } = this.state;
    return (
      <View style={{ alignItems: 'center' }}>
        <Pagination
          dotsLength={banners.length}
          activeDotIndex={activeSlide}
          containerStyle={{
            height: 20,
            width: 20
          }}
          dotStyle={{
            width: 7,
            height: 7,
            borderRadius: 5,
            marginHorizontal: 4,
            backgroundColor: '#B19CFD'
          }}
          inactiveDotStyle={{
            backgroundColor: '#BFBFBF'
          }}
          inactiveDotOpacity={1.0}
          inactiveDotScale={1.0}
        />
      </View>
    );
  }

  renderSearchBar = () => {
    const { searchBarViewStyle } = styles;
    return (
      <TouchableOpacity
        style={searchBarViewStyle}
        onPress={() => this.props.navigation.navigate('HomeCategorySearch')}
      >
        <DEIMediumText
          title="Search for a product, brand or category"
          style={{ color: '#B7B7B7' }}
        />
      </TouchableOpacity>
    );
  };

  storeItemClicked = item => {
    //  alert('Store clicked');
    this.props.navigation.navigate('StoreDetail', { Store: item });
  };

  renderStores = () => {
    const { storesViewStyle } = styles;
    return (
      <View style={storesViewStyle}>
        <View
          style={{
            marginTop: 13,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20
          }}
        >
          <DEIBoldText
            title={'Stores'}
            style={{ color: '#000', fontSize: 14 }}
          />
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('StoreList')}
          >
            <DEIMediumText
              title={'View All'}
              style={{ color: '#868686', fontSize: 14 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: 15 }}>
          <HomeBannerList
            stores={this.state.stores}
            onClick={this.storeItemClicked}
          />
        </View>
      </View>
    );
  };

  categoryClicked = item => {
    const pos = this.state.categories.indexOf(item);
    const index = pos == -1 ? 0 : pos;
    this.props.navigation.navigate('HomeStoreCategories', {
      selectedCategory: item
    });
  };

  renderCategories() {
    console.log("0000000", this.state.categories)
    return (
      <View style={{ marginHorizontal: 10, marginTop: 20, margin:'auto'}}>
        {/* <Grid
          marginExternal={4}
          marginInternal={4}
          numColumns={4}
          data={this.state.categories}
          renderItem={item => (
            <HomeCategoryItem item={item} onclick={this.categoryClicked} />
          )}
        /> */}
          <HomeCategoryItem item={this.state.categories} onclick={this.categoryClicked} />
      </View>
    );
  }

  bannerUrlClicked = item => {
    console.log(item);
    if (item != null && Object.keys(item).length > 0) {
      if (item.object_type == 'url') {
        this.props.navigation.navigate('HomeBannerUrlPage', {
          url: item.object_url,
          title_name: ''
        });
      } else if (item.object_type == 'category') {
        this.props.navigation.navigate('HomeBannerCategoryList', {
          categoryId: item.object_id,
          categoryName: item.name
        });
      }
    }
  };

  renderSections() {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{
          marginTop: 10
        }}
        data={this.state.sections}
        extraDat={this.state}
        renderItem={({ item, index }) => (
          <HomeSectionItem
            item={item}
            index={index}
            urlClicked={this.bannerUrlClicked}
            homeNavigation={this.props.navigation}
          />
        )}
      />
    );
  }

  resetSectionProductQuantityCount(sections) {
    console.log(sections);
  }

  refreshCartProduct() {
    var sections = this.state.sections;
    if (sections.length < 1) {
      return;
    }
    //  debugger;
    if (
      AppSessionManager.shared().isHomeChanged == true ||
      AppSessionManager.shared().isCartChanged == true
    ) {
      AppSessionManager.shared().isHomeChanged = false;
      AppSessionManager.shared().isCartChanged == false;
      var cartitems = AppSessionManager.shared().getOrders();
      console.log('refresh cart items');
      console.log(cartitems);
      if (cartitems.length < 1) {
        this.resetSectionProductQuantityCount(sections);
      } else {
        console.log(sections);
        var updatedSections = [];
        for (const sectionInfo of sections) {
          var updateSectionItem = sectionInfo;
          const products = sectionInfo['products'];
          var productsList = [];
          if (Array.isArray(products)) {
            for (const item of products) {
              var productItem = item;
              productItem.quantity = 0;
              for (const cartitem of cartitems) {
                if (cartitem.product_id == productItem.product_id) {
                  productItem.quantity = cartitem.quantity;
                  console.log('match found');
                  break;
                }
              }
              productsList.push(productItem);
            }
            updateSectionItem['products'] = productsList;
          }
          updatedSections.push(updateSectionItem);
        }
        this.setState({ sections: updatedSections });
      }
    }
  }

  render() {
    const { isLoading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            this.refreshCartProduct();
          }}
        />
        <Spinner visible={isLoading} />
        <ScrollView>
          <View>
            {this.renderBanners()}
            {this.pagination()}
            {this.renderSearchBar()}
            {this.renderCategories()}
            {this.renderStores()}
            {this.renderSections()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  storesViewStyle: {
    height: 165,
    backgroundColor: '#E9E9E9',
    marginTop: 20
  },
  searchBarViewStyle: {
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    backgroundColor: '#fff',
    borderColor: '#EFEFEF',
    borderRadius: 1,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8
  }
});
export default HomePage;
