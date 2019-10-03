import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {
  StoreBanner,
  StoreCategoryItem,
  StoreCartItem,
  StoreCarousel,
  DEIMediumText,
  NoInternetAlert,
  isNetworkConnected,
  AXIOS_CONFIG,
  DEIRegularText,
  DEIBoldText
} from './../../components/index';
import StoreFilter from '../../components/StoreFilter';
import SortByFilterView from '../../components/SortByFilterView';
import { SortView, FilterView, StoreCategories } from '../../components/index';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationEvents } from 'react-navigation';

import { StoreMainCategoriesList } from '../../components/mockData';
import AppSessionManager from '../../components/AppSessionManager';
import Axios from 'axios';
import API from '../../components/API';
import { Switch } from 'react-native-gesture-handler';

const scrWidth = Dimensions.get('screen').width;
const itemWidth = scrWidth - 30;

class Home extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Home',
    headerTintColor: '#B19CFD',
    headerBackTitle: 'Back'
    // headerRight: (
    //   <TouchableOpacity
    //     onPress={() => navigation.navigate('HomeCategorySearch')}
    //   >
    //     <Image
    //       style={{ marginRight: 15, width: 24, height: 24 }}
    //       source={require('../../assets/Cart/ic_search.png')}
    //     />
    //   </TouchableOpacity>
    // )
  });

  constructor(props) {
    super(props);
    appSessionManager = AppSessionManager.shared();

    this.state = {
      isNetworkConnected: true,
      isLoading: false,
      home: {},
      selectedCategoryIndex: 0,
      isSortVisible: false,
      isFilterVisible: false,
      priceRange: [],
      categoryList: StoreMainCategoriesList,
      banners: [],
      storeList: [
        {
          imageUri: require('../../assets/Stores/ic_banner01.png')
        },
        {
          imageUri: require('../../assets/Stores/ic_banner02.png')
        }
      ]
    };
  }

  componentDidMount() {
    this.fetchHome();
  }

  getProductsList = () => {
    var products = [];
    const { home } = this.state;
    if (Object.keys(home).length > 0) {
      if (home.products != null) {
        products = home.products;
      }
    }
    return products;
  };

  checkCartProducts() {
    if (AppSessionManager.shared().isHomeChanged == true) {
      AppSessionManager.shared().isHomeChanged = false;
      var cartitems = AppSessionManager.shared().getOrders();
      const { home } = this.state;
      var products = this.getProductsList();
      if (cartitems.length < 1) {
        this.resetProductQuantity();
      } else {
        for (let [i, cartItem] of cartitems.entries()) {
          console.log(cartItem);
          debugger;
          for (let [i, product] of products.entries()) {
            if (product.product_id == cartItem.product_id) {
              if (
                Array.isArray(cartItem.options) &&
                cartItem.options.length > 0
              ) {
              } else {
                products[i].quantity = cartItem.quantity;
                products[i].options = cartItem.options;
              }
            } else {
              products[i].quantity = 0;
            }
          }
        }
        home.products = products;
        this.setState({ home: home });
      }
    }

    if (AppSessionManager.shared().checkoutCompleted == true) {
      AppSessionManager.shared().checkoutCompleted = false;
      this.resetProductQuantity();
    }
  }

  // when a cart item is deleted completely - this will reset the quantity of prev.added items
  resetProductQuantity = () => {
    const { home } = this.state;
    var products = this.getProductsList();
    for (let [i, product] of products.entries()) {
      products[i].quantity = 0;
    }
    home.products = products;
    this.setState({ home: home });
  };

  fetchHome() {
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
              this.setState({
                isLoading: false,
                home: homeResponse,
                banners: homeResponse.banner
              });
            } else {
              this.setState({ isLoading: false });
            }
          })
          .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
          });
      }
    });
  }

  /// Render Store Category  list

  storeCategoryItemClicked = (item, index) => {
    this.setState({
      selectedCategoryIndex: index
    });
  };

  renderStoreCategoryList = () => {
    var category = [];
    const { home } = this.state;
    if (Object.keys(home).length > 0) {
      if (home.categories != null) {
        var categoryList = home.categories;
        for (var key in categoryList) {
          category.push(categoryList[key]);
        }
      }
      console.log(category);
    }
    return (
      <StoreCategories categories={category} action={this.categoryClicked} />
    );
  };

  categoryClicked = (item, index) => {
    this.props.navigation.navigate('HomeStoreCategories', {
      selectedCategory: item,
      selectedIndex: index
    });
  };

  /// Render Store banner list

  storeBannerItemClicked = item => {
    console.log(item);
    this.props.navigation.navigate('StoreDetail', { Store: item });
    // this.props.navigation.navigate('StoreList', {
    //   Stores: true,
    //   title: 'Stores'
    // });
  };

  showAllStores = () => {
    this.props.navigation.navigate('StoreList');
  };

  renderStoreBannerList = () => {
    var stores = [];
    const { home } = this.state;
    if (Object.keys(home).length > 0) {
      if (home.stores != null) {
        stores = home.stores;
      }
    }
    return (
      <View style={{ width: '100%', height: 250, marginBottom: 10 }}>
        {this.renderStores(stores)}
        {/* <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          data={stores}
          keyExtractor={(item, index) => `${index.toString()}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => this.storeBannerItemClicked(item)}
              style={{ marginHorizontal: 10 }}
            >
              <StoreBanner item={item} mWidth={scrWidth - 120} mHeight={110} />
            </TouchableOpacity>
          )}
        /> */}
      </View>
    );
  };

  renderStores = items => {
    console.log(scrWidth);
    let heightOfBanner = 250;
    return (
      <Carousel
        layout={'default'}
        removeClippedSubviews={false}
        ref={c => {
          this._carousel = c;
        }}
        data={items}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => this.storeBannerItemClicked(item)}
            style={{ alignItems: 'center' }}
          >
            <StoreBanner
              item={item}
              mWidth={scrWidth}
              mHeight={heightOfBanner}
            />
          </TouchableOpacity>
        )}
        sliderWidth={scrWidth}
        itemWidth={scrWidth}
        onSnapToItem={index => this.setState({ activeSlide: index })}
      />
    );
  };

  showProductDetail = item => {
    this.props.navigation.navigate('HomeProductDetail', {
      ProductId: item.product_id,
      count: item.quantity,
      product: item
    });
  };
  // Render Top Savers
  renderTopSavers = () => {
    var products = [];
    const { home } = this.state;
    if (Object.keys(home).length > 0) {
      if (home.products != null) {
        products = home.products;
      }
    }
    return (
      <View>
        {products.length > 0 && <TitleText title={'Top Savers'} />}
        <FlatList
          data={products}
          keyExtractor={(item, index) => `${index.toString()}`}
          extraData={this.state}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.showProductDetail(item)}>
              <StoreCartItem
                item={item}
                qstatus={false}
                showDelete={false}
                action={this.showProductDetail}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  bannerAction = item => {
    console.log(item);
    switch (item.object_type) {
      case 'category':
        this.props.navigation.navigate('BannerCategory', { item: item });
        break;
      case 'store':
        var itemInfo = item;
        itemInfo.company_id = item.object_id;
        itemInfo.company = item.name;
        itemInfo.plan = item.name;
        itemInfo.banner_url = item.image;
        this.props.navigation.navigate('StoreDetail', { Store: itemInfo });
        break;
      case 'product':
        this.props.navigation.navigate('HomeProductDetail', {
          ProductId: item.object_id,
          count: 0
        });
        break;
      default:
    }
  };

  // Render Grab It Now
  renderGrabItNow = () => {
    const { banners } = this.state;
    return (
      <View style={{ marginTop: 10, marginBottom: 20 }}>
        {banners.length > 0 && <TitleText title={'Grab it Now'} />}
        <StoreCarousel
          type={'tinder'}
          itemHeight={120}
          itemwidth={120}
          banners={banners}
          clickAction={this.bannerAction}
        />
      </View>
    );
  };

  // Sort By / Filter Actions
  sortClicked = () => {
    this.setState({ isSortVisible: !this.state.isSortVisible });
  };

  sortOptionChanged = sort => {
    this.sortClicked();
  };

  filterClicked = () => {
    this.setState({ isFilterVisible: !this.state.isFilterVisible });
  };

  applyFilterAction = () => {
    this.filterClicked();
  };

  renderSearchView() {
    return (
      <TouchableOpacity
        style={{
          marginHorizontal: 15,
          backgroundColor: '#f3f3f3',
          borderRadius: 10,
          flexDirection: 'row',
          margin: 15
        }}
        onPress={() => this.props.navigation.navigate('HomeCategorySearch')}
      >
        <Image
          style={{
            marginHorizontal: 10,
            width: 20,
            height: 20,
            alignSelf: 'center'
          }}
          source={require('../../assets/Cart/ic_searchicon.png')}
        />
        <TextInput
          placeholder={'Search'}
          returnKeyType={'search'}
          editable={false}
          value={this.state.searchText}
          onKeyPress={this.handleKeyDown}
          onSubmitEditing={this.searchSubmit}
          clearButtonMode={'while-editing'}
          pointerEvents={'none'}
          style={{ color: 'black', height: 40, width: '85%' }}
        />
      </TouchableOpacity>
    );
  }

  render() {
    const {
      isSortVisible,
      isFilterVisible,
      isLoading,
      priceRange
    } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            this.checkCartProducts();
          }}
        />
        <Spinner visible={isLoading} />
        <ScrollView>
          <View>
            {this.renderStoreBannerList()}
            {this.renderSearchView()}
            {this.renderStoreCategoryList()}
            {this.renderGrabItNow()}
            {this.renderTopSavers()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const TitleText = ({ title }) => {
  return (
    <DEIMediumText
      title={title}
      style={{
        marginLeft: 20,
        fontSize: 14,
        marginBottom: 10,
        color: '#9393A7'
      }}
    />
  );
};
export default Home;
