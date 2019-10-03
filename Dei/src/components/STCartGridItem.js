import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { STQuantityView } from '../components/STQuantityView';
import {
  DEIMediumText,
  DEIRegularText,
  QuicksandMedium,
  getProductImage
} from './APIConstants';

class STCartGridItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: this.props.item
    };
  }

  productImageUrl = item => {
    var imageurl = '';
    if (item.main_pair.icon != null) {
      console.log(item.main_pair.icon.http_image_path);
      imageurl = item.main_pair.icon.http_image_path;
    } else if (item.main_pair.detailed != null) {
      imageurl = item.main_pair.detailed.http_image_path;
    }
    return imageurl;
  };

  quantityChanged = () => {};

  detailAction = () => {
    this.props.action(this.state.item);
  };

  render() {
    const { product, price, grams, store_name } = this.props.item;
    var priceValue = 'S$' + parseFloat(price).toFixed(2);
    console.log(this.props.item);

    var storeName = '';
    if (this.props.item.store_name != null) {
      storeName = this.props.item.store_name;
    }

    const { titleStyle, gramsStyle, originalPriceStyle } = styles;
    return (
      <View
        style={{
          backgroundColor: '#fff',
          justifyContent: 'center'
        }}
      >
        <View style={{ margin: 10 }}>
          <TouchableOpacity onPress={() => this.props.action(this.state.item)}>
            <Image
              source={{ uri: getProductImage(this.state.item) }}
              style={{ width: '90%', height: 80, resizeMode: 'contain' }}
            />
            <Text
              style={{
                color: '#000000',
                fontSize: 12,
                marginTop: 5,
                fontFamily: QuicksandMedium,
                height: 50
              }}
              numberOfLines={3}
            >
              {product}
            </Text>
            <DEIRegularText
              title={storeName}
              numberOfLines={1}
              style={{
                color: '#B7B7B7',
                fontSize: 10,
                minHeight: 30,
                marginTop: 10
              }}
            />
            <DEIRegularText title={grams} style={gramsStyle} />
            <DEIRegularText title={priceValue} style={originalPriceStyle} />
          </TouchableOpacity>
          <STQuantityView
            item={this.props.item}
            quantityChanged={this.quantityChanged}
            isDetail={false}
            action={this.detailAction}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 11
  },
  gramsStyle: {
    fontSize: 10,
    color: '#424242',
    marginTop: 4,
    textAlign: 'left'
  },
  originalPriceStyle: {
    fontSize: 15,
    color: '#764BA2',
    fontWeight: '600',
    marginBottom: 10
  },
  newPriceStyle: {
    fontSize: 13,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  }
});

export { STCartGridItem };
