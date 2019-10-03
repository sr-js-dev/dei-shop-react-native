import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DEIMediumText } from '../../components';

class CheckoutTabView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenu: this.props.selectedMenu,
      completedStatus: this.props.completedStatus,
      menus: [
        {
          title: 'Delivery',
          tab_image: require('../../assets/Cart/ic_cart_delivery_normal.png'),
          tab_select_image: require('../../assets/Cart/ic_cart_delivery.png'),
          tabIndex: 1
        },
        {
          title: 'Payment',
          tab_image: require('../../assets/Cart/ic_cart_payment_normal.png'),
          tab_select_image: require('../../assets/Cart/ic_cart_payment.png'),
          tabIndex: 2
        },
        {
          title: 'Confirm',
          tab_image: require('../../assets/Cart/ic_cart_confirm_normal.png'),
          tab_select_image: require('../../assets/Cart/ic_cart_confirm.png'),
          tabIndex: 3
        }
      ]
    };
  }

  componentWillReceiveProps(nextProps) {
    debugger;
    if (
      nextProps.selectedMenu != null &&
      nextProps.selectedMenu !== this.props.selectedMenu
    ) {
      this.setState({ selectedMenu: nextProps.selectedMenu });
    }

    if (
      nextProps.completedStatus != null &&
      nextProps.completedStatus !== this.props.completedStatus
    ) {
      this.setState({ completedStatus: nextProps.completedStatus });
    }
  }

  menuClicked = tabIndex => {
    debugger;
    if (tabIndex < this.state.completedStatus) {
      this.setState({ selectedMenu: tabIndex });
      this.props.menuChanged(tabIndex);
    }
  };

  getTextColor = index => {
    const { selectedMenu } = this.state;
    if (index == selectedMenu) {
      return '#FF8960';
    }
    if (index < this.state.selectedMenu) {
      return index < this.state.selectedMenu ? '#B19CFD' : '#D5D5D5';
    }
    return '#D5D5D5';
  };

  render() {
    const { selectedMenu } = this.state;
    const { viewStyle, menuViewStyle, iconStyle } = styles;
    return (
      <View style={viewStyle}>
        {this.state.menus.map(menu => {
          const selected = menu.tabIndex == selectedMenu ? true : false;
          return (
            <TouchableOpacity
              key={menu.tabIndex}
              style={menuViewStyle}
              onPress={() => this.menuClicked(menu.tabIndex)}
            >
              <Image
                source={selected ? menu.tab_select_image : menu.tab_image}
                style={iconStyle}
              />
              <DEIMediumText
                title={menu.title}
                style={{
                  color: this.getTextColor(menu.tabIndex),
                  fontSize: 13
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    height: 90,
    justifyContent: 'center',
    marginTop: 10
  },
  menuViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '30%'
  },
  iconStyle: {
    width: 23,
    height: 17,
    resizeMode: 'contain',
    marginHorizontal: 10
  }
});

export default CheckoutTabView;
