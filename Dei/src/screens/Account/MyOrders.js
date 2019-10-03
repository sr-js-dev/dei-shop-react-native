import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  SectionList,
  Text,
  StyleSheet
} from 'react-native';
import { myOrdersList } from '../../components/mockData';
import { AXIOS_CONFIG, DEIRegularText } from '../../components';

import { MyOrderItem, MyOrderHeader, MyOrderFooter } from './MyOrderComponents';
import API from '../../components/API';
import Axios from 'axios';
import AppSessionManager from '../../components/AppSessionManager';
import Spinner from 'react-native-loading-spinner-overlay';
import MyOrderItemView from './MyOrderItem';

class MyOrders extends Component {
  static navigationOptions = {
    title: 'My Orders',
    headerTintColor: '#B19CFD'
  };

  constructor(props) {
    super(props);
    this.state = { orders: [], currentPage: 1, isLoading: false };
  }

  componentDidMount() {
    this.fetchOrders();
  }

  fetchOrders = () => {
    this.setState({ isLoading: true });
    var url =
      API.MyOrders + `?page=${this.state.currentPage}&items_per_page=10`;
    console.log(url);

    // http://api.dei.com.sg/api/order?page=1&items_per_page=10
    var headers = AppSessionManager.shared().getAuthorizationHeader();
    Axios.get(url, headers, AXIOS_CONFIG)
      .then(result => {
        this.setState({ isLoading: false });
        if (result.status == 200) {
          const orderList = result.data.Orders;
          if (orderList != null && Array.isArray(orderList)) {
            var ordersTemp = [];
            for (let index = 0; index < orderList.length; index++) {
              const orderDetails = orderList[index];
              orderDetails.data = orderDetails.products;
              ordersTemp.push(orderDetails);
            }
            var orders = this.state.orders.concat(ordersTemp);
            console.log(orders);
            this.setState({ isLoading: false, orders: orders });
          } else {
            this.setState({ isLoading: false });
          }
        }
      })
      .catch(err => {
        console.log(err.response);
        this.setState({ isLoading: false });
      });
  };

  renderSectionHeader = section => {
    console.log(section.order);
    //  debugger;
    var orderId = '';
    if (section != null) {
      var sectionInfo = section;
      if (sectionInfo.order != null) {
        orderId = sectionInfo.order.order_id;
      }
    }
    return (
      <DEIRegularText
        title={`OrderNo: ${orderId}`}
        style={{
          color: '#262628',
          padding: 10
        }}
      />
    );
  };

  renderOrderHeader = order => {
    // var date = new Date(order.timestamp * 1000);
    // console.log(date);
    return (
      <View style={styles.headerViewStyle}>
        <DEIRegularText
          title={`OrderNo : ${order.order_id}`}
          style={{
            color: '#262628',
            padding: 10
          }}
        />
        <View style={{ backgroundColor: '#EBECED', height: 1 }} />
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <Spinner visible={this.state.isLoading} />
        <SectionList
          style={{ backgroundColor: '#f5f5f5', marginTop: 10 }}
          renderItem={({ item, index, section }) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('MyOrderDetail', {
                  orderInfo: section
                })
              }
            >
              {index == 0 && <MyOrderHeader order={section.order} />}
              <MyOrderItemView product={item} />
              {index == section.data.length - 1 && (
                <MyOrderFooter orderDetails={section.order} />
              )}
            </TouchableOpacity>
          )}
          extraData={this.state}
          sections={this.state.orders}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerViewStyle: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    height: 50,
    marginHorizontal: 10
  }
});

export default MyOrders;
