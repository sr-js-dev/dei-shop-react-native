import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Dimensions
} from 'react-native';

import {
  DEIBoldText,
  DEIRegularText,
  DEIMediumText,
  SgButton,
  CartButton,
  StoreCartItem,
  QuickSandRegular,
  AXIOS_CONFIG
} from '../../components/index';

import Spinner from 'react-native-loading-spinner-overlay';
import { cartItems } from '../../components/mockData';
import { EmptyView } from '../../components/EmptyView';
import AppSessionManager from '../../components/AppSessionManager';
import { NavigationEvents } from 'react-navigation';
import Axios from 'axios';
import API from '../../components/API';
import moment from 'moment';

const screenHeight = Dimensions.get('screen').height;

class CartList extends Component {
  static navigationOptions = {
    title: 'Cart'
  };
  constructor(props) {
    super(props);

    this.state = {
      subTotal: '',
      deliveryFee: 0,
      grandTotal: 0,
      items: [],
      subTotal: 0,
      isLoading: false,
      card_id: '0',
      delivery_fee: {}
    };
  }

  fetchItemsForCart = () => {
    var cartitems = AppSessionManager.shared().getOrders();
    var currentOrders = [];
    if (cartitems.length > 0) {
      currentOrders = cartitems;
    }
    this.setState({ items: currentOrders });

    // Calculate sub total
    this.calculateItemsTotal(currentOrders);
  };

  deleteProductItem = product => {
    var productOrderIndex = -1;
    if (product != null) {
      if (product.orderIndex != null) {
        productOrderIndex = product.orderIndex;
      }
    }

    if (productOrderIndex == -1) {
      return;
    }

    var cartitems = AppSessionManager.shared().getOrders();

    const filteredItems = cartitems.filter(function(item) {
      return item.orderIndex !== productOrderIndex;
    });

    for (let index = 0; index < filteredItems.length; index++) {
      const element = filteredItems[index];
      console.log(element);
    }

    AppSessionManager.shared().updateOrderList(filteredItems);
    this.setState({
      items: filteredItems
    });
    this.calculateItemsTotal(filteredItems);
    console.log('Find index' + filteredItems);
  };

  calculateItemsTotal = currentOrders => {
    var subTotalAmount = 0;

    for (let index = 0; index < currentOrders.length; index++) {
      const item = currentOrders[index];
      const amount = item.price;
      console.log(amount);
      var totalItemAmount = Number(amount); // * item.quantity;
      let selectedOptions = item.options;
      if (Array.isArray(item.options) && item.options.length > 0) {
        totalItemAmount = item.finalPriceValue * item.quantity;
        subTotalAmount += totalItemAmount;
      } else {
        totalItemAmount = Number(amount) * item.quantity;
        subTotalAmount += totalItemAmount;
      }
    }

    var grandTotalAmount = (this.state.deliveryFee + subTotalAmount).toFixed(2);
    this.setState({
      subTotal: subTotalAmount.toFixed(2),
      grandTotal: grandTotalAmount
    });
  };

  clearCart = () => {
    AppSessionManager.shared().resetCart();
    this.setState({ items: [] });
  };

  checkoutCompleted = () => {
    console.log('Checkout completed');
    this.setState({ card_id: '0' });
  };

  updateCartItemToAPI(item) {
    var cartId = this.state.card_id;
    var subTotal = this.state.subTotal;

    var productOptions = '';
    if (
      item.product_option_param != null &&
      Object.keys(item.product_option_param).length > 0
    ) {
      productOptions = JSON.stringify(item.product_option_param);
    }
    const cartParams = {
      cart_id: cartId,
      product_id: item.product_id,
      amount: item.quantity,
      product_options: productOptions
    };

    
    return new Promise((resolve, reject) => {
      var headers = AppSessionManager.shared().getAuthorizationHeader();
      Axios.post(API.CartAdd, cartParams, headers)
        .then(result => {
          const cart = result.data.Cart;
          var delivery_fee = {};
          var cardIdValue = '0';
          if (cart.id != null) {
            cardIdValue = cart.id;
          }
          if (cart.delivery_fee != null) {
            delivery_fee = cart.delivery_fee;
          }

          this.setState({ card_id: cardIdValue, delivery_fee: delivery_fee });
          resolve(result);
        })
        .catch(err => {
          resolve(err.response);
        });
    });
  }

  async processCartItems() {
    var cartitems = AppSessionManager.shared().getOrders();
    // console.log('2222222222222222222222',cartitems);
    let result;
    var responsearray = [];
    for (let i = 0; i < cartitems.length; i++) {
      result = await this.updateCartItemToAPI(cartitems[i]);
      console.log(result);
      responsearray[i] = result.data;
    }
    this.setState({ isLoading: false });
    return responsearray;
  }

  checkoutAction = () => {
    this.setState({ isLoading: true });
    const data = this.processCartItems();
    // console.log('22222222222222222222222',data);
    data.then(result => {
      console.log(result);

      const checkoutInfo = {
        cartId: this.state.card_id,
        delivery_fee: this.state.delivery_fee,
        itemTotal: this.state.subTotal
      };

      AppSessionManager.shared().saveCheckoutInfo(checkoutInfo);
      this.props.navigation.navigate('CheckoutMain', {
        cartId: this.state.card_id,
        delivery_fee: this.state.delivery_fee,
        itemTotal: this.state.subTotal,
        checkoutCompleted: this.checkoutCompleted
      });
    });
  };

