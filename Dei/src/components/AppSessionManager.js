import { getUserToken } from './Auth';

export default class AppSessionManager {
  static myInstance = null;

  orders = [];
  userToken = '';
  isCartChanged = false;
  isHomeChanged = false;
  checkoutCompleted = false;
  isProfileUpdated = false;
  deliveryFee = {};
  checkoutInfo = {};
  aboutUrl = '';
  termsUrl = '';
  userInfo = {};
  navigation = null;

  static shared() {
    if (AppSessionManager.myInstance == null) {
      AppSessionManager.myInstance = new AppSessionManager();
    }

    return this.myInstance;
  }

  constructor() {
    console.log('constructor called');
    //this.saveSessionUserToken();
  }

  saveSessionUserToken() {
    getUserToken()
      .then(token => {
        this.userToken = token;
      })
      .catch(err => {
        this.userToken = '';
      });
  }

  getAuthorizationHeader = () => {
    return {
      headers: {
        Authorization: 'Bearer ' + this.userToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    };
  };

  updateSessionToken = token => {
    this.userToken = token;
  };

  getCheckoutInfo = () => {
    return this.checkoutInfo;
  };

  saveCheckoutInfo = details => {
    this.checkoutInfo = details;
  };

  getDeliveryFee = () => {
    return this.deliveryFee;
  };

  saveDeliveryFee = details => {
    this.deliveryFee = details;
  };

  getUserToken() {
    return this.userToken;
  }

  getOrders() {
    return this.orders;
  }

  getBadgeCount() {
    return this.orders.length;
  }

  setNavigation(navigation) {
    this.navigation = navigation;
  }

  setBadgeValue = () => {
    if (this.navigation !== null)
      this.navigation.setParams({ badgeCount: this.orders.length });
  };

  saveAboutUrl = url => {
    this.aboutUrl = url;
  };
  getAboutUrl() {
    return this.aboutUrl;
  }

  saveTermsUrl = url => {
    this.termsUrl = url;
  };
  getTermsUrl() {
    return this.termsUrl;
  }

  saveUserInfo = userInfo => {
    this.userInfo = userInfo;
  };
  getUserInfo() {
    return this.userInfo;
  }

  resetCart() {
    this.orders = [];
    this.deliveryFee = {};
    this.checkoutInfo = {};
    this.isCartChanged = true;
    this.isHomeChanged = true;
    this.checkoutCompleted = true;
    this.setBadgeValue();
  }

  // This is called when any product item is delete from cart list
  updateOrderList = ordersList => {
    this.orders = ordersList;
    this.isCartChanged = true;
    this.isHomeChanged = true;
    this.setBadgeValue();
  };

  addItemToCart(item) {
    var orderTempList = [];
    if (this.orders.length > 0) {
      orderTempList = this.orders;
    }
    var cartOrderIndex = -1;
    var productInfo = Object.assign({}, item);
    // if (productInfo.quantity > 0) {
    for (let rowIndex = 0; rowIndex < orderTempList.length; rowIndex++) {
      const element = orderTempList[rowIndex];
      if (element.orderIndex == productInfo.orderIndex) {
        cartOrderIndex = rowIndex;
        break;
      }
    }
    //}

    if (cartOrderIndex == -1) {
      //productInfo.orderindex = this.orders.length + 1;
      orderTempList.push(productInfo);
    } else {
      if (productInfo.quantity == 0) {
        var orderList = orderTempList.filter(
          product => product.orderIndex !== productInfo.orderIndex
        );
        orderTempList = orderList;
      } else {
        //  var productItem = productInfo;

        //   productItem.options = this.orders[cartOrderIndex].options;
        console.log('cart order index' + cartOrderIndex);
        orderTempList[cartOrderIndex] = productInfo; //productItem;
      }
    }

    this.orders = orderTempList;
    this.setBadgeValue();
    console.log(this.orders);
  }

  addVarientOption(item) {
    const index = this.orders.indexOf(item);

    // const index = this.orders.findIndex(
    //   order => item.product_id === order.product_id
    // );

    if (index == -1) {
      this.orders.push(item);
    } else {
      if (item.quantity == 0) {
        var orderList = this.orders.filter(product => product !== item);
        this.orders = orderList;
      } else {
        this.orders[index] = item;
      }
    }
    console.log(this.orders);
  }

  getProductItem(item) {
    const index = this.orders.indexOf(item);

    // const index = this.orders.findIndex(
    //   order => item.product_id === order.product_id
    // );

    if (index == -1) {
      return item;
    } else {
      return this.orders[index];
    }
  }

  updateProductOption = product => {
    var orderList = this.orders;
    if (orderList.length > 0) {
      for (let index = 0; index < orderList.length; index++) {
        const orderItem = orderList[index];
        if (orderItem.product_id == product.product_id) {
          var optionIdString = orderItem.optionIdString;
          if (optionIdString == product.optionIdString) {
            orderItem.quantity = product.quantity;
          }
        }
      }
    }
  };

  updateOptions(item) {
    if (item.options.length > 0) {
      var selectedOptions = [];
      var optionInfo = [];
      let options = item.options;
      for (let index = 0; index < options.length; index++) {
        let option = options[index];
        let variants = option.variants;
        for (
          let variantIndex = 0;
          variantIndex < variants.length;
          variantIndex++
        ) {
          var variant = variants[variantIndex];
          if (variant.selected == true) {
            variant.option_name = option.option_name;
            let name = option.option_name + ' : ' + variant.variant_name;
            optionInfo.push(name);
            selectedOptions.push(variant);
          }
        }
      }
      item.optionInfo = optionInfo;
      item.selectedOptions = selectedOptions;
      return item;
    } else {
      item.optionInfo = [];
      item.selectedOptions = [];
      return item;
    }
  }
}
