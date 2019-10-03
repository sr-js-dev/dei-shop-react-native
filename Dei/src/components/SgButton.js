/*
    signup button component is used in login , signup for submit actions
*/

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { DEIRegularText } from './APIConstants';

const SgButton = ({ title, action }) => {
  return (
    <TouchableOpacity onPress={action}>
      <ImageBackground
        style={{ height: 50, width: 200, justifyContent: 'center' }}
        imageStyle={{ borderRadius: 25 }}
        source={require('./../assets/Signup/ic_signin.png')}
      >
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold'
          }}
        >
          {title}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export { SgButton };

const sgCartButton = ({ title, action }) => {
  return (
    <TouchableOpacity onPress={this.props.applyFilter}>
      <View style={applyFilterViewStyle}>
        <DEIRegularText
          title={title}
          style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}
        />
      </View>
    </TouchableOpacity>
  );
};
