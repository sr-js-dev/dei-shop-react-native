import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert
} from 'react-native';

import { PaymentCards } from '../../components/mockData';
import Axios from 'axios';
import { AccountItemView } from '../../screens/Account/MyAccountComponents';
import { DEIRegularText, DEIMediumText, getCardImage } from '../../components';
import { isNetworkConnected, AXIOS_CONFIG } from './../../components/index';
import AppSessionManager from '../../components/AppSessionManager';
import Spinner from 'react-native-loading-spinner-overlay';
import { EmptyView } from '../../components/EmptyView';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import API from '../../components/API';

const scrWidth = Dimensions.get('screen').width;
const itemWidth = scrWidth - 50;

class PaymentList extends Component {
  static navigationOptions = ({ navigate, navigation }) => ({
    title: 'Payment',
    headerTintColor: '#B19CFD',
    headerBackTitle: 'Back',
    headerRight: (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('AddNewCard', {
            refreshItem: item => navigation.getParam('refreshItem')(item)
          })
        }
      >
        <Image
          style={{ marginRight: 15, width: 24, height: 24 }}
          source={require('../../assets/Cart/ic_add.png')}
        />
      </TouchableOpacity>
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      cardList: [],
      selectedIndex: -1,
      isLoading: false
    };
  }

  componentDidMount() {
    this.getSavedCards();
    this.props.navigation.setParams({ refreshItem: this._refreshItem });
  }

  _refreshItem = item => {
    this.getSavedCards();
  };

