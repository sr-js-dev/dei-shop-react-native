import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class MyOrderFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { footerViewStyle, footerRowStyle } = styles;

    return (
      <View>
        <Text> MyOrderFooter </Text>
      </View>
    );
  }
}

export default MyOrderFooter;
