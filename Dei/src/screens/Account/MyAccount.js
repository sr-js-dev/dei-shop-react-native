import React, { Component } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import {
  DEIMediumText,
  SgProfilePic,
  DEIRegularText,
  AXIOS_CONFIG
} from '../../components';

import { AccountItemView } from './MyAccountComponents';
import Axios from 'axios';
import API, { isNetworkConnected } from '../../components/API';
import AppSessionManager from '../../components/AppSessionManager';
import { NavigationEvents } from 'react-navigation';

import Spinner from 'react-native-loading-spinner-overlay';

class MyAccount extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'My Account',
    headerTintColor: '#B19CFD',
    headerBackTitle: 'Back',
    headerRight: (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Register', {
            isEditProfile: true,
            user: AppSessionManager.shared().getUserInfo(),
            title_name: 'Edit Profile'
          })
        }
      >
        <Image
          style={{ marginRight: 15, width: 20, height: 19 }}
          source={require('../../assets/Tabs/ic_edit_profile.png')}
        />
      </TouchableOpacity>
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      picture: '',
      email: '',
      address: '',
      payment: '',
      isLoading: false,
      user: {}
    };
  }

  componentDidMount() {
    this.getAccountInfo();
  }

  updateAccountInfo = () => {
    if (AppSessionManager.shared().isProfileUpdated == true) {
      AppSessionManager.shared().isProfileUpdated = false;
      this.getAccountInfo();
    }
  };

  getAccountInfo() {
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        this.setState({ isLoading: true });
        var headers = AppSessionManager.shared().getAuthorizationHeader();
        Axios.get(API.CustomerDetail, headers, AXIOS_CONFIG)
          .then(response => {
            console.log(response);
            this.setState({ isLoading: false });
            if (
              response.data.User != null &&
              Object.keys(response.data.User).length > 0
            ) {
              const user = response.data.User;
              var name = '';
              if (user.first_name != null) {
                name = user.first_name;
              }

              if (user.last_name != null) {
                name = name + ' ' + user.last_name;
              }
              AppSessionManager.shared().saveUserInfo(user);
              this.setState({
                name: name,
                email: user.email,
                picture: user.photo_url,
                user: response.data.User
              });
            }
          })
          .catch(err => {
            this.setState({ isLoading: false });
            alert('Oops.. something went wrong. Please try again later.');
            console.log(err.response);
          });
      } else {
        alert('No Internet Connection - please try again');
      }
    });
  }

  itemClicked = title => {
    var routeName = '';
    switch (title) {
      case 'Settings':
        routeName = 'MySetting';
        break;
      case 'My Orders':
        routeName = 'MyOrders';
        break;
      case 'Payment method':
        routeName = 'SavedCards';
        break;
      case 'Change password':
        routeName = 'ChangePassword';
        break;
      case 'Address':
        routeName = 'MyAddressList';
        break;
      case 'Terms & Conditions':
        routeName = 'Terms';
        break;
      default:
        break;
    }
    if (routeName.length > 0) {
      this.props.navigation.navigate(routeName);
    }
  };

  renderOrderInfo = () => {
    return (
      <View style={{ backgroundColor: '#fff' }}>
        <AccountItemView
          title={'My Orders'}
          isDisclosure={true}
          action={this.itemClicked}
        />
        {this.renderSeperator()}
        <AccountItemView
          title={'Payment method'}
          details={this.state.payment}
          isDisclosure={true}
          action={this.itemClicked}
        />
        {this.renderSeperator()}
        <AccountItemView
          title={'Settings'}
          isDisclosure={true}
          action={this.itemClicked}
        />
        {this.renderSeperator()}
        <AccountItemView
          title={'Terms & Conditions'}
          isDisclosure={true}
          action={this.itemClicked}
        />
        {this.renderSeperator()}
      </View>
    );
  };

  renderProfilePic = () => {
    const picSource =
      this.state.picture.length > 0
        ? { uri: this.state.picture }
        : require('../../assets/Signup/ic_emptyprofile.png');
    return (
      <Image
        style={{
          width: 105,
          height: 105,
          borderRadius: 52.5,
          borderWidth: 0.3,
          borderColor: 'transparent'
        }}
        source={picSource}
      />
    );
  };

  renderProfileInformation = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            margin: 20
          }}
        >
          {this.renderProfilePic()}
          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <DEIMediumText
              title={this.state.name}
              style={{ color: '#4A4A4A', fontSize: 20 }}
            />
            <DEIRegularText
              title={this.state.address}
              style={{
                color: '#C2C4CA',
                fontSize: 12,
                marginTop: 10,
                marginRight: 28
              }}
            />
          </View>
        </View>
        <View style={{ backgroundColor: '#f5f5f5', height: 10 }} />
      </View>
    );
  };

  renderSeperator() {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: '#EBECED',
          width: '100%',
          marginLeft: 20
        }}
      />
    );
  }

  renderAccountInfo = () => {
    return (
      <View>
        <View style={{ backgroundColor: '#fff' }}>
          <DEIMediumText
            title={'ACCOUNT INFORMATIONS'}
            style={{
              color: '#262628',
              fontSize: 12,
              marginLeft: 20,
              marginTop: 10
            }}
          />
          <AccountItemView title={'Name'} details={this.state.name} />
          {this.renderSeperator()}
          <AccountItemView title={'Email'} details={this.state.email} />
          {this.renderSeperator()}
          <AccountItemView
            title={'Address'}
            details={this.state.address}
            isDisclosure={true}
            action={this.itemClicked}
          />
          {this.renderSeperator()}
          <AccountItemView
            title={'Change password'}
            details={'*********'}
            isDisclosure={true}
            action={this.itemClicked}
          />
        </View>

        <View style={{ backgroundColor: '#f5f5f5', height: 20 }} />
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            this.updateAccountInfo();
          }}
        />
        <Spinner visible={this.state.isLoading} animation={'fade'} />

        <ScrollView>
          {this.renderProfileInformation()}
          {this.renderAccountInfo()}
          {this.renderOrderInfo()}
        </ScrollView>
      </View>
    );
  }
}

export default MyAccount;
