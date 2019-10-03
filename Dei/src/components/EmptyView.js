import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DEIMediumText } from './APIConstants';
import { CartButton } from './CartButton';

class EmptyView extends Component {
  constructor(props) {
    super(props);

    const noInternet = {
      title: 'Whoops!',
      desc: 'No Internet connection found.Check your connection or try again.',
      btnTitle: 'Try Again',
      icon: require('../assets/Empty/ic_nointernet.png')
    };

    const emptyCart = {
      title: 'Your cart is empty!',
      btnTitle: 'Continue',
      icon: require('../assets/Empty/ic_cartempty.png'),
      desc:
        'Looks like there are no items in your cart at the moment.Add an item to continue.'
    };

    const noResult = {
      title: 'No Results!',
      icon: require('../assets/Empty/ic_noresult.png'),
      desc:
        'Sorry, there are no results for this search. \n  Please try another keyword.',
      btnTitle: 'Try Again'
    };

    const noData = {
      title: '',
      icon: require('../assets/Empty/ic_noresult.png'),
      desc: 'Oops.. something went wrong. Please try again later.',
      btnTitle: ''
    };

    const noCard = {
      title: '',
      icon: require('../assets/Empty/ic_noresult.png'),
      desc: 'No Cards available.',
      btnTitle: 'Add a New Card'
    };

    const noAddress = {
      title: '',
      icon: require('../assets/Empty/ic_noresult.png'),
      desc: 'No Address available.',
      btnTitle: 'Add a New Address'
    };

    const noProduct = {
      title: '',
      icon: require('../assets/Empty/ic_noresult.png'),
      desc: 'Product not available',
      btnTitle: ''
    };

    this.state = {
      views: [
        noInternet,
        emptyCart,
        noResult,
        noData,
        noCard,
        noAddress,
        noProduct
      ],
      selectedIndex: this.props.type
    };
  }

  continueAction = () => {
    this.props.action();
  };

  render() {
    const { views, selectedIndex } = this.state;
    const viewDetails = views[selectedIndex];
    const { btnTitle, title, desc, icon } = viewDetails;
    var customStyle = {};
    if (this.props.viewStyle != null) {
      customStyle = this.props.viewStyle;
    }
    return (
      <View style={[styles.viewStyle, customStyle]}>
        <Image
          source={icon}
          style={{ width: '100%', height: '30%', resizeMode: 'contain' }}
        />
        <DEIMediumText
          title={title}
          style={{ color: '#262628', fontSize: 30 }}
        />
        <DEIMediumText
          title={desc}
          style={{
            color: '#4A4A4A',
            fontSize: 15,
            textAlign: 'center',
            marginHorizontal: 30,
            marginTop: 15
          }}
        />

        {btnTitle.length > 0 && (
          <CartButton
            title={btnTitle}
            action={this.continueAction}
            viewStyle={{ width: '80%', marginTop: 30 }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export { EmptyView };
