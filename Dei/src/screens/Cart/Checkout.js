import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import {
  PagerTabIndicator,
  IndicatorViewPager,
  PagerTitleIndicator,
  PagerDotIndicator
} from 'rn-viewpager';
import { DEIMediumText, AXIOS_CONFIG } from '../../components';

import CheckoutTabView from './CheckoutTabView';

import CartPaymentView from './CartPayment';
import CartDelivery from './CartDelivery';
import CartConfirmation from './CartConfirmation';
import AppSessionManager from '../../components/AppSessionManager';
import Axios from 'axios';
import API from '../../components/API';
import Spinner from 'react-native-loading-spinner-overlay';

class Checkout extends Component {
  static navigationOptions = {
    title: 'Checkout',
    headerBackTitle: 'Back'
  };

  constructor(props) {
    super(props);

    var cartId = this.props.navigation.getParam('cartId', '');
    console.log('cart id' + cartId);
    // var delivery_fee = this.props.navigation.getParam('delivery_fee', {});
    // console.log(cardId);
    // var itemTotal = this.props.navigation.getParam('itemTotal', 0.0);
    this.state = {
      selectedMenu: 1,
      deliveryInfo: {},
      isCardRefresh: false,
      completedTabStatus: 1,
      cart_id: cartId,
      isLoading: false,
      chargeInfo: {},
      paymentStatusDone: false
    };
  }

  menuOptionChanged = title => {
    this.setState({ selectedMenu: title });
  };

  changeTabStatus = status => {
    this.setState({ completedTabStatus: status });
    this.menuOptionChanged(2);
  };

  addCard = () => {
    this.props.navigation.navigate('AddNewCard', {
      refreshItem: item => this.refreshItem(item)
    });
  };

  refreshItem(item) {
    this.setState({ isCardRefresh: true });
    //alert(item.id);
  }

  gotoHomeTab = () => {
    // this.menuOptionChanged(1);
    AppSessionManager.shared().resetCart();
    this.props.navigation.goBack();
    this.props.navigation.state.params.checkoutCompleted();
    // setTimeout(() => {
    //   this.props.navigation.navigate('Home');
    // }, 100);
  };

  deliveryCompleted = details => {
    // console.log('11111111111',details);
    this.setState({ deliveryInfo: details, selectedMenu: 2 });
    // AppSessionManager.shared().resetCart();
    // this.props.navigation.goBack();
  };

  proceedToPay = cardInfo => {
    // console.log(this.state.deliveryInfo);
    // console.log(cardInfo);

    if (cardInfo.id == null) {
      alert('Unable to process payment - please try again later');
      return;
    }

    const { address, deliveryInfo } = this.state.deliveryInfo;
    if (address.id == null) {
      alert('Unable to process payment - please try again later');
      return;
    }

    if (
      deliveryInfo.delivery_date == null ||
      deliveryInfo.delivery_timeslot == null
    ) {
      alert('Unable to process payment - please try again later');
      return;
    }

    // const params = {
    //   cart_id: this.state.cart_id,
    //   card_id: cardInfo.id,
    //   address_id: address.id,
    //   delivery_date: deliveryInfo.delivery_date,
    //   delivery_timeslot: deliveryInfo.delivery_timeslot
    // };

    var headers = AppSessionManager.shared().getAuthorizationHeader();
    // console.log(headers);
    //this.menuOptionChanged(3);
    var url =
      API.Checkout +
      `?cart_id=${this.state.cart_id}&card_id=${cardInfo.id}&address_id=${
        address.id
      }&delivery_date=${deliveryInfo.delivery_date}&delivery_timeslot=${
        deliveryInfo.delivery_timeslot
      }`;

    // console.log('1111111111111111111111',url);
    this.setState({ isLoading: true, isCardRefresh: false });
    // console.log('11111111111111111111','22222222222222222');
    Axios.get(url, headers, AXIOS_CONFIG)
      .then(response => {
        // console.log('11111111111111111111',response);

        var chargeDetails = { status: false, message: '' };
        if (response.status == 200) {
          chargeDetails = response.data.Charge;
          chargeDetails.status = true;
          // console.log(chargeDetails);
        }
        this.setState(
          {
            chargeInfo: chargeDetails,
            isLoading: false
          },
          () => {
            this.menuOptionChanged(3);
          }
        );
      })
      .catch(err => {
        var message = '';
        if (err.response.data != null) {
          const error = err.response.data.error;
          if (error != null) {
            message = error.message;
          }
        }
        console.log(err.response);
        this.setState(
          {
            chargeInfo: {
              status: false,
              message: message
            },
            isLoading: false
          },
          () => {
            this.menuOptionChanged(3);
          }
        );
      });
  };

  renderTabContentView = () => {
    const {
      selectedMenu,
      deliveryInfo,
      isCardRefresh,
      chargeInfo
    } = this.state;
    console.log(deliveryInfo);
    switch (selectedMenu) {
      case 2:
        return (
          <CartPaymentView
            action={this.proceedToPay}
            addCardAction={() => this.addCard()}
            refreshCard={isCardRefresh}
            deliveryInfo={deliveryInfo}
          />
        );
        break;
      case 3:
        return (
          <CartConfirmation
            action={() => this.gotoHomeTab()}
            charge={chargeInfo}
          />
        );
        break;
      default:
        return (
          <CartDelivery
            action={this.deliveryCompleted.bind(this)}
            changeTabStatus={this.changeTabStatus}
            delivery={deliveryInfo}
          />
        );
        break;
    }
  };

  render() {
    const { selectedMenu, completedTabStatus } = this.state;
    const { tabContentViewStyle, viewStyle } = styles;
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.isLoading} />
        <View style={styles.viewStyle}>
          <CheckoutTabView
            selectedMenu={selectedMenu}
            menuChanged={this.menuOptionChanged}
            completedStatus={completedTabStatus}
          />
        </View>
        <View style={tabContentViewStyle}>{this.renderTabContentView()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    backgroundColor: '#fff',
    height: '6%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8
  },
  tabContentViewStyle: {
    backgroundColor: '#f5f5f5',
    height: '94%',
    marginTop: 30
  }
});

export default Checkout;
