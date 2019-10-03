import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  FlatList,
  Platform,
  Alert,
  Image
} from 'react-native';

import { DEIRegularText, GradientBgView } from '../../components';
import { SgTextField, CartButton } from '../../components/index';
import Swipeout from 'react-native-swipeout';
import Spinner from 'react-native-loading-spinner-overlay';
import { isNetworkConnected, AXIOS_CONFIG } from './../../components/index';
import AppSessionManager from '../../components/AppSessionManager';
import Axios from 'axios';
import API from '../../components/API';
import { deliveryAddrList } from '../../components/mockData';
import AddDeliveryAddress from '../Cart/AddDeliveryAddress';
import { EmptyView } from '../../components/EmptyView';
import { SelectedAddressView } from '../Cart/AddressItemView';

const screenHeight = Dimensions.get('screen').height;

export default class MyAddressList extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state, setParams, navigate } = navigation;
    const params = state.params || {};
    return {
      title: 'Address',
      headerTintColor: '#B19CFD',
      headerBackTitle: 'Back',
      headerRight: (
        <TouchableOpacity onPress={params.addAddress}>
          <Image
            style={{ marginRight: 15, width: 24, height: 24 }}
            source={require('../../assets/Cart/ic_add.png')}
          />
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);
    this._addAddress = this._addAddress.bind(this);
    this.state = {
      selectedIndex: 0,
      isLoading: false,
      addressList: [],
      selectedAddress: {},
      editAddress: {},
      AddAddressVisible: false
    };
  }

  _addAddress() {
    this.setState({
      editAddress: {},
      AddAddressVisible: !this.state.AddAddressVisible
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      addAddress: this._addAddress
    });
    this.fetchAddressList();
  }
  fetchAddressList() {
    var headers = AppSessionManager.shared().getAuthorizationHeader();
    this.setState({ isLoading: true });
    Axios.get(API.AddressList, headers, AXIOS_CONFIG)
      .then(result => {
        console.log(result);
        const addrList = result.data.Addresses;
        if (Array.isArray(addrList) && addrList.length > 0) {
          this.setState({
            addressList: addrList,
            selectedAddress: addrList[0],
            isLoading: false
          });
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err.response);
      });
  }

  deleteAddress = (item, index) => {
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        var header = AppSessionManager.shared().getAuthorizationHeader();
        console.log(header);
        this.setState({ isLoading: true });
        var apiURL = API.AddressDelete + item.id;
        Axios.delete(apiURL, header, AXIOS_CONFIG)
          .then(res => {
            var addressList = this.state.addressList;
            addressList.splice(index, 1);
            this.setState({ isLoading: false, addressList: addressList });
            console.log(res);
          })
          .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
          });
      }
    });
  };

  renderEditDeleteView(index, itemIndex) {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: '#fff',
          minHeight: 30,
          borderColor: '#B19CFD',
          borderWidth: 1,
          borderRadius: 15,
          marginHorizontal: 6,
          justifyContent: 'center',
          alignItems: 'center',
          width: 70
        }}
        onPress={() => this.editDeleteClicked(index, itemIndex)}
      >
        <DEIRegularText
          title={index == 0 ? 'Edit' : 'Delete'}
          style={{
            color: '#B19CFD',
            marginHorizontal: 10,
            fontSize: 14
          }}
        />
      </TouchableOpacity>
    );
  }

  saveDeliveryAddressClicked = details => {
    if (Object.keys(details).length > 0) {
      if (Object.keys(this.state.editAddress).length > 0) {
        this.setState({ selectedAddress: details });
        console.log(details);
        var apiURL = API.AddressUpdate + this.state.editAddress.id;
        console.log(apiURL);
        var headers = AppSessionManager.shared().getAuthorizationHeader();
        Axios.put(apiURL, details, headers)
          .then(res => {
            this.setState({
              AddAddressVisible: false,
              isLoading: false
            });
            setTimeout(() => {
              this.fetchAddressList();
            }, 300);
          })
          .catch(err => {
            console.log(err.response);
            this.setState({ isLoading: false });
            setTimeout(() => {
              alert('Unable to update address - please try again later');
            }, 200);
          });
      } else {
        this.addNewAddressClicked(details);
      }
    }
  };

  addNewAddressClicked = details => {
    if (Object.keys(details).length > 0) {
      var headers = AppSessionManager.shared().getAuthorizationHeader();
      Axios.post(API.AddressAdd, details, headers)
        .then(res => {
          console.log(res);
          var newAddress = res.data.Address;
          var address = this.state.addressList;
          address.push(newAddress);
          this.setState({
            addressList: address,
            AddAddressVisible: false,
            isLoading: false
          });
        })
        .catch(err => {
          console.log(err.response);
          this.setState({ isLoading: false });
          setTimeout(() => {
            alert('Unable to add address - please try again later');
          }, 200);
        });
    }
  };

  editDeleteClicked = (index, itemIndex) => {
    if (index == 0) {
      this.setState({
        editAddress: this.state.addressList[itemIndex],
        AddAddressVisible: !this.state.AddAddressVisible,
        isLoading: false
      });
    } else {
      this.deleteAddressConfirmation(itemIndex);
    }
  };

  togglePopupView = () => {
    this.setState({
      AddAddressVisible: !this.state.AddAddressVisible
    });
  };

  deleteAddressConfirmation = itemIndex => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => {
            this.deleteAddress(this.state.addressList[itemIndex], itemIndex);
          }
        }
      ],
      { cancelable: true }
    );
  };

  selectedAction = index => {
    this.setState({ selectedIndex: index });
  };

  renderUpdateRow = (item, index) => {
    const {
      firstname,
      lastname,
      address,
      city,
      phone,
      primary,
      zipcode
    } = item;

    var Addresszipcode = address + ' ' + zipcode;
    const textStyle = {
      color: '#1b1b1b',
      fontSize: 15
    };

    const { rowViewStyle, disclosureStyle } = styles;
    return (
      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
        {primary == true && <PrimaryView />}
        <View style={rowViewStyle}>
          <View style={{ padding: 10 }}>
            <DEIRegularText
              title={firstname + ' ' + lastname}
              style={{ fontWeight: 'bold' }}
            />
            <DEIRegularText title={Addresszipcode} style={textStyle} />
            <DEIRegularText title={phone} style={textStyle} />
          </View>
        </View>
        <View
          style={[
            rowViewStyle,
            { justifyContent: 'flex-start', paddingBottom: 10, paddingLeft: 5 }
          ]}
        >
          {this.renderEditDeleteView(0, index)}
          {this.renderEditDeleteView(1, index)}
        </View>
      </View>
    );
  };

  render() {
    const { viewContainerStyle } = styles;
    const { AddAddressVisible, editAddress, isLoading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={isLoading} animation={'fade'} />
        <FlatList
          data={this.state.addressList}
          extraData={this.state}
          keyExtractor={index => index.toString()}
          ListEmptyComponent={
            <View
              style={{
                height: screenHeight - 100,
                justifyContent: 'center'
              }}
            >
              <EmptyView type={5} action={this._addAddress} />
            </View>
          }
          renderItem={({ item, index }) => this.renderUpdateRow(item, index)}
        />
        {AddAddressVisible == true && (
          <AddDeliveryAddress
            action={this.saveDeliveryAddressClicked}
            address={editAddress}
            closeModal={this.togglePopupView}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainerStyle: {
    width: '90%',
    height: Platform.OS == 'ios' ? '50%' : '65%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff'
  },
  rowViewStyle: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
