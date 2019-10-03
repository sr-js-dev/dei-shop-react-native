import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import {
  DEIMediumText,
  DEIBoldText,
  PrimaryView,
  ShowAlert
} from '../../components';
import CartTotalView from './CartTotalView';
import { PaymentCards } from '../../components/mockData';
import Spinner from 'react-native-loading-spinner-overlay';
import { isNetworkConnected, AXIOS_CONFIG } from './../../components/index';
import Axios from 'axios';
import API from '../../components/API';
import AppSessionManager from '../../components/AppSessionManager';
import Swipeout from 'react-native-swipeout';
import AddNewCard from './AddNewCard';

class CartPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      showNewCard: false,
      isLoading: false,
      activeRowKey: null,
      selectedCardIndex: 0
    };
  }

  componentDidMount() {
    this.getCards();
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.refreshCard != null) {
      if (nextProps.refreshCard == true) {
        this.getCards();
      }
    }
  };

  getCards = () => {
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        var header = AppSessionManager.shared().getAuthorizationHeader();
        console.log(header);
        this.setState({ isLoading: true });
        Axios.get(API.Cards, header, AXIOS_CONFIG)
          .then(res => {
            if (res.data.Cards != null) {
              if (Array.isArray(res.data.Cards)) {
                this.setState({
                  cards: res.data.Cards,
                  isLoading: false
                });
              }
            } else {
              this.setState({ isLoading: false });
            }
            console.log(res);
          })
          .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
          });
      }
    });
  };

  deleteCard = item => {
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        var header = AppSessionManager.shared().getAuthorizationHeader();
        console.log(header);
        this.setState({ isLoading: true });
        var apiURL = API.RemoveCard + item.id;
        Axios.delete(apiURL, header, AXIOS_CONFIG)
          .then(res => {
            this.setState({ isLoading: false });
            console.log(res);
            this.getCards();
          })
          .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
          });
      }
    });
  };

  addNewCardClicked = () => {
    this.props.addCardAction();
  };

  _onChange = formData => console.log(JSON.stringify(formData, null, ' '));
  _onFocus = field => console.log('focusing', field);

  proceedToPaymentClicked = () => {
    const { cards, selectedCardIndex } = this.state;
    if (selectedCardIndex < cards.length) {
      const selectedCardDetails = cards[selectedCardIndex];
      this.props.action(selectedCardDetails);
    } else {
      ShowAlert('Please add a card to proceed payment');
    }
    //this.props.action()
  };

  renderFooter = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={this.addNewCardClicked}
          style={{ marginTop: 30 }}
        >
          <DEIBoldText
            title={this.state.showNewCard == true ? 'CANCEL' : '+ ADD NEW CARD'}
            style={{ color: '#EE3936', textAlign: 'center', fontSize: 15 }}
          />
        </TouchableOpacity>
        {this.state.showNewCard == true && <View />}
        <CartTotalView
          action={this.proceedToPaymentClicked}
          btnTitle={'Proceed to pay'}
        />
      </View>
    );
  };

  render() {
    const { cardviewStyle, savedCardTextStyle } = styles;

    return (
      <View style={{ backgroundColor: '#fff', height: '92%' }}>
        <Spinner visible={this.state.isLoading} />
        <DEIMediumText title={'SAVED CARDS'} style={savedCardTextStyle} />
        <FlatList
          style={{ marginTop: 20 }}
          data={this.state.cards}
          ListFooterComponent={this.renderFooter}
          keyExtractor={(index, item) => item.id}
          renderItem={({ item, index }) => this.renderRow(index, item)}
        />
      </View>
    );
  }

  renderRow = (index, item) => {
    const { cardviewStyle, savedCardTextStyle } = styles;
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
                    this.deleteCard(item);
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
      // <Swipeout {...swipeSettings} style={{ backgroundColor: 'white' }}>
      <View>
        {index == 0 && <PrimaryView style={{ marginLeft: 20 }} />}
        <View style={cardviewStyle}>
          <Image
            source={this.getcardImage(item.brand)}
            style={{
              width: 52,
              height: 34,
              resizeMode: 'contain'
            }}
          />
          <View
            style={{
              justifyContent: 'flex-start',
              marginLeft: -20
            }}
          >
            <DEIBoldText
              title={'**** **** **** ' + item.last4}
              style={{ fontSize: 14, textAlign: 'left' }}
            />
          </View>
          {this.renderSelectedAddr(index)}
        </View>
      </View>
      // </Swipeout>
    );
  };

  renderSelectedAddr = index => {
    const icon =
      this.state.selectedCardIndex == index
        ? require('../../assets/Cart/ic_addr_select.png')
        : require('../../assets/Cart/ic_addr_unselect.png');

    return (
      <TouchableOpacity
        onPress={() => this.setState({ selectedCardIndex: index })}
      >
        <Image
          source={icon}
          style={{
            width: 18,
            height: 18,
            resizeMode: 'contain',
            marginRight: 10
          }}
        />
      </TouchableOpacity>
    );
  };

  getcardImage = name => {
    if (name == 'Visa') {
      return require('../../assets/Stores/ic_visa.png');
    } else if (name == 'MasterCard') {
      return require('../../assets/Cart/ic_mastercard.png');
    } else if (name == 'American Express') {
      return require('../../assets/Cart/ic_amex.png');
    } else if (name == 'Discover') {
      return require('../../assets/Cart/ic_discover.png');
    } else if (name == 'Diners Club') {
      return require('../../assets/Cart/ic_diners.png');
    } else if (name == 'JCB') {
      return require('../../assets/Cart/ic_jcb.png');
    } else if (name == 'UnionPay') {
      return require('../../assets/Cart/ic_mastercard.png');
    }
    return require('../../assets/Cart/ic_nocard.png');
  };
}

const styles = StyleSheet.create({
  savedCardTextStyle: {
    color: '#000',
    marginLeft: 20,
    fontSize: 11
  },
  cardviewStyle: {
    height: 78,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 6,
    shadowColor: '#010101',
    shadowOffset: {
      width: 0,
      height: 14
    },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 17,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  }
});
export default CartPayment;
