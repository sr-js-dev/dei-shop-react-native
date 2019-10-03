import React, { Component } from 'react';
import { View, Text, Dimensions, Image } from 'react-native';

import axios from 'axios';
import API from '../../components/API';
import { FlatGrid } from 'react-native-super-grid';
import {
  STCartGridItem,
  DEIBoldText,
  DEIRegularText,
  AXIOS_CONFIG
} from '../../components';

import Spinner from 'react-native-loading-spinner-overlay';
import AppSessionManager from '../../components/AppSessionManager';
import { NavigationEvents } from 'react-navigation';
import Grid from '../../components/EasyGrid';
import { TouchableOpacity } from 'react-native-gesture-handler';

const GridWidth = Dimensions.get('screen').width / 3 - 30;

class StoreDetail extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '',
    headerTintColor: '#B19CFD',
    headerBackTitle: 'Back',
    headerRight: (
      <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
        <Image
          style={{ marginRight: 15, width: 24, height: 24 }}
          source={require('../../assets/Cart/ic_cart_icon.png')}
        />
      </TouchableOpacity>
    )
  });

  constructor(props) {
    super(props);

    var storeInfo = this.props.navigation.getParam('Store', {});

    this.state = {
      products: [],
      isLoading: false,
      store: storeInfo,
      currentPage: 1,
      loadingMore: false,
      refreshing: false
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = () => {
    if (Object.keys(this.state.store).length < 1) {
      return;
    }
    if (this.state.currentPage == 1) {
      this.setState({ products: [], isLoading: true });
    } else {
      this.setState({ isLoading: false, loadingMore: true });
    }
    var storeId = this.state.store.company_id; // 233
    if (this.state.store.id != null) {
      storeId = this.state.store.id;
    }
    const api =
      API.StoresDetail +
      storeId +
      '?items_per_page=30&page=' +
      this.state.currentPage;
    console.log(api);

    var headers = AppSessionManager.shared().getAuthorizationHeader();
    axios
      .get(api, headers, AXIOS_CONFIG)
      .then(response => {
        console.log(response);
        //this.setState({ sLoading: false });
        if (response.status == 200) {
          const data = response.data;
          const products = data.Products;
          if (Array.isArray(products) && products.length) {
            var productsList = this.state.products;
            if (this.state.currentPage == 1) {
              productsList = products;
            } else {
              productsList = productsList.concat(products);
            }
            this.setState({
              products: productsList,
              isLoading: false,
              loadingMore: false
            });
            console.log(productsList);
          } else {
            this.setState({
              currentPage: currentPage - 1,
              isLoading: false,
              loadingMore: false
            });
          }
        }
      })
      .catch(err => {
        this.setState({ isLoading: false, loadingMore: false });
      });
  };

  onRefresh = () => {};

  onEndReached = () => {
    const { currentPage, isLoading } = this.state;
    if (isLoading) {
      return;
    }
    this.setState({ currentPage: currentPage + 1 });
    setTimeout(() => {
      this.fetchProducts();
    }, 200);
  };

  productImageUrl = item => {
    var imageurl = '';
    if (item.main_pair.icon != null) {
      console.log(item.main_pair.icon.http_image_path);
      imageurl = item.main_pair.icon.http_image_path;
    } else if (item.main_pair.detailed != null) {
      imageurl = item.main_pair.detailed.http_image_path;
    }
    return imageurl;
  };

  renderHeader = () => {
    const { company, plan, banner_url } = this.state.store;
    return (
      <View style={{ backgroundColor: '#fff' }}>
        <View style={{ marginHorizontal: 20 }}>
          <Image
            source={{ uri: banner_url }}
            style={{ width: '100%', height: 150, resizeMode: 'contain' }}
          />
          <DEIBoldText title={company} style={{ fontSize: 18 }} />
          {/* <DEIRegularText
            title={plan}
            style={{ color: '#A1A1B4', marginTop: 10 }}
          /> */}
          <View style={{ height: 30 }} />
        </View>
      </View>
    );
  };

  showProductDetail = item => {
    // this.props.navigation.navigate('HomeProductDetail', {
    //   ProductId: product.product_id
    // });
    this.props.navigation.navigate('HomeProductDetail', {
      ProductId: item.product_id,
      count: item.quantity,
      product: item
    });
  };

  checkCartProducts() {
    if (AppSessionManager.shared().isCartChanged == true) {
      AppSessionManager.shared().isCartChanged = false;
      var cartitems = AppSessionManager.shared().getOrders();
      var products = this.state.products;
      for (let [i, cartItem] of cartitems.entries()) {
        console.log(cartItem);
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
          }
        }
      }
      this.setState({ products: products });
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            this.checkCartProducts();
          }}
        />
        <Spinner visible={this.state.isLoading} />
        <Grid
          numColumns={3}
          ListHeaderComponent={this.renderHeader()}
          data={this.state.products}
          keyExtractor={(item, index) => index.toString()}
          renderItem={store => (
            <STCartGridItem item={store.item} action={this.showProductDetail} />
          )}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.refreshing}
          onEndReached={() => this.onEndReached()}
          loadingMore={this.state.loadingMore}
          marginExternal={4}
          marginInternal={4}
        />
      </View>
    );
  }
}

export default StoreDetail;
