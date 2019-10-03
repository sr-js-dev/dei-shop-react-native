import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { STQuantityView } from './STQuantityView';
import { DEIMediumText, DEIRegularText } from './APIConstants';
import { TouchableOpacity } from 'react-native-gesture-handler';

class StoreCartItem extends Component {
  constructor(props) {
    super(props);
    var qstatus = this.props.qstatus;
    if (qstatus == null) {
      qstatus = false;
    }

    var showDelete = false;
    if (this.props.showDelete != null) {
      showDelete = this.props.showDelete;
    }
    this.state = {
      triggerQuantityChange: qstatus,
      showDelete: showDelete
    };
  }

  quantityChanged = () => {
    //alert('q changed');
    console.log(this.props);
    if (this.state.triggerQuantityChange) {
      this.props.quantityChanged();
    }
  };

  productImageUrl = main_pair => {
    var imageurl = '';
    if (main_pair.icon != null) {
      console.log(main_pair.icon.http_image_path);
      imageurl = main_pair.icon.http_image_path;
    } else if (main_pair.detailed != null) {
      imageurl = main_pair.detailed.http_image_path;
    }
    return imageurl;
  };

  deleteCartItem = product => {
    this.props.deleteProduct(product);
  };

  productItemClicked = () => {
    this.props.action(this.props.item);
  };

  render() {
    const {
      viewStyle,
      titleStyle,
      gramsStyle,
      originalPriceStyle,
      newPriceStyle,
      quantityViewStye,
      productImageStyle
    } = styles;
    // title: 'Bonjour Butterscotch',
    // price: '$2.70',
    // grams: '280g',
    // image: 'http://www.bonjour.sg/Upload/Product/image/5_1.png',
    // id: 1
    const {
      product,
      purchase_price,
      grams,
      main_pair,
      product_id,
      price,
      finalPriceValue,
      cart_option_selected
    } = this.props.item;

    console.log(this.props.item);

    var priceValue = 'S$';
    if (finalPriceValue != null) {
      priceValue += finalPriceValue;
    } else {
      priceValue += parseFloat(price).toFixed(2);
    }
    var optionArray = [];
    if (cart_option_selected != null) {
      optionArray = cart_option_selected;
    }

    return (
      <View style={viewStyle}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#fff'
          }}
        >
          <Image
            source={{ uri: this.productImageUrl(main_pair) }}
            style={productImageStyle}
          />
          <View style={{ width: '74%' }}>
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  width: '85%'
                }}
              >
                <DEIRegularText title={product} style={titleStyle} />
              </View>
              {this.state.showDelete && (
                <TouchableOpacity
                  style={{ width: '10%' }}
                  onPress={() => this.deleteCartItem(this.props.item)}
                >
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      marginTop: 10,
                      marginHorizontal: 10
                    }}
                    source={require('../assets/Cart/ic_cart_cancel.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
            {/* <DEIRegularText title={grams} style={gramsStyle} /> */}

            {optionArray.map(option => {
              return <DEIRegularText title={option.title} style={gramsStyle} />;
            })}

            <View style={quantityViewStye}>
              <View
                style={{
                  width: '40%',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text style={originalPriceStyle}>{priceValue}</Text>
                <Text style={newPriceStyle}> {'S$' + purchase_price} </Text>
              </View>
              <View style={{ width: '60%' }}>
                <View style={{ alignSelf: 'flex-end', marginRight: 5 }}>
                  <STQuantityView
                    item={this.props.item}
                    quantityChanged={this.quantityChanged}
                    isfromCart={this.props.isfromCart}
                    action={this.productItemClicked}
                    isDetail={this.state.showDelete ? true : false}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={{ height: 10 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#fff',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13
  },
  productImageStyle: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    marginTop: 10,
    marginLeft: 5
  },
  quantityViewStye: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10
  },
  titleStyle: {
    fontSize: 15,
    marginTop: 10,
    marginLeft: 5,
    width: '70%'
  },
  gramsStyle: {
    fontSize: 13,
    color: '#424242',
    marginTop: 10,
    marginLeft: 15
  },
  originalPriceStyle: {
    fontSize: 13,
    marginRight: 10
  },
  newPriceStyle: {
    fontSize: 13,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  }
});

export { StoreCartItem };

// <View style={{ flexDirection: 'row' }}>
//                 <Text style={originalPriceStyle}> {purchase_price} </Text>
//                 <Text style={newPriceStyle}> {purchase_price} </Text>
//               </View>
//               <View style={{ alignSelf: 'flex-end' }}>
//                 <STQuantityView
//                   item={this.props.item}
//                   quantityChanged={this.quantityChanged}
//                 />
//               </View>
