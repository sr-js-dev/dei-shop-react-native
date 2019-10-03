import React, { Component } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Axios from 'axios';
import AppSessionManager from '../../components/AppSessionManager';
import API from '../../components/API';
import Grid from '../../components/EasyGrid';
import StoreFilter from '../../components/StoreFilter';
import { EmptyView } from '../../components/EmptyView';
import SortByFilterView from '../../components/SortByFilterView';
import { NavigationEvents } from 'react-navigation';

import {
  CategoryMenuList,
  isNetworkConnected,
  AXIOS_CONFIG,
  StoreCategories,
  StoreSubCategoriesList,
  ProductGridWidth,
  DEIRegularText,
  STCartGridItem,
  SortView
} from '../../components';

export default class CategorySearch extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Search',
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
      categories: [],
      isLoading: false,
      selectedSubCategoryIndex: 0,
      currentPage: 1,
      products: [],
      loadingMore: false,
      refreshing: false,
      selectedCategoryId: '',
      isSortVisible: false,
      isFilterVisible: false,
      sortBy: '&sort_order=asc&sort_by=price',
      priceRange: [1, 1000],
      searchText: ''
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  // Sort By / Filter Actions
  sortClicked = () => {
    this.setState({ isSortVisible: !this.state.isSortVisible });
  };

  sortOptionChanged = sort => {
    if (sort == -1) {
      return;
    }
    this.setState({ sortBy: sort, currentPage: 1 });
    console.log(sort);

    this.sortClicked();
    setTimeout(() => {
      this.fetchProducts(this.state.selectedCategoryId);
    }, 200);
  };

  filterClicked = () => {
    this.setState({ isFilterVisible: !this.state.isFilterVisible });
  };

  backFilterClicked = () => {
    this.setState({
      isFilterVisible: false
    });
  };

  applyFilterAction = priceRange => {
    this.filterClicked();
    console.log(priceRange);
    this.setState({
      priceRange: priceRange,
      isFilterVisible: false,
      currentPage: 1
    });
    setTimeout(() => {
      this.fetchProducts(this.state.selectedCategoryId);
    }, 200);
  };

  emptyAction = () => {
    this.setState({ currentPage: 1 });
    setTimeout(() => {
      this.fetchProducts();
    }, 100);
  };

  productItemClicked = item => {
    console.log(item);
    this.props.navigation.navigate('HomeProductDetail', {
      ProductId: item.product_id,
      count: item.quantity,
      product: item
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

  formatPriceRange = () => {
    if (this.state.priceRange.length < 2) {
      return;
    }
    return `&price_from=${this.state.priceRange[0]}&price_to=${
      this.state.priceRange[1]
    }`;
  };

  fetchProducts() {
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        const { currentPage, priceRange, sortBy } = this.state;
        if (this.state.currentPage == 1) {
          this.setState({ products: [], isLoading: true });
        } else {
          this.setState({ isLoading: false, loadingMore: true });
        }
        var headers = AppSessionManager.shared().getAuthorizationHeader();

        var url =
          API.SearchProduct + '?items_per_page=15&page=' + currentPage + sortBy;

        // If Price Range is set in Filter screen
        if (priceRange.length > 0) {
          const priceRangeParam = this.formatPriceRange();
          url = url + priceRangeParam;
        }

        url = url + '&search=' + this.state.searchText;

        console.log(url);
        Axios.get(url, headers, AXIOS_CONFIG)
          .then(result => {
            console.log(result.data);
            if (Array.isArray(result.data.Products)) {
              var products = this.state.products.concat(result.data.Products);
              this.setState(
                {
                  products: products,
                  isLoading: false,
                  loadingMore: false
                },
                () => {
                  this.updateCartItems();
                }
              );
            } else {
              this.setState({
                isLoading: false,
                loadingMore: false
              });
            }
          })
          .catch(err => {
            this.setState({
              isLoading: false,
              loadingMore: false
            });
            console.log(err.response);
          });
      } else {
      }
    });
  }

  renderProductList = () => {
    return (
      <View style={{ height: '85%', backgroundColor: '#f3f3f3' }}>
        <Grid
          numColumns={3}
          data={this.state.products}
          ListEmptyComponent={
            <View style={{ marginTop: 100 }}>
              {this.state.isLoading == false && (
                <EmptyView
                  type={2}
                  action={this.emptyAction}
                  customStyle={{ height: '60%' }}
                />
              )}
            </View>
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={product => (
            <STCartGridItem
              item={product.item}
              action={this.productItemClicked}
            />
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
  };

  renderSortHeader = () => {
    const {
      isSortVisible,
      isFilterVisible,
      sortBy,
      priceRange,
      categories
    } = this.state;
    // if (this.state.products.length > 0) {
    return (
      <View>
        <SortByFilterView sort={this.sortClicked} filter={this.filterClicked} />

        {isSortVisible == true && (
          <SortView
            visible={isSortVisible}
            action={this.sortOptionChanged}
            sortBy={sortBy}
          />
        )}
        {isFilterVisible == true && (
          <StoreFilter
            visible={isFilterVisible}
            applyFilter={this.applyFilterAction}
            backAction={this.backFilterClicked}
            priceRange={priceRange}
          />
        )}
      </View>
    );
    // }
    return <View />;
  };

  updateCartItems() {
    var cartitems = AppSessionManager.shared().getOrders();
    var products = this.state.products;
    for (let [i, cartItem] of cartitems.entries()) {
      console.log(cartItem);
      for (let [i, product] of products.entries()) {
        if (product.product_id == cartItem.product_id) {
          // debugger;
          if (Array.isArray(cartItem.options) && cartItem.options.length > 0) {
          } else {
            products[i].quantity = cartItem.quantity;
            products[i].options = cartItem.options;
          }
        }
      }
    }
    this.setState({ products: products });
  }

  checkCartProducts() {
    if (AppSessionManager.shared().isCartChanged == true) {
      AppSessionManager.shared().isCartChanged = false;
      var cartitems = AppSessionManager.shared().getOrders();
      var products = this.state.products;
      for (let [i, cartItem] of cartitems.entries()) {
        console.log(cartItem);
        for (let [i, product] of products.entries()) {
          if (product.product_id == cartItem.product_id) {
            //  debugger;
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
        <Spinner visible={this.state.isLoading} animation={'fade'} />
        <View
          style={{
            marginHorizontal: 15,
            backgroundColor: '#e0e0e0',
            borderRadius: 10,
            marginVertical: 5,
            flexDirection: 'row'
          }}
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
            placeholder={'Enter Search Term'}
            returnKeyType={'search'}
            onChange={event => {
              this.searchChange(event.nativeEvent.text);
            }}
            value={this.state.searchText}
            onKeyPress={this.handleKeyDown}
            onSubmitEditing={this.searchSubmit}
            clearButtonMode={'while-editing'}
            style={{ color: 'black', height: 50, width: '85%' }}
          />
        </View>

        {this.renderSortHeader()}
        {this.renderProductList()}
      </View>
    );
  }

  searchChange = text => {
    this.setState({ searchText: text });
  };

  searchSubmit = () => {
    this.setState({ currentPage: 1 });
    setTimeout(() => {
      this.fetchProducts();
    }, 100);
  };
}

/*
 selected_options : [
   {
    modifier: "0.000"
modifier_type: "A"
option_id: "1607"
position: "10"
selected: true
variant_id: "3163"
variant_name: "500g"
weight_modifier: "0.000"
weight_modifier_type: "A",
  option_title: 'Weight'
   }
 ]
*/