  getSavedCards = () => {
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        var header = AppSessionManager.shared().getAuthorizationHeader();
        console.log(header);
        this.setState({ isLoading: true });
        Axios.get(API.Cards, header, AXIOS_CONFIG)
          .then(res => {
            console.log(res);
            const cards = res.data.Cards;
            if (Array.isArray(cards) && cards.length > 0) {
              var cardList = [];
              for (let index = 0; index < cards.length; index++) {
                var item = cards[index];
                var cardInfo = this.getFormattedCardInfo(item);
                item.cardInfo = cardInfo;
                cardList.push(item);
              }
              this.setState({
                cardList: cardList.reverse(),
                isLoading: false,
                selectedIndex: 0
              });
            } else {
              this.setState({ isLoading: false });
            }
          })
          .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
          });
      }
    });
  };

  itemClicked = title => {
    //this.refs.carousel.onSnapToItem();
  };

  pagination() {
    const { cardList, selectedIndex } = this.state;
    return (
      <Pagination
        dotsLength={cardList.length}
        activeDotIndex={selectedIndex}
        containerStyle={{ backgroundColor: '#fff' }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 4,
          backgroundColor: '#9B9B9B'
        }}
        inactiveDotStyle={{
          backgroundColor: '#A7A7A7'
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={1.0}
      />
    );
  }

  _renderItem({ item, index }) {
    const cardInfo = item.cardInfo;
    return (
      <View
        style={{
          justifyContent: 'space-around',
          backgroundColor: '#262628',
          height: 215,
          borderRadius: 30,
          borderWidth: 1,
          marginTop: 30
        }}
      >
        <Image
          style={{
            width: 70,
            height: 70,
            resizeMode: 'contain',
            marginLeft: 25
          }}
          source={cardInfo.cardImage}
        />
        <DEIRegularText
          title={cardInfo.cardNo}
          style={{
            color: '#fff',
            textAlign: 'left',
            marginLeft: 30,
            fontSize: 25
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'flex-start',
            justifyContent: 'space-around',
            marginBottom: 30
          }}
        >
          <View>
            <DEIRegularText
              title={'CARD HOLDER'}
              style={{ color: '#8C8C8C', fontSize: 7 }}
            />
            <DEIMediumText
              title={item.cardName}
              style={{ color: '#fff', fontSize: 16, marginTop: 5 }}
            />
          </View>
          <View>
            <DEIRegularText
              title={'EXPIRES'}
              style={{ color: '#8C8C8C', fontSize: 7 }}
            />
            <DEIMediumText
              title={cardInfo.cardExpiry}
              style={{ color: '#fff', fontSize: 16, marginTop: 5 }}
            />
          </View>
        </View>
      </View>
    );
  }

  renderCardCover = () => {
    return (
      <View style={{ height: 330 }}>
        <Carousel
          layout={'default'}
          removeClippedSubviews={false}
          ref={c => {
            this._carousel = c;
          }}
          data={this.state.cardList}
          renderItem={this._renderItem}
          sliderWidth={scrWidth}
          itemWidth={itemWidth}
          onSnapToItem={index => this.setState({ selectedIndex: index })}
        />
        {this.pagination()}
      </View>
    );
  };

  cardChanged = index => {
    this.setState({ selectedIndex: index });
    this._carousel.snapToItem(index);
  };

  renderCardList = () => {
    return (
      <View style={{ height: 50 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          extraData={this.state}
          data={this.state.cardList}
          keyExtractor={(index, item) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => this.cardChanged(index)}
              style={{ marginHorizontal: 20, justifyContent: 'center' }}
            >
              <DEIMediumText
                title={item.brand.toUpperCase()}
                style={{
                  fontSize: 12,
                  color:
                    index == this.state.selectedIndex ? '#262628' : '#C2C4CA'
                }}
              />

              <View
                style={{
                  height: 1,
                  backgroundColor:
                    this.state.selectedIndex == index ? '#262628' : '#fff',
                  marginTop: 10
                }}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  deleteConfirmation = () => {
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
            this.deleteCard(this.state.cardList[this.state.selectedIndex]);
          }
        }
      ],
      { cancelable: true }
    );
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
            console.log(res);
            var cards = this.state.cardList;
            cards.splice(this.state.selectedIndex, 1);
            var selectedIndex = 0;
            if (cards.length < 1) {
              selectedIndex = -1;
            }
            this.setState({
              isLoading: false,
              cardList: cards,
              selectedIndex: selectedIndex
            });
            this.getSavedCards();
          })
          .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
          });
      }
    });
  };

  getFormattedCardInfo = item => {
    const cardNo = 'XXXX XXXX XXXX ' + item.last4;
    const cardImage = getCardImage(item.brand);
    const cardExpiry = item.exp_month + '/' + item.exp_year;
    const cardName = item.description;
    return {
      cardNo: cardNo,
      cardImage: cardImage,
      cardExpiry: cardExpiry,
      cardName: cardName
    };
  };

  renderCardDetailsView = () => {
    const { cardList, selectedIndex } = this.state;
    if (this.state.selectedIndex == -1) {
      return <View />;
    }

    const item = cardList[selectedIndex];
    const cardInfo = item.cardInfo;

    return (
      <View>
        <DEIRegularText
          title={'CARD DETAILS'}
          style={{ marginLeft: 20, fontSize: 12, marginVertical: 10 }}
        />
        <AccountItemView
          title={'Card number'}
          details={cardInfo.cardNo}
          action={this.itemClicked}
        />
        <LineSeparator />
        <AccountItemView
          title={'Expires'}
          details={cardInfo.cardExpiry}
          action={this.itemClicked}
        />
        <LineSeparator />
        <AccountItemView
          title={'Card holder'}
          details={cardInfo.cardName}
          action={this.itemClicked}
        />
        <LineSeparator />
        <AccountItemView
          title={'CVV'}
          details={'****'}
          action={this.itemClicked}
        />
      </View>
    );
  };

  renderDetailView() {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.isLoading} />
        <ScrollView>
          <View>
            {this.renderCardCover()}
            {this.renderCardList()}
            <View style={{ height: 15, backgroundColor: '#F5F5F5' }} />
            {this.renderCardDetailsView()}
          </View>
          {this.state.cardList.length > 0 && (
            <View
              style={{
                height: 45,
                width: '90%',
                alignSelf: 'center',
                backgroundColor: '#F44336',
                borderColor: '#fff',
                borderRadius: 1,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                marginVertical: 15
              }}
            >
              <TouchableOpacity onPress={() => this.deleteConfirmation()}>
                <DEIMediumText
                  title={'DELETE CARD'}
                  style={{ color: '#fff' }}
                />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  addCardAction = () => {
    this.props.navigation.navigate('AddNewCard', {
      refreshItem: item => this.props.navigation.getParam('refreshItem')(item)
    });
  };

  render() {
    if (this.state.cardList.length < 1 && !this.state.isLoading) {
      return <EmptyView type={4} action={this.addCardAction} />;
    }
    return this.renderDetailView();
    //   return (
    //     <View style={{ flex: 1 }}>
    //       <Spinner visible={this.state.isLoading} />
    //       {this.state.cardList &&
    //         this.state.cardList.length > 0 &&
    //         this.renderDetailView}
    //       {this.state.cardList.length == 0 && (
    //         <EmptyView type={4} action={this.addCardAction} />
    //       )}
    //     </View>
    //   );
  }
}

const LineSeparator = () => {
  return (
    <View
      style={{
        height: 0.5,
        backgroundColor: '#EBECED',
        marginLeft: 20
      }}
    />
  );
};
export default PaymentList;

// <AccountItemView
//               title={'Card number'}
//               details={item.cardno}
//               isDisclosure={true}
//               action={this.itemClicked}
//             />
