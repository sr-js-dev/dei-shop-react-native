import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  CategoryMenuList,
  isNetworkConnected,
  AXIOS_CONFIG,
  StoreCategories,
  StoreSubCategoriesList,
  ProductGridWidth,
  DEIRegularText,
  STCartGridItem,
  SortView,
  DEIMediumText
} from '../../components';
import Axios from 'axios';
import AppSessionManager from '../../components/AppSessionManager';
import API from '../../components/API';
import SortByFilterView from '../../components/SortByFilterView';
import { NavigationEvents } from 'react-navigation';
import Grid from '../../components/EasyGrid';
import StoreFilter from '../../components/StoreFilter';
import { EmptyView } from '../../components/EmptyView';

export class CategoryBannerList extends Component {
  constructor(props) {
    super(props);
    var categoryId = this.props.navigation.getParam('categoryId', '');
    var categoryName = this.props.navigation.getParam('categoryName', '');
    if (categoryName.length < 1) {
      categoryName = '';
    }

    this.state = {
      categoryId: categoryId,
      categoryName: categoryName,
      isLoading: false,
      currentPage: 1,
      products: [],
      loadingMore: false,
      refreshing: false,
      isSortVisible: false,
      isFilterVisible: false,
      sortBy: '&sort_order=asc&sort_by=price',
      priceRange: [],
      pageComplete: false
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  checkCartProducts(products) {
    if (AppSessionManager.shared().isCartChanged == true) {
      AppSessionManager.shared().isCartChanged = false;
      var cartitems = AppSessionManager.shared().getOrders();
      //var products = this.state.products;
      for (let [i, cartItem] of cartitems.entries()) {
        console.log(cartItem);
        for (let [i, product] of products.entries()) {
          if (product.product_id == cartItem.product_id) {
            debugger;
            if (Array.isArray(cartItem.options) && cartItem.options.length > 0) {
              console.log('options');
            } else {
              products[i].quantity = cartItem.quantity;
              products[i].options = cartItem.options;
            }
          } else {
            products[i].quantity = 0;
          }
        }
      }
      this.setState({ products: products });
    }
  }

  fetchProducts() {
    const { categoryId } = this.state;
    if (this.state.pageComplete || categoryId.length < 1) {
      return;
    }
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        const { selectedCategory, currentPage, priceRange, sortBy } = this.state;
        if (this.state.currentPage == 1) {
          this.setState({ products: [], isLoading: true });
        } else {
          this.setState({ isLoading: false, loadingMore: true });
        }
        var headers = AppSessionManager.shared().getAuthorizationHeader();
        // http://api.dei.com.sg/api/product/category/815/?items_per_page=30&page=6
        var url = API.CategoryProductList + categoryId + '?items_per_page=15&page=' + currentPage + sortBy;

        // If Price Range is set in Filter screen
        if (priceRange.length > 0) {
          const priceRangeParam = this.formatPriceRange();
          url = url + priceRangeParam;
        }

        console.log(url);
        Axios.get(url, headers, AXIOS_CONFIG)
          .then(result => {
            console.log(result.data);
            //  debugger;
            const productList = result.data.Products;
            if (Array.isArray(productList) && productList.length > 0) {
              var products = this.state.products.concat(result.data.Products);
              this.setState({
                isLoading: false,
                loadingMore: false
              });
              AppSessionManager.shared().isCartChanged = true;
              this.checkCartProducts(products);
            } else {
              this.setState({
                isLoading: false,
                loadingMore: false,
                pageComplete: true
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

  onRefresh = () => {
    const { categoryId } = this.state;

    this.setState({ currentPage: 1, refreshing: false });
    if (categoryId.length < 1) {
      return;
    }
    setTimeout(() => {
      this.fetchProducts();
    }, 300);
  };

  onEndReached = () => {
    const { currentPage, categoryId, isLoading } = this.state;
    if (isLoading) {
      return;
    }

    this.setState({ currentPage: currentPage + 1 });
    if (categoryId.length < 1) {
      return;
    }
    setTimeout(() => {
      this.fetchProducts();
    }, 200);
  };

  emptyAction = () => {
    this.setState({ currentPage: 1 });
    setTimeout(() => {
      this.fetchProducts();
    }, 100);
  };

  productItemClicked = item => {
    this.props.navigation.navigate('HomeProductDetail', {
      ProductId: item.product_id,
      count: item.quantity,
      product: item
    });
  };

  renderProductList = () => {
    return (
      <View style={{ height: '95%', backgroundColor: '#f3f3f3' }}>
        <Grid
          numColumns={3}
          data={this.state.products}
          ListEmptyComponent={
            <View style={{ marginTop: 100 }}>
              {this.state.isLoading ? <View /> : <EmptyView type={2} action={this.emptyAction} customStyle={{ height: '60%' }} />}
            </View>
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={product => <STCartGridItem item={product.item} action={this.productItemClicked} />}
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

  renderHeader = () => {
    return (
      <View>
        {this.state.categoryName.length > 0 && (
          <DEIMediumText
            title={this.state.categoryName}
            style={{
              textAlign: 'center',
              marginVertical: 20,
              fontSize: 25,
              color: '#B19CFD'
            }}
          />
        )}
        {this.renderSortHeader()}
      </View>
    );
  };

  // Sort By / Filter Actions

  formatPriceRange = () => {
    if (this.state.priceRange.length < 2) {
      return;
    }
    return `&price_from=${this.state.priceRange[0]}&price_to=${this.state.priceRange[1]}`;
  };

  sortClicked = () => {
    this.setState({ isSortVisible: !this.state.isSortVisible });
  };

  sortOptionChanged = sort => {
    if (sort == -1) {
      return;
    }
    this.setState({ sortBy: sort, currentPage: 1, isLoading: true });
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
    //this.filterClicked();
    console.log(priceRange);
    this.setState({
      priceRange: priceRange,
      isFilterVisible: false,
      currentPage: 1,
      pageComplete: false,
      isLoading: true
    });
    setTimeout(() => {
      this.fetchProducts(this.state.selectedCategoryId);
    }, 200);
  };

  renderSortHeader = () => {
    const { isSortVisible, isFilterVisible, sortBy, priceRange } = this.state;
    // if (this.state.products.length > 0) {
    return (
      <View>
        {this.state.products.length > 0 && <SortByFilterView sort={this.sortClicked} filter={this.filterClicked} />}

        {isSortVisible == true && <SortView visible={isSortVisible} action={this.sortOptionChanged} sortBy={sortBy} />}
        {isFilterVisible == true && (
          <StoreFilter visible={isFilterVisible} applyFilter={this.applyFilterAction} backAction={this.backFilterClicked} priceRange={priceRange} />
        )}
      </View>
    );
    // }
    return <View />;
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            this.checkCartProducts(this.state.products);
          }}
        />
        <Spinner visible={this.state.isLoading} animation={'fade'} />

        <View>
          {this.renderHeader()}
          {this.renderProductList()}
        </View>
      </View>
    );
  }
}

export default CategoryBannerList;
