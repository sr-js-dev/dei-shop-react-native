import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import {
  CartButton,
  DEIBoldText,
  DEIRegularText,
  DEIMediumText
} from '../../components/index';

class CartTotalView extends Component {
  constructor(props) {
    super(props);
    var checkout = {};
    if (this.props.checkoutInfo != null) {
      checkoutInfo = this.props.checkoutInfo;
    }
    console.log(checkoutInfo);

    this.state = {
      checkoutInfo: checkoutInfo,
      subTotal: '',
      deliveryfee: '',
      grandTotal: ''
    };
  }

  renderTotalView = () => {
    var deliveryFee = '';
    var deliveryFeeVal = 0;
    var subTotalValue = 0;

    const { delivery_fee, itemTotal } = this.state.checkoutInfo;
    if (delivery_fee != null && Object.keys(delivery_fee).length > 0) {
      const display = delivery_fee.display;
      if (display != null) {
        deliveryFee = display;
      }
      if (delivery_fee.value != null) {
        deliveryFeeVal = delivery_fee.value;
      }
    }
    var subTotal = '';
    if (itemTotal != null) {
      subTotal = '$' + itemTotal;
    }
    var itemTotalVal = parseFloat(itemTotal);
    var grandTotal = parseFloat(deliveryFeeVal + itemTotalVal).toFixed(2);
    return (
      <View style={{ backgroundColor: '#fff' }}>
        <View style={{ marginHorizontal: 20 }}>
          <TotalView title={'Sub Total'} amount={subTotal} />
          <TotalView title={'Delivery Fee'} amount={deliveryFee} />

          <View style={{ height: 0.3, backgroundColor: '#707070' }} />
          <TotalView title={'Total'} amount={'$' + grandTotal} />
          <View style={{ height: 0.3, backgroundColor: '#707070' }} />
{/* 
          <View style={{ alignItems: 'center', margin: 10 }}>
            <CartButton
              title={this.props.btnTitle}
              action={() => this.props.action()}
            />
          </View> */}
        </View>

        <View style={styles.safeTextStyle}>
          <Image
            style={{
              width: 24,
              height: 36,
              resizeMode: 'contain',
              marginLeft: 10
            }}
            source={require('../../assets/Stores/ic_secure.png')}
          />
          <DEIRegularText
            title={'123Safe and secure payments.100% Authentic products.'}
            style={{ marginHorizontal: 15 }}
          />
        </View>
      </View>
    );
  };

  render() {
    return <View>{this.renderTotalView()}</View>;
  }
}

const TotalView = ({ title, amount }) => {
  return (
    <View style={styles.totalViewStyle}>
      <DEIRegularText title={title} style={{ fontSize: 14 }} />
      {title == 'Total' ? (
        <DEIBoldText title={amount} style={{ fontSize: 20 }} />
      ) : (
        <DEIRegularText title={amount} style={{ fontSize: 16 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeTextStyle: {
    backgroundColor: '#F8F8FF',
    height: 62,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  totalViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  }
});

export default CartTotalView;
