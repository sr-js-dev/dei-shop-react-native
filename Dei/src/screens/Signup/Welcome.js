import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { getUserInfo } from '../../components';
import AppSessionManager from '../../components/AppSessionManager';

const logo = require('../../assets/Signup/ic_splashlogo.png');

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    getUserInfo().then(user => {
      console.log(user);
      if (user != null && Object.keys(user).length > 0) {
        const token = user.token;
        if (token != null && token.length > 0) {
          AppSessionManager.shared().updateSessionToken(token);
          this.props.navigation.navigate('StoreHome');
        } else {
          this.props.navigation.navigate('Auth');
        }
      } else {
        this.props.navigation.navigate('Auth');
      }
    });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          style={{ width: '75%', height: '75%', resizeMode: 'contain' }}
          source={logo}
        />
      </View>
    );
  }
}

export default Welcome;
