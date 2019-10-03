import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import {
  DEIMediumText,
  isNetworkConnected,
  AXIOS_CONFIG,
  ShowAlert
} from '../../components';
import Swiper from 'react-native-swiper';
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import { savePushToken } from './../../components/Auth';
import Axios from 'axios';
import API from '../../components/API';
import AppSessionManager from '../../components/AppSessionManager';
import ImageLoad from 'react-native-image-placeholder';

class AppOnboarding extends Component {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      onboarding: [],
      isLoading: false
    };
    OneSignal.init('bb4c1454-d50c-4177-96bb-70b7039d53a0'); //91e8224d-c5ed-4f54-b2ca-9d170a18b072

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.configure(); // triggers the ids event
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
    // debugger;
    if (device.pushToken != null) {
      savePushToken(device.pushToken);
    }
    // {pushToken: "fHjoUSN3JSk:APA91bHMX003j9UEw8O2bL-Fl29kdGuXt__ma1…C2mAzKeE1cr7nb4nufbDEiKE4e6nLo7by3B6-E5ss-9uCEjGx", userId: "9e3e5ab4-9d21-45fa-bde7-1442d81481a5"}pushToken: "fHjoUSN3JSk:APA91bHMX003j9UEw8O2bL-Fl29kdGuXt__ma1mMMaqvf0WB-b4UF32PL-hEV9CHp6OainEaCHA6n16fFYpMewFF13gC2mAzKeE1cr7nb4nufbDEiKE4e6nLo7by3B6-E5ss-9uCEjGx"
    // userId: "9e3e5ab4-9d21-45fa-bde7-1442d81481a5"__proto__: Object
  }

  componentDidMount() {
    this.fetchOnboarding();
  }

  updateDefaultOnboarding() {
    this.setState({ isLoading: false });
    var items = {
      title: 'Mollit esse minima ',
      description: 'Cupiditate quia repr'
    };

    this.setState({ onboarding: [items], isLoading: false });
  }

  fetchOnboarding() {
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        //
        this.setState({ isLoading: true });
        Axios.get(API.launch, {}, AXIOS_CONFIG)
          .then(res => {
            console.log(res);
            const homeResponse = res.data.Home;
            let urls = res.data.Urls;
            let aboutURL = urls.about_url;
            let termsURL = urls.terms_url;
            AppSessionManager.shared().saveAboutUrl(aboutURL);
            AppSessionManager.shared().saveTermsUrl(termsURL);
            //  debugger;
            if (homeResponse != null) {
              if (Array.isArray(homeResponse.onboarding)) {
                this.setState({
                  onboarding: homeResponse.onboarding,
                  isLoading: false
                });
              }
            } else {
              this.updateDefaultOnboarding();
            }
          })
          .catch(err => {
            this.updateDefaultOnboarding();
          });
      } else {
        this.updateDefaultOnboarding();
      }
    });
  }

  renderPageView(item) {
    const {
      descStyle,
      continueViewStyle,
      viewStyle,
      welcomeTextStyle
    } = styles;

    const { title, description, image } = item;
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <ImageLoad
          style={{ width: '100%', height: '60%' }}
          placeholderSource={require('../../assets/Signup/ic_onboard_one.png')}
          source={{ uri: image }}
          isShowActivity={false}
          customImagePlaceholderDefaultStyle={{
            resizeMode: 'cover',
            width: '100%',
            height: '100%'
          }}
        />
        <View style={{}}>
          <View style={{ alignItems: 'center' }}>
            <Text style={welcomeTextStyle}>{title}</Text>
            <Text style={descStyle}>{description}</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}
              style={continueViewStyle}
            >
              <DEIMediumText
                title={'Continue'}
                style={{
                  color: '#fff',
                  marginHorizontal: 20
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.isLoading} />
        <Swiper
          key={this.state.onboarding.length}
          showsButtons={false}
          dot={<View style={styles.inActiveDotStyle} />}
          activeDot={<View style={styles.activeDotStyle} />}
        >
          {this.state.onboarding.map((item, i) => {
            console.log(item);
            return this.renderPageView(item);
          })}
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inActiveDotStyle: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 5,
    height: 5,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },
  activeDotStyle: {
    backgroundColor: '#B19CFD',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },
  viewStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '30%'
  },
  continueViewStyle: {
    backgroundColor: '#8CA2F8',
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1,
    alignItems: 'center',
    height: 30,
    justifyContent: 'center'
  },
  welcomeTextStyle: {
    color: '#1C1C1C',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    fontFamily: 'Quicksand-Bold'
  },
  descStyle: {
    color: '#1E233D',
    fontSize: 14,
    margin: 10,
    textAlign: 'center'
  }
});

export default AppOnboarding;

/*
<View>
          <View style={viewStyle}>
            <Text style={welcomeTextStyle}>WELCOME</Text>
            <Text style={descStyle}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}
            style={continueViewStyle}
          >
            <DEIMediumText
              title={'Continue'}
              style={{
                color: '#fff',
                marginHorizontal: 20
              }}
            />
          </TouchableOpacity>
        </View>
        */