  renderFooter = () => {
    if (this.state.items.length < 1) {
      return <View />;
    }
    const {
      safeTextStyle,
      removeCartStyle,
      promoApplyTextStyle,
      promoTextInputStyle,
      deleteCartIconStyle
    } = styles;
    return (
      <View style={{ marginHorizontal: 20 }}>
        {/* <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <PromoCodeShadowView style={{ width: '78%', marginRight: 10 }}>
            <TextInput
              placeholder={'Enter promo code'}
              style={promoTextInputStyle}
            />
          </PromoCodeShadowView>
          <PromoCodeShadowView>
            <TouchableOpacity style={{}}>
              <DEIRegularText title={'Apply'} style={promoApplyTextStyle} />
            </TouchableOpacity>
          </PromoCodeShadowView>
        </View> */}

        <TouchableOpacity onPress={this.clearCart} style={removeCartStyle}>
          <Image
            style={deleteCartIconStyle}
            source={require('../../assets/Stores/ic_delete_cart.png')}
          />
          <DEIRegularText
            title={'Remove all items from cart'}
            style={{ color: '#FF8960' }}
          />
        </TouchableOpacity>

        <View>
          <View style={{ height: 0.3, backgroundColor: '#707070' }} />
          <TotalView title={'Total'} amount={'$' + this.state.subTotal} />
          <View style={{ height: 0.3, backgroundColor: '#707070' }} />
          {/* <TotalView
            title={'Delivery Fee'}
            amount={'$' + this.state.deliveryFee}
          /> */}
          {/* 
          <View style={{ height: 0.3, backgroundColor: '#707070' }} />
          <TotalView title={'Total'} amount={'$' + this.state.grandTotal} />
          <View style={{ height: 0.3, backgroundColor: '#707070' }} /> */}

          <View style={{ alignItems: 'center', margin: 10 }}>
            <CartButton title={'Checkout'} action={this.checkoutAction} />
          </View>
        </View>
        <View style={safeTextStyle}>
          <Image
            style={{ width: 24, height: 36 }}
            source={require('../../assets/Stores/ic_secure.png')}
          />
          <DEIRegularText
            title={'Safe and secure payments.100% Authentic products.'}
            style={{ marginHorizontal: 15 }}
          />
        </View>
      </View>
    );
  };

  // when Continue empty button pressed from empty cart view
  showHome = () => {
    // const mockCheckoutInfo = {
    //   cardId: '23',
    //   delivery_fee: { display: '$5.99', value: 5.99 },
    //   itemTotal: 0.59
    // };

    // AppSessionManager.shared().saveCheckoutInfo(mockCheckoutInfo);
    // this.props.navigation.navigate('CheckoutMain');
    this.props.navigation.navigate('Home');
  };

  renderHeader = () => {
    if (this.state.items.length > 0) {
      return (
        <DEIBoldText
          title={'Selected Items'}
          style={{ fontSize: 18, marginVertical: 10, marginLeft: 10 }}
        />
      );
    }
    return <View style={{ height: 1 }} />;
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            this.fetchItemsForCart();
          }}
        />
        <Spinner
          visible={this.state.isLoading}
          textContent={'Adding items to cart'}
        />
        <FlatList
          style={{ height: '100%' }}
          data={this.state.items}
          extraData={this.state}
          keyExtractor={(index, item) => index.toString()}
          ListHeaderComponent={this.renderHeader()}
          ListEmptyComponent={
            <View
              style={{
                height: screenHeight - 100,
                justifyContent: 'center'
              }}
            >
              <EmptyView type={1} action={this.showHome} />
            </View>
          }
          ListFooterComponent={this.renderFooter()}
          keyExtractor={(index, item) => item.id}
          renderItem={({ item }) => (
            <StoreCartItem
              item={item}
              qstatus={true}
              quantityChanged={this.fetchItemsForCart}
              deleteProduct={this.deleteProductItem}
              isfromCart={true}
              showDelete={true}
            />
          )}
        />
        {/* {this.renderFooter()} */}
      </View>
    );
  }
}

const PromoCodeShadowView = props => {
  return (
    <View style={[styles.promocodeViewStyle, props.style]}>
      {props.children}
    </View>
  );
};

const TotalView = ({ title, amount }) => {
  const fontSizeAmount = title == 'Total' ? 22 : 16;
  return (
    <View style={styles.totalViewStyle}>
      <DEIRegularText title={title} style={{ fontSize: 14 }} />
      <DEIRegularText title={amount} style={{ fontSize: fontSizeAmount }} />
    </View>
  );
};

const styles = StyleSheet.create({
  totalViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  deleteCartIconStyle: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    marginHorizontal: 10
  },
  removeCartStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    flexDirection: 'row'
  },
  safeTextStyle: {
    backgroundColor: '#F8F8FF',
    minHeight: 62,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    marginTop: 10
  },
  promocodeViewStyle: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff'
  },
  promoApplyTextStyle: {
    fontSize: 17,
    margin: 10,
    color: '#8CA2F8'
  },
  promoTextInputStyle: {
    fontSize: 15,
    fontFamily: QuickSandRegular,
    width: '100%',
    marginLeft: 15
  }
});
export default CartList;
