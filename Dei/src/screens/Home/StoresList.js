import React, { Component } from 'react';
import { View, Image, Dimensions, TouchableOpacity } from 'react-native';

import { FlatGrid } from 'react-native-super-grid';
import SortByFilterView from '../../components/SortByFilterView';
import {
  STCartGridItem,
  SortView,
  CategoryCarousel,
  isNetworkConnected,
  AXIOS_CONFIG,
  DEIRegularText,
  DEIBoldText
} from './../../components/index';

import Spinner from 'react-native-loading-spinner-overlay';
import Axios from 'axios';
import API from '../../components/API';
import AppSessionManager from '../../components/AppSessionManager';

import Grid from '../../components/EasyGrid';

const GridWidth = Dimensions.get('screen').width / 2 - 20;

class StoresList extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Stores',
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
    this.state = {
      stores: [],
      isLoading: false,
      currentPage: 1,
      loadingMore: false,
      refreshing: false
    };
  }

  componentDidMount() {
    this.fetchStores();
  }

  onRefresh = () => {};

  onEndReached = () => {
    const { currentPage, isLoading } = this.state;
    if (isLoading) {
      return;
    }

    this.setState({ currentPage: currentPage + 1 });

    setTimeout(() => {
      this.fetchStores();
    }, 200);
  };

  fetchStores = () => {
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        // http://api.dei.com.sg/api/product/store/108?items_per_page=30&page=1

        var url =
          API.Stores + '?items_per_page=30&page=' + this.state.currentPage;

        var headers = AppSessionManager.shared().getAuthorizationHeader();
        console.log(headers);
        console.log(url);
        if (this.state.currentPage == 1) {
          this.setState({ stores: [], isLoading: true });
        } else {
          this.setState({ isLoading: false, loadingMore: true });
        }

        Axios.get(url, headers, AXIOS_CONFIG)
          .then(res => {
            console.log(res);
            if (res.status == 200) {
              let storesAvailable = Boolean(
                Array.isArray(res.data.Stores) && res.data.Stores.length
              );

              if (storesAvailable) {
                var stores = this.state.stores;
                if (this.state.currentPage == 1) {
                  stores = res.data.Stores;
                } else {
                  stores = stores.concat(res.data.Stores);
                }
                this.setState({
                  isLoading: false,
                  stores: stores,
                  loadingMore: false
                });
              } else {
                this.setState({ isLoading: false, loadingMore: false });
              }
            }
          })
          .catch(err => {
            this.setState({ isLoading: false, loadingMore: false });
            console.log(err.response);
            alert('Oops.. something went wrong. Please try again later.');
          });
      } else {
        alert(
          'No Internet Connection Found, Check your connection and try again'
        );
      }
    });
  };

  storeClicked = store => {
    this.props.navigation.navigate('StoreDetail', { Store: store.item });
  };

  storeImageUrl = item => {
    var imageurl = '';
    if (item.logo != null) {
      imageurl = item.logo.image_path;
    }
    return imageurl;
  };

  renderItem = store => {
    console.log(store);
    console.log(GridWidth);
    return (
      <TouchableOpacity
        onPress={() => this.storeClicked(store)}
        style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            width: GridWidth,
            height: GridWidth,
            marginTop: 10,
            borderRadius: 10,
            borderColor: 'transparent',
            borderWidth: 1,
            shadowOpacity: 0.3,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 10,
            alignItems: 'center',
            elevation: 10,
            justifyContent: 'space-around'
          }}
        >
          <Image
            source={{ uri: this.storeImageUrl(store.item) }}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
              backgroundColor: 'white',
              borderRadius: 10,
              borderColor: 'transparent',
              borderWidth: 1
            }}
          />
        </View>
        <DEIBoldText
          title={store.item.company}
          style={{
            fontSize: 12,
            color: '#232323',
            margin: 10
          }}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { isLoading, stores } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.isLoading} />
        <Grid
          numColumns={2}
          data={stores}
          keyExtractor={(item, index) => index.toString()}
          renderItem={store => this.renderItem(store)}
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

export default StoresList;
