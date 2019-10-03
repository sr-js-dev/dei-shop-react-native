import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import {
  SgTextField,
  DEIMediumText,
  CartButton,
  ShowAlert,
  isNetworkConnected,
  AXIOS_CONFIG
} from '../../components';

import axios from 'axios';
import { NoInternetAlert } from '../../components/API';
import Spinner from 'react-native-loading-spinner-overlay';
import API from '../../components/API';

const msg = 'Enter verification code received in email and reset your password';

export class ForgotVerifyPassword extends Component {
  static navigationOptions = {
    title: 'Verify Email'
  };

  constructor(props) {
    super(props);
    var email = this.props.navigation.getParam('email', '');
    var code = this.props.navigation.getParam('code', '');
    this.state = {
      email: email,
      verificationcode: code,
      password: '',
      isLoading: false
    };
  }

  textChanged = (text, placeholder) => {
    console.log(text, placeholder);
    if (placeholder == 'Enter Password') {
      this.setState({ password: text });
    } else if (placeholder == 'Enter Verification code') {
      this.setState({ verificationcode: text });
    } else {
      this.setState({ email: text });
    }
  };

  successAlert(msg) {
    Alert.alert(
      'Forgot Password',
      msg,
      [{ text: 'OK', onPress: () => this.props.navigation.navigate('Login') }],
      { cancelable: false }
    );
  }
  submitClicked = () => {
    console.log('submit clicked');
    const { email, verificationcode, password } = this.state;

    if (email.length < 1) {
      alert('Please enter email');
      return;
    } else if (verificationcode.length < 1) {
      alert('Please enter verification code');
      return;
    } else if (password.length < 1) {
      alert('Please enter password');
      return;
    }

    const params = {
      email: email,
      code: verificationcode,
      password: password
    };

    this.setState({ isLoading: true });

    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        axios
          .post(API.VerifyForgotPassword, params, AXIOS_CONFIG)
          .then(response => {
            this.setState({ isLoading: false });
            console.log(response);
            debugger;
            const data = response.data;
            var message = 'Your password was reset succesfully';
            if (data.message != null) {
              message = data.message;
            }
            if (data.status == 'success') {
              setTimeout(() => {
                this.successAlert(message);
              }, 200);
            } else {
              setTimeout(() => {
                alert(message);
              }, 200);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        NoInternetAlert();
      }
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.isLoading} />
        <View style={{ marginHorizontal: 20 }}>
          <DEIMediumText style={{ margin: 20 }} title={msg} />
          <View style={{ marginTop: 20 }} />
          <SgTextField
            placeholder={'Enter your Email'}
            value={this.state.email}
            action={this.textChanged}
            sgKeyboardType={'email-address'}
          />
          <SgTextField
            placeholder={'Enter Verification code'}
            value={this.state.verificationcode}
            action={this.textChanged}
          />
          <SgTextField
            placeholder={'Enter Password'}
            value={this.state.password}
            action={this.textChanged}
          />
          <View style={{ marginHorizontal: 20 }}>
            <CartButton title={'Submit'} action={this.submitClicked} />
          </View>
        </View>
      </View>
    );
  }
}

export default ForgotVerifyPassword;
