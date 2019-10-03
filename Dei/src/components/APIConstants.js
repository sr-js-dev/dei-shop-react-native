import { Global } from '@jest/types';
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Platform,
  Alert,
  Dimensions
} from 'react-native';
// {
//     "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijg5OThkOTM1OTZlOTJlNjJlOGZkN2E5ZTQxNmYwZWQ3N2FkZWVlMzMyZDQyYmJlODU3M2M2OGExMmE2ODcwYmRiY2ZjNmM4Y2ExYWEzM2YwIn0.eyJhdWQiOiIzIiwianRpIjoiODk5OGQ5MzU5NmU5MmU2MmU4ZmQ3YTllNDE2ZjBlZDc3YWRlZWUzMzJkNDJiYmU4NTczYzY4YTEyYTY4NzBiZGJjZmM2YzhjYTFhYTMzZjAiLCJpYXQiOjE1NTQ0NjI0NDAsIm5iZiI6MTU1NDQ2MjQ0MCwiZXhwIjoxNTg2MDg0ODQwLCJzdWIiOiI3Iiwic2NvcGVzIjpbXX0.JhV_bVo_GMo5OewggVuhnBgNpY1Oo8nbIArClXTcu47FHaXc4_suBDZehRClrSOSWEk0FqSAeHJuqD3SMSUP044TCelD-8RZ5Pj9bBZTGdeZyCkjw2h0-IS6hH7pg1rXkydqU-p910r1rX3p7n2IhsfjqIZytFdc_FAZcOWkG01PbQg0c56ISlCU-NYnT6TfXRv2YsOi-a5E2OLq7CMWNxkTqY-ap4rQBr2vsvlZUCXL-k3stoho0yVG4jMQHWytGqiKRe2tQh9qKHc9rkeUSPqXR50Zhgta7EWEbehneAwXi77ua33cxsvgx7t2lf3-k5OqUg_91dgxxG0DEF6BUwR6HFncYLB9_6kEYOAik5d0OphryBDbFWFFfB_sAqIYRaSolSgjV2ZXFr_dwn6XXL3LVD76Qa4QTvOmgVownrsjTgfayv9YMVbYcPXpMaetoMpdEXq8pEE9AsJljSTUb3dyNY9wltDqiJY-ErW8UpIMmj8bbz2mDW63l44URik0ZGf8400X3f122BIYF59WkQrBQAYP-3qmT9fZXDzTfTv-Gn1-5ubUnWemQ1P9ClKQ2hGsa_GhHnucbPWhQ2dNOBMeR_DWSqxUn20rfv22B-HGBkkNc9owbXQvj_sVhSFYGP3tk09fY79RiPwgSGqyifYM_iSj5NtJ4MuoJNWlPX0",
//     "user": {
//       "name": "test",
//       "email": "test1@gmail.com",
//       "updated_at": "2019-04-05 11:07:20",
//       "created_at": "2019-04-05 11:07:20",
//       "id": 7
//     }
//   }

export const ProductGridWidth = Dimensions.get('screen').width / 3 - 30;

export const QuickSandBold = 'Quicksand-Bold';
export const QuickSandRegular = 'Quicksand-Regular';
export const QuicksandMedium = 'Quicksand-Medium';

export const DEIBoldText = ({ title, style }) => {
  return <Text style={[{ fontFamily: QuickSandBold }, style]}>{title}</Text>;
};

export const DEIRegularText = ({ title, style }) => {
  return <Text style={[{ fontFamily: QuickSandRegular }, style]}>{title}</Text>;
};

export const DEIMediumText = ({ title, style }) => {
  return <Text style={[{ fontFamily: QuicksandMedium }, style]}>{title}</Text>;
};

export const GradientModalBgView = ({ children, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ImageBackground
        source={require('../assets/Cart/ic_cart_grad.png')}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {children}
      </ImageBackground>
    </TouchableOpacity>
  );
};

export const GradientBgView = props => {
  return (
    <ImageBackground
      source={require('../assets/Cart/ic_cart_grad.png')}
      style={{
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {props.children}
    </ImageBackground>
  );
};

export const PrimaryView = ({ style }) => {
  return (
    <View style={style}>
      <ImageBackground
        source={require('../assets/Cart/ic_primary.png')}
        style={{ width: 70, height: 21, resizeMode: 'contain' }}
      >
        <DEIRegularText
          title={'Primary'}
          style={{ color: '#fff', textAlign: 'center', fontSize: 12 }}
        />
      </ImageBackground>
    </View>
  );
};

export const CheckoutAddNew = ({ title, action }) => {
  return (
    <TouchableOpacity onPress={action} style={{ marginTop: 30 }}>
      <DEIBoldText
        title={title}
        style={{ color: '#EE3936', textAlign: 'center', fontSize: 15 }}
      />
    </TouchableOpacity>
  );
};

export const AXIOS_CONFIG = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const ShowAlert = msg => {
  return Alert.alert(
    '',
    msg,
    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
    { cancelable: true }
  );
};

export function getProductImage(item) {
  var imageurl = '';
  if (item.main_pair != null) {
    if (item.main_pair.icon != null) {
      // console.log(item.main_pair.icon.http_image_path);
      imageurl = item.main_pair.icon.http_image_path;
    } else if (item.main_pair.detailed != null) {
      imageurl = item.main_pair.detailed.http_image_path;
    }
  }
  return imageurl;
}

export function getCardImage(name) {
  if (name == 'Visa') {
    return require('../assets/Stores/ic_visa.png');
  } else if (name == 'MasterCard') {
    return require('../assets/Cart/ic_mastercard.png');
  } else if (name == 'American Express') {
    return require('../assets/Cart/ic_amex.png');
  } else if (name == 'Discover') {
    return require('../assets/Cart/ic_discover.png');
  } else if (name == 'Diners Club') {
    return require('../assets/Cart/ic_diners.png');
  } else if (name == 'JCB') {
    return require('../assets/Cart/ic_jcb.png');
  } else if (name == 'UnionPay') {
    return require('../assets/Cart/ic_mastercard.png');
  }
  return require('../assets/Stores/ic_visa.png');
}
