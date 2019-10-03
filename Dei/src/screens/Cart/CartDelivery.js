import React, { Component } from 'react';
import {
  View,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import CartTotalView from './CartTotalView';
import {
  DEIRegularText,
  PrimaryView,
  CheckoutAddNew,
  AXIOS_CONFIG
} from '../../components';

import AddDeliveryAddress from './AddDeliveryAddress';
import AddDeliveryDate from './AddDeliveryDate';
import DeliveryAddressList from './DeliveryAddressList';
import Spinner from 'react-native-loading-spinner-overlay';

import API from '../../components/API';
import Axios from 'axios';
import AppSessionManager from '../../components/AppSessionManager';

class CartDelivery extends Component {
  constructor(props) {
    super(props);

    debugger;
    var selectedAddr = {};
    var selectedDateDetails = {};

    if (Object.keys(this.props.delivery).length > 0) {
      const deliveryInfo = this.props.delivery;
      if (Object.keys(deliveryInfo.address).length > 0) {
        selectedAddr = deliveryInfo.address;
      }

      if (
        deliveryInfo.date != null &&
        Object.keys(deliveryInfo.date).length > 0
      ) {
        selectedDateDetails = deliveryInfo.date;
      }

      if (
        deliveryInfo.selectedDay != null &&
        Object.keys(deliveryInfo.selectedDay).length > 0
      ) {
        selectedDateDetails = deliveryInfo.selectedDay;
      }
    }

    this.state = {
      AddAddressVisible: false,
      AddressListModalVisible: false,
      deliveryDateModalVisible: false,
      addressList: [],
      selectedAddress: selectedAddr,
      selectedDateDetails: selectedDateDetails,
      isLoading: false
    };
  }

  updateDeliveryInfo = () => {
    var deliveryInfo = {};
    if (Object.keys(this.props.delivery).length > 0) {
      deliveryInfo = this.props.delivery;
    }
    return deliveryInfo;
  };

  fetchAddressList = () => {
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
  };
  componentDidMount = () => {
    setTimeout(() => {
      this.fetchAddressList();
    }, 300);
  };

  componentWillReceiveProps = nextProps => {
    console.log('componentWillReceiveProps');
    debugger;
    if (
      nextProps.delivery != null &&
      Object.keys(nextProps.delivery).length > 0
    ) {
      const deliveryInfo = nextProps.delivery;
      console.log(deliveryInfo);
      //console.log('inside category props' + nextProps.categories);
      var addressTempList = this.state.addressList;
      if (addressTempList.length == 0) {
        addressTempList.push(deliveryInfo.address);
      }
      this.setState({
        addressList: addressTempList,
        selectedAddress: deliveryInfo.address,
        selectedDateDetails: deliveryInfo.date
      });
    }
  };
  toggleAddDeliveryAddress = () => {
    if (this.state.addressList.length > 0) {
      this.setState({
        AddressListModalVisible: !this.state.AddressListModalVisible
      });
    } else {
      this.setState({
        AddAddressVisible: !this.state.AddAddressVisible
      });
    }
  };

  saveDeliveryAddressClicked = details => {
    if (Object.keys(details).length > 0) {
      this.setState({ selectedAddress: details });
      var address = this.state.addressList;
      address.push(details);
      console.log(API.AddressAdd);
      console.log(details);

      var headers = AppSessionManager.shared().getAuthorizationHeader();
      Axios.post(API.AddressAdd, details, headers)
        .then(res => {
          console.log(res);
          var addressDetails = {}; //res.data.Address;
          if (Object.keys(res.data.Address).length > 0) {
            addressDetails = res.data.Address;
            this.setState({
              addressList: address,
              selectedAddress: addressDetails,
              AddAddressVisible: false,
              isLoading: false
            });
          } else {
            this.setState({
              AddAddressVisible: false,
              isLoading: false
            });
          }
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

  toggleDeliveryDate = () => {
    this.setState({
      deliveryDateModalVisible: !this.state.deliveryDateModalVisible
    });
  };

  deliveryDateSelected = details => {
    this.toggleDeliveryDate();
    console.log(details);
    this.setState({ selectedDateDetails: details });
  };

  toggleAddressList = () => {
    this.setState({
      AddressListModalVisible: !this.state.AddressListModalVisible
    });
  };

  saveAddressListClicked = details => {
    this.setState({
      selectedAddress: details,
      AddressListModalVisible: false
    });
  };

  renderAddressView = () => {
    const { selectedAddress, addressList } = this.state;
    if (Object.keys(selectedAddress).length > 0) {
      return (
        <SelectedAddressView
          addressInfo={selectedAddress}
          action={this.toggleAddressList}
        />
      );
    }
    return (
      <DeliveryButton
        title={'Add delivery address'}
        details={{}}
        action={this.toggleAddDeliveryAddress}
      />
    );
  };

  gotoPaymentClicked = () => {
    const { selectedAddress, selectedDateDetails } = this.state;
    if (Object.keys(selectedAddress).length < 1) {
      alert('Please select Delivery Address');
      return;
    } else if (Object.keys(selectedDateDetails).length < 1) {
      alert('Please select Delivery Date & Time');
      return;
    }

    this.props.changeTabStatus(2);

    const delivery = {
      address: selectedAddress,
      deliveryInfo: selectedDateDetails
    };
    this.props.action(delivery);
  };

  AddNewAddress = () => {
    this.setState({
      AddAddressVisible: true,
      AddressListModalVisible: false,
      deliveryDateModalVisible: false
    });
  };

  render() {
    const {
      AddAddressVisible,
      deliveryDateModalVisible,
      AddressListModalVisible,
      addressList,
      selectedDateDetails,
      isLoading
    } = this.state;

    var checkoutInfo = AppSessionManager.shared().getCheckoutInfo();
    return (
      <View style={{ backgroundColor: '#fff', height: '92%' }}>
        <Spinner visible={isLoading} />
        <ScrollView>
          <View>
            <View>
              {/* Render Selected or Add new address view */}
              {this.renderAddressView()}

              <View style={{ marginTop: 5 }}>
                <DeliveryButton
                  title={'Choose date & time'}
                  details={selectedDateDetails}
                  action={this.toggleDeliveryDate}
                />
              </View>

              {/* Show add new address button when address list is available */}
              {addressList.length > 0 && (
                <CheckoutAddNew
                  title={'+ ADD NEW ADDRESS'}
                  action={this.AddNewAddress}
                />
              )}
            </View>
            <View style={{ marginTop: 45 }}>
              <CartTotalView
                action={this.gotoPaymentClicked}
                btnTitle={'Go to payment'}
                checkoutInfo={checkoutInfo}
              />
            </View>
          </View>

          {deliveryDateModalVisible == true && (
            <AddDeliveryDate action={this.deliveryDateSelected} />
          )}

          {AddressListModalVisible == true && (
            <DeliveryAddressList
              action={this.saveAddressListClicked}
              address={this.state.addressList}
              closeModal={this.toggleAddressList}
            />
          )}

          {AddAddressVisible == true && (
            <AddDeliveryAddress
              action={this.saveDeliveryAddressClicked}
              closeModal={this.toggleAddDeliveryAddress}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}

const SelectedAddressView = ({ addressInfo, action }) => {
  const { profile_name, address, city, phone, primary } = addressInfo;
  const textStyle = {
    color: '#B19CFD',
    fontSize: 13,
    textAlign: 'left'
  };

  return (
    <View style={{ marginHorizontal: 40 }}>
      <TouchableOpacity onPress={action}>
        {primary == true && <PrimaryView />}
        <View style={styles.selectedAddressContainerview}>
          <Image
            source={require('../../assets/Cart/ic_cart_loc.png')}
            style={styles.iconStyle}
          />
          <View
            style={{
              padding: 10,
              alignItems: 'flex-start',
              width: '65%',
              marginHorizontal: 20
            }}
          >
            <DEIRegularText title={profile_name} style={textStyle} />
            <DEIRegularText title={address} style={textStyle} />
            <DEIRegularText title={city} style={textStyle} />
            <DEIRegularText title={phone} style={textStyle} />
          </View>
          <Image
            source={require('../../assets/Cart/ic_cart_dis.png')}
            style={styles.cardDisclosureStyle}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const DeliveryButton = ({ title, action, details }) => {
  const rightImage =
    title == 'Add delivery address'
      ? require('../../assets/Cart/ic_cart_loc.png')
      : require('../../assets/Cart/ic_cart_time.png');

  const leftImage =
    title == 'Add delivery address'
      ? require('../../assets/Cart/ic_cart_add.png')
      : require('../../assets/Cart/ic_cart_dis.png');

  const { deliveryBtnViewStyle } = styles;
  var titleText = title;
  var borderStyle = { borderRadius: 20 };
  if (Object.keys(details).length > 0) {
    titleText = details.selectedDay.desc + ' | ' + details.slot.title;
    borderStyle = { borderRadius: 0 };
  }

  return (
    <ImageBackground
      style={{ width: '100%', height: 65 }}
      imageStyle={{ resizeMode: 'contain' }}
      source={require('../../assets/Cart/ic_cart_dlshadow.png')}
    >
      <TouchableOpacity
        onPress={action}
        style={[deliveryBtnViewStyle, borderStyle]}
      >
        <Image
          source={rightImage}
          style={{
            width: 20,
            height: 20,
            resizeMode: 'contain',
            marginLeft: 20
          }}
        />
        <DEIRegularText
          title={titleText}
          style={{ color: '#B19CFD', textAlign: 'center' }}
        />
        <Image
          source={leftImage}
          style={{
            width: 12,
            height: 12,
            resizeMode: 'contain',
            marginRight: 20
          }}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 20
  },
  deliveryBtnViewStyle: {
    backgroundColor: '#F4F4F4',
    height: 40,
    marginHorizontal: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 0,
    borderColor: '#fff',
    flexDirection: 'row'
  },
  selectedAddressContainerview: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  cardDisclosureStyle: {
    width: 12,
    height: 12,
    resizeMode: 'contain'
  }
});

export default CartDelivery;
