import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { DEIMediumText, DEIRegularText } from '../../components';

class MyOrderItem extends Component {
  constructor(props) {
    super(props);
    var product = {};
    var quantity = '';
    if (this.props.product != null) {
      if (this.props.product.detail != null) {
        product = this.props.product.detail;
      }
      if (this.props.product.amount != null) {
        quantity = this.props.product.amount;
      }
    }

    this.state = {
      productDetail: product,
      quantity: quantity
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product != null) {
      this.setState({ product: nextProps.product });
    }
  }

  productImageUrl = item => {
    // console.log(item.product);
    var imageurl = '';
    if (item != null) {
      if (item.main_pair != null) {
        if (item.main_pair.icon != null) {
          imageurl = item.main_pair.icon.image_path;
        } else if (item.main_pair.detailed != null) {
          imageurl = item.main_pair.detailed.image_path;
        }
      }
    }

    return imageurl;
  };

  renderOption = (title, desc) => {
    return (
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <DEIRegularText title={title} style={{ color: '#C2C4CA' }} />
        <DEIRegularText
          title={desc}
          style={{ marginLeft: 10, color: '#262628' }}
        />
      </View>
    );
  };

  render() {
    const { product, price, amount } = this.state.productDetail;
    var priceVal = '';
    if (price != null) {
      priceVal = '$' + parseFloat(price).toFixed(2);
    }

    return (
      <View style={{ backgroundColor: '#fff', marginHorizontal: 10 }}>
        <View style={{ flexDirection: 'row', margin: 20 }}>
          <Image
            source={{ uri: this.productImageUrl(this.state.productDetail) }}
            style={{
              width: 81,
              height: 101,
              borderColor: '#4A4A4A',
              borderWidth: 0.2
            }}
          />
          <View style={{ marginLeft: 15 }}>
            <DEIRegularText title={product} style={{ marginRight: 75 }} />
            <DEIMediumText
              title={'S' + priceVal}
              style={{ fontSize: 16, marginTop: 6 }}
            />
            {this.renderOption('QUANTITY', this.state.quantity)}
          </View>
        </View>
        <View style={{ backgroundColor: '#EBECED', height: 1 }} />
      </View>
    );
  }
}

export default MyOrderItem;
