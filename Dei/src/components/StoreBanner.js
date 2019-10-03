import React, { Component } from 'react';
import { View, Image, ImageBackground, TouchableOpacity } from 'react-native';

import ImageLoad from 'react-native-image-placeholder';

const placeholder = require('../assets/Home/ic_placeholder_banner.png');
const StoreBanner = ({ item, mWidth, mHeight }) => {
  console.log(item);

  var imageurl = '';
  if (item.banner_url != null) {
    // imageurl = item.logo.image_path;
    imageurl = item.banner_url;
  }

  if (item.image != null) {
    imageurl = item.image;
  }

  return (
    <View
      style={{
        backgroundColor: '#fff',
        shadowColor: '#868686',
        shadowOffset: {
          width: 1,
          height: 3
        },
        shadowOpacity: 1.0,
        shadowRadius: 6.0,
        elevation: 6
      }}
    >
      <ImageLoad
        style={{ width: mWidth, height: mHeight }}
        placeholderSource={placeholder}
        source={{ uri: imageurl }}
        isShowActivity={false}
        customImagePlaceholderDefaultStyle={{
          resizeMode: 'contain',
          width: mWidth,
          height: mHeight - 20,
          backgroundColor: '#E6E7E8'
        }}
        backgroundColor={'#E6E7E8'}
      />
    </View>
  );
};

export { StoreBanner };
