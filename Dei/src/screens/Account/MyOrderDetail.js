import React, { Component } from 'react';
import { View, SectionList } from 'react-native';
import {
  MyOrderItem,
  MyOrderHeader,
  MyOrderFooter,
  MyOrderDeliveryHeader,
  MyOrderDetailFooter
} from './MyOrderComponents';
import MyOrderItemView from './MyOrderItem';
import { DEIBoldText } from '../../components';

class MyOrderDetail extends Component {
  static navigationOptions = {
    headerTintColor: '#B19CFD'
  };
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const orderDetails = navigation.getParam('orderInfo', {});
    console.log([orderDetails]);
    this.state = {
      orders: [orderDetails]
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SectionList
          style={{ backgroundColor: '#f5f5f5', marginTop: 10 }}
          ListFooterComponent={
            <MyOrderDeliveryHeader
              deliveryInfo={this.state.orders[0].address}
            />
          }
          renderItem={({ item, index, section }) => (
            <View>
              {index == 0 && <MyOrderHeader order={section.order} />}
              <MyOrderItemView product={item} />
              {index == section.data.length - 1 && (
                <MyOrderFooter orderDetails={section.order} />
              )}
            </View>
          )}
          extraData={this.state}
          sections={this.state.orders}
        />
      </View>

      // <SectionList
      //   style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      //   ListFooterComponent={
      //     <MyOrderDeliveryHeader
      //       deliveryInfo={this.state.orderInfo[0].delivery}
      //     />
      //   }
      //   renderSectionFooter={({ section }) => (
      //     <MyOrderDetailFooter section={section} />
      //   )}
      //   renderItem={({ item, index, section }) => (
      //     <View style={{ backgroundColor: '#fff' }}>
      //       <MyOrderItem item={item} />
      //     </View>
      //   )}
      //   sections={this.state.orderInfo}
      //   keyExtractor={(item, index) => item + index}
      // />
    );
  }
}

export default MyOrderDetail;
