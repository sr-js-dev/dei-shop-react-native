import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Platform,
  Alert
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

import { SelectedAddressView } from './AddressItemView';

class DeliveryAddressList extends Component {
  constructor(props) {
    super(props);
    var addressList = [];
    if (Array.isArray(this.props.address)) {
      addressList = this.props.address;
    }
    this.state = {
      selectedIndex: 0,
      address: addressList,
      isLoading: false
    };
  }

  componentWillReceiveProps = nextProps => {
    console.log('Delivery address list');
  };

  saveClicked = () => {
    const { address, selectedIndex } = this.state;
    const selectedAddr = address[selectedIndex];
    this.props.action(selectedAddr);
  };

  closeModal = () => {
    this.setState({ visible: false });
    this.props.closeModal();
  };
  deleteAddress = (item, index) => {
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        var header = AppSessionManager.shared().getAuthorizationHeader();
        console.log(header);
        this.setState({ isLoading: true });
        var apiURL = API.AddressDelete + item.id;
        Axios.delete(apiURL, header, AXIOS_CONFIG)
          .then(res => {
            var addressList = this.state.address;
            addressList.splice(index, 1);
            this.setState({ isLoading: false, address: addressList });
            console.log(res);
          })
          .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
          });
      }
    });
  };

  renderRow = (item, index) => {
    const swipeSettings = {
      autoClose: true,
      onClose: (secId, rowId, direction) => {
        this.setState({ activeRowKey: null });
      },
      onOpen: (secId, rowId, direction) => {
        this.setState({ activeRowKey: null });
      },
      right: [
        {
          onPress: () => {
            Alert.alert(
              'Alert',
              'Are you sure you want to remove?',
              [
                {
                  text: 'No',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel'
                },
                {
                  text: 'Yes',
                  onPress: () => {
                    this.deleteAddress(item, index);
                  }
                }
              ],
              { cancelable: true }
            );
          },
          text: 'Delete',
          type: 'delete'
        }
      ],
      rowId: this.props.index,
      sectionId: 1
    };
    return (
      <Swipeout {...swipeSettings} style={{ backgroundColor: 'white' }}>
        <SelectedAddressView
          addressInfo={item}
          selected={this.state.selectedIndex == index}
          selectedAction={this.selectedAction}
          selectedIndex={index}
        />
      </Swipeout>
    );
  };

  selectedAction = index => {
    this.setState({ selectedIndex: index });
  };

  render() {
    const { viewContainerStyle } = styles;
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={this.state.visible}
      >
        <TouchableOpacity onPress={this.closeModal}>
          <View>
            <Spinner visible={this.state.isLoading} />
            <GradientBgView>
              <View style={viewContainerStyle}>
                <DEIRegularText
                  title={'Enter your delivery address'}
                  style={{
                    textAlign: 'center',
                    color: '#B19CFD',
                    marginTop: 10
                  }}
                />
                <FlatList
                  data={this.state.address}
                  extraData={this.state}
                  keyExtractor={index => index.toString()}
                  renderItem={({ item, index }) => this.renderRow(item, index)}
                />
                <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                  <CartButton title={'Save'} action={this.saveClicked} />
                </View>
              </View>
            </GradientBgView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  }
});

export default DeliveryAddressList;
