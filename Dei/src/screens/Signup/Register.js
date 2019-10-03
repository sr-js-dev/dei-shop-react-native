import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  SgButton,
  SgTextField,
  SgProfilePic,
  DEIMediumText,
  DEIRegularText,
  isNetworkConnected,
  saveUserTokenInfo,
  AXIOS_CONFIG
} from './../../components/index';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-navigation';
import { LoginManager, LoginButton, AccessToken } from 'react-native-fbsdk';

import Spinner from 'react-native-loading-spinner-overlay';

import axios from 'axios';
import API from '../../components/API';
import AppSessionManager from '../../components/AppSessionManager';

class Register extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title_name')
    };
  };

  constructor(props) {
    super(props);
    var isEditProfile = false;
    if (this.props.navigation.state.params.isEditProfile == true) {
      isEditProfile = true;
    }
    var firstname = '';
    var lastname = '';
    var email = '';
    var mobileno = '';
    var photo_url = null;
    if (this.props.navigation.state.params.user != null) {
      const user = this.props.navigation.state.params.user;
      if (user.first_name != null) {
        firstname = user.first_name;
      }
      if (user.last_name != null) {
        lastname = user.last_name;
      }
      if (user.email != null) {
        email = user.email;
      }
      if (user.mobile != null) {
        mobileno = user.mobile;
      }
      if (user.photo_url != null) {
        photo_url = user.photo_url.length > 0 ? user.photo_url : null;
      }
    }

    // this.state = {
    //   firstname: 'test',
    //   lastname: 'test',
    //   email: 'testdei3@gmail.com',
    //   mobileno: '123456789',
    //   password: 'test1234',
    //   fbId: '',
    //   fbAccessToken: '',
    //   fbPicUrl: '',
    //   isLoading: false,
    //   photo: ''
    // };

    this.state = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      mobileno: mobileno,
      password: '',
      fbId: '',
      fbAccessToken: '',
      fbPicUrl: '',
      isLoading: false,
      photo: '',
      isEditProfile: isEditProfile,
      photo_url: photo_url
    };

    this.textChanged = this.textChanged.bind(this);
  }

  updateFBDisplayData = user => {
    if (Object.keys(user).length > 0) {
      const email = user.email;
      const fname = user.first_name;
      const lname = user.last_name;
      const fbId = user.id;
      this.setState({ email: email, firstname: fname, lastname: lname });
      //  https://graph.facebook.com/2206733672715571/picture?type=large
    }
  };

  fbClicked = () => {
    loginFB()
      .then(user => {
        console.log('success');
        console.log(user);
        this.updateFBDisplayData(user);
      })
      .catch(err => {
        console.log(err);
      });
  };

  textChanged = (text, placeholder) => {
    switch (placeholder) {
      case 'First Name':
        this.setState({ firstname: text });
        break;
      case 'Last Name':
        this.setState({ lastname: text });
        break;
      case 'Email Address':
        this.setState({ email: text });
        break;
      case 'Mobile Number':
        this.setState({ mobileno: text });
        break;
      case 'Password':
        this.setState({ password: text });
        break;
      default:
        break;
    }
  };

  signinAction = () => {
    const {
      firstname,
      lastname,
      mobileno,
      password,
      email,
      photo
    } = this.state;

    if (firstname.length < 1) {
      alert('Please enter your First Name');
      return;
    } else if (email.length < 1) {
      alert('Please enter valid Email Id');
      return;
    } else if (mobileno.length < 1) {
      alert('Please enter your Mobile Number');
      return;
    } else if (password.length < 1) {
      alert('Please enter your Password');
      return;
    }

    this.setState({ isLoading: true });
    isNetworkConnected().then(status => {
      if (status) {
        this.setState({ isLoading: true });
        console.log(API.Register);
        var params = {
          first_name: firstname,
          last_name: lastname,
          email: email,
          mobile: mobileno,
          password: password,
          photo: photo
        };
        console.log(params);
        axios
          .post(API.Register, params, AXIOS_CONFIG)
          .then(response => {
            this.setState({ isLoading: false });
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

              this.props.navigation.navigate('StoreHome');
            }
          })
          .catch(err => {
            console.log(err.response);
            this.setState({ isLoading: false });
            setTimeout(() => {
              alert('Email Id - Already Exists');
            }, 200);
            console.log('Error ' + err);
            console.log('Error ' + err.response);
          });
      } else {
        alert(
          'No Internet connection found.Check your connection or try again.'
        );
      }
    });
  };

  updateProfileAction = () => {
    const {
      firstname,
      lastname,
      mobileno,
      password,
      email,
      photo
    } = this.state;

    if (firstname.length < 1) {
      alert('Please enter your First Name');
      return;
    } else if (email.length < 1) {
      alert('Please enter valid Email Id');
      return;
    } else if (mobileno.length < 1) {
      alert('The mobile must be between 7 and 12 digits');
      return;
    }

    this.setState({ isLoading: true });
    isNetworkConnected().then(status => {
      if (status) {
        this.setState({ isLoading: true });
        console.log(API.ProfileUpdate);
        var params = {
          first_name: firstname,
          last_name: lastname,
          mobile: mobileno,
          photo: photo
        };

        console.log(params);
        var headers = AppSessionManager.shared().getAuthorizationHeader();
        console.log(headers);
        axios
          .put(API.ProfileUpdate, params, headers)
          .then(response => {
            this.setState({ isLoading: false });
            if (response.status == 200) {
              const data = response.data;
              console.log(data);
              if (data != null) {
                AppSessionManager.shared().isProfileUpdated = true;
                setTimeout(() => {
                  Alert.alert('Info', 'Profile Updated Successfully', [
                    {
                      text: 'Ok',
                      onPress: () => {
                        this.props.navigation.goBack();
                      }
                    }
                  ]);
                }, 200);
              }
            }
          })
          .catch(err => {
            console.log(err.response);
            this.setState({ isLoading: false });
            setTimeout(() => {
              alert('Failed to update profile');
            }, 200);
            console.log('Error ' + err);
            console.log('Error ' + err.response);
          });
      } else {
        alert(
          'No Internet connection found.Check your connection or try again.'
        );
      }
    });
  };

  photoCaptured = source => {
    if (source.uri.length > 0) {
      console.log(source.uri);
      this.setState({ photo: source.uri });
    }
  };

  renderSignupFooter() {
    return (
      <View
        style={{
          marginTop: 10,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <DEIRegularText
          title={'Or create account using social media'}
          style={{ color: '#9393A7', fontSize: 17 }}
        />
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <SocialButton type={'FB'} action={this.fbClicked} />
          <SocialButton type={'TW'} />
        </View>
      </View>
    );
  }

  renderEditProfileFooter() {
    return (
      <View
        style={{
          marginTop: 20,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Terms')}
        >
          <DEIRegularText
            title={'Terms and Conditions'}
            style={{
              color: '#9393A7',
              fontSize: 17,
              textDecorationLine: 'underline'
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView>
        <View>
          <Spinner visible={this.state.isLoading} />
          <KeyboardAwareScrollView enableOnAndroid={true}>
            <View style={{ justifyContent: 'center' }}>
              <View style={{ height: 200 }}>
                <ImageBackground
                  source={require('../../assets/Signup/ic_signupbg.png')}
                  style={{ width: '100%', height: 120 }}
                  imageStyle={{ resizeMode: 'cover' }}
                >
                  <View style={{ marginTop: 50 }}>
                    <SgProfilePic
                      action={this.photoCaptured}
                      sourceURL={this.state.photo_url}
                    />
                  </View>
                </ImageBackground>
              </View>
              <View style={{ height: 30 }} />
              <SgTextField
                placeholder={'First Name'}
                action={this.textChanged}
                value={this.state.firstname}
              />
              <SgTextField
                placeholder={'Last Name'}
                action={this.textChanged}
                value={this.state.lastname}
              />
              <SgTextField
                placeholder={'Email Address'}
                action={this.textChanged}
                value={this.state.email}
                sgKeyboardType={'email-address'}
                isDisable={this.state.isEditProfile ? true : false}
              />
              <SgTextField
                placeholder={'Mobile Number'}
                sgKeyboardType={'phone-pad'}
                action={this.textChanged}
                value={this.state.mobileno}
              />
              {!this.state.isEditProfile && (
                <SgTextField
                  placeholder={'Password'}
                  action={this.textChanged}
                  value={this.state.password}
                />
              )}
            </View>

            <View style={{ alignItems: 'center' }}>
              {!this.state.isEditProfile && (
                <Text style={{ marginHorizontal: 10 }}>
                  By Signing up, I Accept all terms and conditions
                </Text>
              )}

              <View style={{ marginTop: 40 }}>
                <SgButton
                  title={this.state.isEditProfile ? 'UPDATE' : 'SIGN IN'}
                  action={
                    this.state.isEditProfile
                      ? this.updateProfileAction
                      : this.signinAction
                  }
                />
              </View>
              {/* {!this.state.isEditProfile && this.renderSignupFooter()} */}
              {this.state.isEditProfile && this.renderEditProfileFooter()}
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const SocialButton = ({ type, action }) => {
  const icon =
    type == 'FB'
      ? require('../../assets/Signup/ic_fb.png')
      : require('../../assets/Signup/ic_tw.png');
  return (
    <TouchableOpacity onPress={action} style={{ marginHorizontal: 10 }}>
      <Image source={icon} style={{ width: 30, height: 30 }} />
    </TouchableOpacity>
  );
};

export default Register;

export function loginFB() {
  return new Promise((resolve, reject) => {
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      function(result) {
        console.log(result);
        if (result.isCancelled) {
          reject({ reason: 'Cancelled' });
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            console.log(data);
            const token = data.accessToken.toString();

            fetch(
              'https://graph.facebook.com/v2.5/me?fields=email,first_name,last_name&access_token=' +
                token
            )
              .then(response => response.json())
              .then(user => {
                console.log(user);
                resolve(user);
              })
              .catch(err => {
                reject({ reason: 'Error' });
              });
          });
        }
      },
      function(error) {
        console.log(error);
        reject({ reason: 'Error' });
      }
    );
  });
}
