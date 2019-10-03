import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const StoreCategoryItem = ({ title, icon, isselected }) => {
  const { viewStyle, textStyle, imageStyle, lineStyle } = styles;
  return (
    <View style={viewStyle}>
      <Image style={imageStyle} source={icon} />
      <Text style={textStyle}>{title}</Text>
      {isselected == true && <Text style={lineStyle} />}
    </View>
  );
};

const styles = StyleSheet.create({
  lineStyle: {
    alignSelf: 'center',
    width: 90,
    height: 3,
    marginTop: 5,
    backgroundColor: '#B19CFD'
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 10,
    textAlign: 'center',
    color: '#1E233D',
    marginTop: 5
  },
  viewStyle: {
    width: 100,
    height: 60,
    alignItems: 'center'
  },
  imageStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  }
});

export { StoreCategoryItem };
