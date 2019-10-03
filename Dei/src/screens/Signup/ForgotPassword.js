import React, { Component } from 'react';
import { Text, View } from 'react-native';
import {
  SgTextField,
  DEIMediumText,
  CartButton,
  ShowAlert,
  isNetworkConnected,
  AXIOS_CONFIG
} from '../../components';

import axios from 'axios';
import API from '../../components/API';
import Spinner from 'react-native-loading-spinner-overlay';

export class ForgotPassword extends Component {
  static navigationOptions = {
    title: 'Forgot Password'
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      isLoading: false
    };
  }

  textChanged = (text, placeholder) => {
    this.setState({
      email: text
    });
  };

  submitClicked = () => {
    if (this.state.email.length < 1) {
      ShowAlert('Please enter valid email');
      return;
    }

    this.setState({ isLoading: true });

    isNetworkConnected().then(status => {
      if (status == true) {
        const params = {
          email: this.state.email
        };
        axios
          .post(API.ForgotPassword, params, AXIOS_CONFIG)
          .then(response => {
            console.log(response);
            this.setState({ isLoading: false });
            const data = response.data;
            if (data.status == 'error') {
              ShowAlert(data.message ? data.message : 'Invalid Email Address');
            } else {
              var code = data.code ? data.code : '';
              this.props.navigation.navigate('VerifyForgotPassword', {
                email: this.state.email,
                code: code
              });
            }
          })
          .catch(err => {
            const data = err.response.data;
            console.log(err.response);
          });
      } else {
        NoInternetAlert();
      }
    });
  };

  verifyCodeClicked = () => {
    this.props.navigation.navigate('VerifyForgotPassword', {
      email: '',
      code: ''
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.isLoading} />
        <View style={{ marginHorizontal: 20 }}>
          <DEIMediumText
            style={{ margin: 20 }}
            title={
              "Enter your email address below and we'll send you a verification code to reset the password?"
            }
          />
          <View style={{ marginTop: 20 }} />
          <SgTextField
            placeholder={'Enter your Email'}
            value={this.state.email}
            action={this.textChanged}
            sgKeyboardType={'email-address'}
          />
          <View style={{ marginHorizontal: 20 }}>
            <CartButton title={'Submit'} action={this.submitClicked} />
          </View>

          <View style={{ height: 1, backgroundColor: '#f2f2f2' }} />

          <View style={{ marginHorizontal: 20 }}>
            <CartButton title={'Verify Code'} action={this.verifyCodeClicked} />
          </View>
        </View>
      </View>
    );
  }
}

export default ForgotPassword;
