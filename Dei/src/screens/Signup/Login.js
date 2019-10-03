import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
  ImageBackground,
  Platform
} from 'react-native';
import {
  SgButton,
  SgTextField,
  QuickSandBold,
  QuicksandMedium,
  QuickSandRegular,
  DEIBoldText,
  DEIRegularText,
  DEIMediumText,
  AXIOS_CONFIG,
  saveUserTokenInfo,
  getUserInfo,
  getUserToken
} from './../../components/index';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import api, { NoInternetAlert, isNetworkConnected } from '../../components/API';
import Spinner from 'react-native-loading-spinner-overlay';

import axios from 'axios';
import AppSessionManager from '../../components/AppSessionManager';

class Login extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   username: 'test2@gmail.com',
    //   password: 'test1234',
    //   isLoading: false
    // };

    this.state = {
      username: '',
      password: '',
      isLoading: false
    };

    this.textChanged = this.textChanged.bind(this);
    this.siginAction = this.siginAction.bind(this);
  }

  textChanged = (text, placeholder) => {
    const isPassword =
      placeholder == 'Password'
        ? this.setState({ password: text })
        : this.setState({ username: text });
  };

  forgotPassword = () => {
    this.props.navigation.navigate('ForgotPassword');
    return;
    this.props.navigation.navigate('Terms', {
      url: 'https://dei.com.sg/index.php?dispatch=auth.recover_password',
      title_name: 'Forgot Password'
    });
  };

  ShowAlert = msg => {
    Alert.alert(
      '',
      msg,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: true }
    );
  };

  siginAction() {
    const { username, password } = this.state;
    //  alert(this.state.username + ' ' + this.state.password);
    //this.props.navigation.navigate('StoreHome');
    if (username.length < 1) {
      this.ShowAlert('Please enter valid Email Id');
      return;
      // return;
    } else if (password.length < 1) {
      this.ShowAlert('Please enter valid Password');
      return;
    }

    isNetworkConnected().then(status => {
      if (status == true) {
        const params = {
          email: username,
          password: password
        };
        this.setState({ isLoading: true });

        var message = 'Login Failed - Please try again with valid credentials';
        console.log(api.Login);
        axios
          .post(api.Login, params, AXIOS_CONFIG)
          .then(response => {
            this.setState({ isLoading: false });
            console.log(response);
            if (response.status == 200) {
              const data = response.data;
              console.log(data);
              if (data != null) {
                var userInfo = {
                  token: data.Token,
                  User: data.User
                };
                if (data.Token != null && data.Token.length > 0) {
                  AppSessionManager.shared().updateSessionToken(data.Token);
                }
                saveUserTokenInfo(userInfo);
              }

             setTimeout(() => {
              this.props.navigation.navigate('StoreHome');
             }, 100);
            } else {
              this.ShowAlert(message);
            }
          })
          .catch(err => {
            const data = err.response.data;
            console.log(err.response);
            if (data != null) {
              const errorMessage = data.error.message;
              if (errorMessage != null && errorMessage.length > 0) {
                message = errorMessage;
              }
            }
            this.setState({ isLoading: false });
            setTimeout(() => {
              console.log(err.response);
              this.ShowAlert(message);
            }, 200);
          });
      } else {
        NoInternetAlert();
      }
    });
  }

  signupAction = () => {
    this.props.navigation.navigate('Register', {
      isEditProfile: false,
      title_name: 'Create Account'
    });
  };

  render() {
    const { helloStyle, signintextStyle } = styles;
    const marginTopHello = Platform.OS == 'ios' ? 40 : 0;
    const signinMarginTop = Platform.OS == 'ios' ? 0 : 30;
    return (
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Spinner visible={this.state.isLoading} />
        <ImageBackground
          source={require('../../assets/Signup/ic_login_bgnew.png')}
          style={{ width: '100%', height: '100%' }}
          imageStyle={{ resizeMode: 'contain' }}
        >
          <View
            style={{
              height: '60%',
              justifyContent: 'flex-start',
              marginTop: marginTopHello
            }}
          >
            <View style={{ marginHorizontal: 20, marginBottom: 40 }}>
              <Text style={helloStyle}>Hello,</Text>
              <Text style={signintextStyle}>Sign in to your account</Text>
            </View>
            <View style={{ justifyContent: 'center', marginTop: 30 }}>
              <SgTextField
                placeholder={'Email Id'}
                keyboardType={'email-address'}
                action={this.textChanged}
                value={this.state.username}
                sgKeyboardType={'email-address'}
              />
              <SgTextField
                placeholder={'Password'}
                action={this.textChanged}
                value={this.state.password}
                returnKeyType={'done'}
              />
            </View>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                marginRight: 20,
                fontFamily: QuickSandRegular,
                color: '#1E233D',
                fontSize: 14
              }}
              onPress={this.forgotPassword}
            >
              <Text>Forgot your Password?</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '40%'
            }}
          >
            <View>
              <View style={{ marginTop: signinMarginTop }}>
                <SgButton title={'SIGN IN'} action={this.siginAction} />
              </View>
              <TouchableOpacity
                onPress={this.signupAction}
                style={{ marginTop: 30, flexDirection: 'row' }}
              >
                <DEIMediumText
                  title={`Don't have an account?`}
                  style={{ color: '#fff' }}
                />
                <DEIBoldText title={' Create'} />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  helloStyle: {
    fontSize: 70,
    color: '#8CA2F8',
    fontWeight: 'bold',
    fontFamily: QuickSandBold
  },
  signintextStyle: {
    color: '#1E233D',
    fontFamily: QuickSandRegular,
    fontSize: 18
  }
});

export default Login;
