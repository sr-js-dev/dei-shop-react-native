import React, { Component } from 'react';
import { View, Text, TextInput, ImageBackground, Platform } from 'react-native';
import { QuickSandRegular, QuicksandMedium } from './APIConstants';

const marginTopTextVal = Platform.OS == 'android' ? 10 : 15;

const SgTextField = ({
  sgKeyboardType,
  placeholder,
  value,
  action,
  isDisable
}) => {
  const isPassword = placeholder.includes('Password') ? true : false;
  const type = sgKeyboardType != null ? sgKeyboardType : 'default';
  const disable = isDisable != null ? !isDisable : true;

  return (
    <View
      style={{ justifyContent: 'center', marginHorizontal: 20, marginTop: -20 }}
    >
      <ImageBackground
        source={require('../assets/Signup/ic_logintxtbox.png')}
        style={{
          width: '100%',
          height: 70
        }}
        imageStyle={{ resizeMode: 'contain' }}
      >
        <TextInput
          placeholder={placeholder}
          onChangeText={text => action(text, placeholder)}
          placeholderTextColor={'#1E233D'}
          secureTextEntry={isPassword}
          keyboardType={type}
          returnKeyType={'done'}
          autoCapitalize={'none'}
          value={value}
          editable={disable}
          style={{
            marginLeft: 40,
            backgroundColor: 'transparent',
            height: 45,
            fontFamily: QuicksandMedium,
            fontSize: 15
          }}
        />
      </ImageBackground>
    </View>
  );
  // return (
  //   <ImageBackground
  //     style={{
  //       width: '90%',
  //       height: 40,
  //       justifyContent: 'center',
  //     }}
  //     source={require('../assets/Signup/ic_login_shadow.png')}
  //   >
  //     <View
  //       style={{
  //         backgroundColor: '#F4F4F4',
  //         height: 40,
  //         borderRadius: 20,
  //         borderWidth: 1,
  //         borderColor: 'transparent'

  //         // shadowColor: '#1E233D14',
  //         // elevation: 20,
  //         // shadowOffset: {
  //         //   width: 2,
  //         //   height: 10
  //         // },
  //         // shadowRadius: 1,
  //         // shadowOpacity: 0.5
  //       }}
  //     >
  //       <TextInput
  //         placeholder={placeholder}
  //         onChangeText={text => action(text, placeholder)}
  //         secureTextEntry={isPassword}
  //         value={value}
  //         style={{ paddingHorizontal: 10 }}
  //       />
  //     </View>
  //   </ImageBackground>
  // );
};

export { SgTextField };
