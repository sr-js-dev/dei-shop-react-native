import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  AsyncStorage
} from 'react-native';
import { DEIMediumText, resetUserInfo, getUserInfo } from '../../components';

class MySettings extends Component {
  static navigationOptions = {
    title: 'Settings',
    headerTintColor: '#8CA2F8'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  async deleteToken() {
    try {
      await AsyncStorage.removeItem('UserLoginDetails');
    } catch (err) {
      console.log(`The error is: ${err}`);
    }
  }

  logoutAction = () => {
    this.deleteToken()
      .then(res => {
        console.log(res);
        this.props.navigation.navigate('Auth');
      })
      .catch(err => {
        this.props.navigation.navigate('Auth');
      });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <View style={{ backgroundColor: '#fff' }}>
          <TouchableOpacity
            onPress={this.logoutAction}
            style={{
              height: 60,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 20
            }}
          >
            <DEIMediumText title={'Logout'} style={{ fontSize: 15 }} />
            <Image
              source={require('../../assets/Cart/ic_cart_dis.png')}
              style={{ width: 6, height: 12 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default MySettings;
