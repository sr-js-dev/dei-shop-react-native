import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  CategoryMenuList,
  isNetworkConnected,
  DEIBoldText,
  AXIOS_CONFIG,
  StoreCategories,
  StoreSubCategoriesList,
  ProductGridWidth,
  DEIRegularText,
  STCartGridItem,
  SortView
} from '../../components';
import Axios from 'axios';
import AppSessionManager from '../../components/AppSessionManager';
import API from '../../components/API';
import SortByFilterView from '../../components/SortByFilterView';
import { NavigationEvents } from 'react-navigation';
import Grid from '../../components/EasyGrid';
import StoreFilter from '../../components/StoreFilter';
import { EmptyView } from '../../components/EmptyView';

// import API, { isNetworkConnected } from '/';
// import Axios from 'axios';
// import AppSessionManager from './AppSessionManager';
// import { AXIOS_CONFIG } from './APIConstants';

class BannerCategory extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Categories',
    headerTintColor: '#B19CFD',
    headerBackTitle: 'Back'
  });

  constructor(props) {
    super(props);
    var bannerItem = this.props.navigation.getParam('item', {});
    var categoryId = '';
    categoryId = bannerItem.object_id;

    this.state = {
      categories: [],
      isLoading: false,
      selectedCategoryIndex: 0,
      selectedSubCategoryIndex: 0,
      selectedCategory: {},
      currentPage: 1,
      products: [],
      loadingMore: false,
      refreshing: false,
      selectedCategoryId: categoryId,
      isSortVisible: false,
      isFilterVisible: false,
      sortBy: '&sort_order=asc&sort_by=price',
      priceRange: [],
      pageComplete: false,
      bannerCategory: bannerItem
    };
  }

  componentDidMount() {
    this.fetchProducts(this.state.selectedCategoryId);
  }

  componentWillReceiveProps = nextProps => {
    alert('next');
  };

  checkCartProducts(products) {
    if (AppSessionManager.shared().isCartChanged == true) {
      AppSessionManager.shared().isCartChanged = false;
      var cartitems = AppSessionManager.shared().getOrders();
      //var products = this.state.products;
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
          } else {
            products[i].quantity = 0;
          }
        }
      }
      this.setState({ products: products });
    }

    if (AppSessionManager.shared().checkoutCompleted == true) {
      AppSessionManager.shared().checkoutCompleted = false;
      for (let [i, product] of products.entries()) {
        products[i].quantity = 0;
      }
      this.setState({ products: products });
    }
  }

  parseCategoryResponse(result) {
    var category = [];
    if (Object.keys(result.data.Categories).length > 0) {
      var categoryList = result.data.Categories;
      for (var key in categoryList) {
        category.push(categoryList[key]);
      }
    }

    var selectedCategoryItem = {};
    if (Object.keys(this.state.selectedCategory).length == 0) {
      if (category.length > 0) {
        selectedCategoryItem = category[0];
      }
    } else {
      selectedCategoryItem = this.state.selectedCategory;
    }
    this.setState({
      categories: category,
      selectedCategory: selectedCategoryItem,
      selectedCategoryId: selectedCategoryItem.category_id,
      isLoading: false,
      loadingMore: false
    });

    if (Object.keys(this.state.selectedCategory).length > 0) {
      this.fetchProducts(this.state.selectedCategory.category_id);
    }
  }

  subcategoriesClicked = item => {
    this.setState({
      selectedSubCategoryIndex: item.selectedIndex,
      products: [],
      selectedCategoryId: item.category_id,
      currentPage: 1,
      pageComplete: false
    });
    setTimeout(() => {
      this.fetchProducts(item.category_id);
    }, 200);
  };

  categoryItemClicked = category => {
    this.setState({
      selectedCategory: category,
      selectedCategoryId: category.category_id,
      selectedSubCategoryIndex: 0,
      pageComplete: false,
      products: []
    });
    setTimeout(() => {
      this.fetchProducts(category.category_id);
    }, 200);
  };

  // https://github.com/morishin/react-native-infinite-scroll-grid
  // https://github.com/danke77/react-native-easy-listview-gridview

  formatPriceRange = () => {
    if (this.state.priceRange.length < 2) {
      return;
    }
    return `&price_from=${this.state.priceRange[0]}&price_to=${
      this.state.priceRange[1]
    }`;
  };

  fetchProducts(category_id) {
    if (this.state.pageComplete) {
      return;
    }
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        const {
          selectedCategory,
          currentPage,
          priceRange,
          sortBy
        } = this.state;
        if (this.state.currentPage == 1) {
          this.setState({ products: [], isLoading: true });
        } else {
          this.setState({ isLoading: false, loadingMore: true });
        }
        var headers = AppSessionManager.shared().getAuthorizationHeader();
        // http://api.dei.com.sg/api/product/category/815/?items_per_page=30&page=6
        var url =
          API.CategoryProductList +
          category_id +
          '?items_per_page=15&page=' +
          currentPage +
          sortBy;

        // If Price Range is set in Filter screen
        if (priceRange.length > 0) {
          const priceRangeParam = this.formatPriceRange();
          url = url + priceRangeParam;
        }

        console.log(url);
        Axios.get(url, headers, AXIOS_CONFIG)
          .then(result => {
            console.log(result.data);
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
                pageComplete: true,
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

  onRefresh = () => {};

  onEndReached = () => {
    const { currentPage, selectedCategoryId, isLoading } = this.state;
    if (isLoading) {
      return;
    }

    this.setState({ currentPage: currentPage + 1 });
    if (selectedCategoryId.length < 1) {
      return;
    }
    setTimeout(() => {
      this.fetchProducts(selectedCategoryId);
    }, 200);
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
        {categories.length > 0 && (
          <SortByFilterView
            sort={this.sortClicked}
            filter={this.filterClicked}
          />
        )}

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

  productItemClicked = item => {
    // console.log(item);
    this.props.navigation.navigate('HomeProductDetail', {
      ProductId: item.product_id,
      count: item.quantity,
      product: item
    });
  };

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
    //this.filterClicked();
    console.log(priceRange);
    this.setState({
      priceRange: priceRange,
      isFilterVisible: false,
      currentPage: 1,
      pageComplete: false
    });
    setTimeout(() => {
      this.fetchProducts(this.state.selectedCategoryId);
    }, 200);
  };

  emptyAction = () => {
    this.setState({ currentPage: 1 });
    setTimeout(() => {
      this.fetchProducts(this.state.selectedCategoryId);
    }, 100);
  };

  renderEmptyList = () => {
    if (this.state.isLoading) {
      return <View />;
    }
    return (
      <EmptyView
        type={2}
        action={this.emptyAction}
        customStyle={{ height: '60%' }}
      />
    );
  };

  renderProductList = () => {
    return (
      <View style={{ height: '100%', backgroundColor: '#fff' }}>
        <Grid
          numColumns={3}
          data={this.state.products}
          ListHeaderComponent={this.renderHeader()}
          ListEmptyComponent={
            <View style={{ marginTop: 100 }}>
              {this.state.isLoading ? (
                <View />
              ) : (
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

    console.log('render empty lsit');
  };

  renderHeader = () => {
    const { name, image } = this.state.bannerCategory;
    return (
      <View style={{ backgroundColor: '#fff' }}>
        <View style={{ marginHorizontal: 20 }}>
          <Image
            source={{ uri: image }}
            style={{ width: '100%', height: 150, resizeMode: 'contain' }}
          />
          <DEIBoldText title={name} style={{ fontSize: 18 }} />
          {/* <DEIRegularText
            title={name}
            style={{ color: '#A1A1B4', marginTop: 10 }}
          /> */}
          <View style={{ height: 30 }} />
        </View>
      </View>
    );
  };

  render() {
    const { categories, selectedCategoryIndex } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            this.checkCartProducts(this.state.products);
          }}
        />
        <Spinner visible={this.state.isLoading} animation={'fade'} />

        <View style={{ marginTop: 10 }}>
          {/* {this.renderHeader()} */}
          {this.renderProductList()}
        </View>
      </View>
    );
  }
}

export default BannerCategory;
