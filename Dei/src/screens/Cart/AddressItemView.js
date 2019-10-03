import React, { Component } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

import { DEIRegularText, PrimaryView } from '../../components';

class SelectedAddressView extends Component {
  constructor(props) {
    super(props);
  }

  renderSelectedAddr = index => {
    const icon =
      this.props.selected == true
        ? require('../../assets/Cart/ic_addr_select.png')
        : require('../../assets/Cart/ic_addr_unselect.png');

    return (
      <TouchableOpacity
        onPress={() => this.props.selectedAction(this.props.selectedIndex)}
      >
        <Image
          source={icon}
          style={{
            width: 18,
            height: 18,
            resizeMode: 'contain',
            marginRight: 20
          }}
        />
      </TouchableOpacity>
    );
  };

  componentWillReceiveProps = nextProps => {
    console.log(nextProps);
  };

  render() {
    const {
      firstname,
      lastname,
      address,
      city,
      phone,
      primary,
      zipcode
    } = this.props.addressInfo;
    console.log(this.props.addressInfo);

    var Addresszipcode = address + ' ' + zipcode;
    const textStyle = {
      color: '#B19CFD',
      fontSize: 13
    };

    const { rowViewStyle, disclosureStyle } = styles;
    return (
      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
        {primary == true && <PrimaryView />}
        <View style={rowViewStyle}>
          {/* <Image
              source={require('../../assets/Cart/ic_cart_loc.png')}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                marginLeft: 20
              }}
            /> */}
          <View style={{ padding: 10 }}>
            <DEIRegularText
              title={firstname + ' ' + lastname}
              style={textStyle}
            />
            <DEIRegularText title={Addresszipcode} style={textStyle} />
            <DEIRegularText title={phone} style={textStyle} />
          </View>
          {this.renderSelectedAddr()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowViewStyle: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  disclosureStyle: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    marginRight: 20
  }
});

export { SelectedAddressView };
