import React, { Component } from 'react';
import { View, ScrollView, Image, Platform } from 'react-native';

import {
  DEIRegularText,
  GradientBgView,
  DEIBoldText,
  CartButton,
  PrimaryView
} from '../../components';

class CartConfirmation extends Component {
  constructor(props) {
    super(props);
    //debugger;
    var chargeInfo = {};
    var status = false;
    var message = '';
    if (this.props.charge != null) {
      chargeInfo = this.props.charge;
      if (chargeInfo.status != null) {
        status = chargeInfo.status;
      }
      if (chargeInfo.message != null) {
        message = chargeInfo.message;
      }
    }
    this.state = { charge: chargeInfo, status: status, message: message };
  }

  backToOrderClicked = () => {
    this.props.action();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ConfirmationPopup
          charge={this.state.charge}
          isSuccess={this.state.status}
          action={() => this.props.action()}
        />
      </View>
    );
  }
}

const ConfirmationPopup = ({ charge, isSuccess, action }) => {
  const title = isSuccess == true ? 'Congratulations' : 'Payment Failed';
  const btnTitle = isSuccess == true ? 'Back to order' : 'Try Again';
  const desc =
    isSuccess == true
      ? 'Your Order has been Accepted'
      : 'Unfortunately Payment wes rejected';

  const icon =
    isSuccess == true
      ? require('../../assets/Cart/ic_payment_success.png')
      : require('../../assets/Cart/ic_payment_failed.png');

  const heightofPopup = Platform.OS == 'ios' ? '70%' : '80%';
  return (
    <GradientBgView>
      <View
        style={{
          backgroundColor: '#fff',
          width: '80%',
          height: heightofPopup,
          borderColor: '#fff',
          borderRadius: 6,
          borderWidth: 1
        }}
      >
        <DEIBoldText
          title={title}
          style={{
            color: '#B19CFD',
            textAlign: 'center',
            marginTop: 18,
            fontSize: 16
          }}
        />

        <Image
          style={{
            width: 105,
            height: 105,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginTop: 20
          }}
          source={icon}
        />
        <View style={{ marginHorizontal: 30, marginTop: 20 }}>
          <DEIRegularText
            title={desc}
            style={{ color: '#1E233D', textAlign: 'center' }}
          />
          <View style={{ marginTop: 20 }}>
            <StatusView type={isSuccess} charge={charge} />
          </View>
        </View>
        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
          <CartButton title={btnTitle} action={action} />
        </View>
      </View>
    </GradientBgView>
  );
};

const StatusView = ({ charge, type }) => {
  const imageAmt = require('../../assets/Cart/ic_payment_amount.png');
  const imageStatus = require('../../assets/Cart/ic_payment_status.png');
  var amount = '';
  var orderId = '';
  var msg = '';

  if (charge != null) {
    if (charge.order != null && charge.order.total != null) {
      amount = '$' + charge.order.total + ' SGD';
    }
    if (charge.order != null && charge.order.order_id != null) {
      orderId = 'PNR Code  ' + charge.order.order_id;
    }
    if (charge.message != null) {
      msg = charge.message;
    }
  }

  return type == true ? (
    <View>
      <AmountView
        title={'Your Receipt'}
        desc={'View your payment Summary'}
        image={imageAmt}
      />
      <AmountView title={'Transaction ID'} desc={orderId} image={imageStatus} />
    </View>
  ) : (
    <View>
      <AmountView title={'Amount:'} desc={amount} image={imageAmt} />
      <AmountView title={'Statement:'} desc={msg} image={imageStatus} />
    </View>
  );
};

const AmountView = ({ title, desc, image }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginHorizontal: 20
      }}
    >
      <Image
        source={image}
        style={{
          width: 15,
          height: 22,
          resizeMode: 'contain',
          marginHorizontal: 10
        }}
      />
      <View style={{ marginVertical: 6 }}>
        <DEIRegularText title={title} style={{ fontSize: 12 }} />
        <DEIRegularText title={desc} style={{ fontSize: 10, marginTop: 5 }} />
      </View>
    </View>
  );
};

export default CartConfirmation;
