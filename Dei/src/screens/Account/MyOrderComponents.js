import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { DEIMediumText, DEIRegularText } from '../../components';

export const MyOrderItem = ({ item }) => {
  return (
    <View style={{ backgroundColor: '#fff', marginHorizontal: 10 }}>
      <View style={{ flexDirection: 'row', margin: 20 }}>
        <Image
          source={require('../../assets/Orders/ic_order_image.png')}
          style={{
            width: 81,
            height: 101,
            borderColor: '#4A4A4A',
            borderWidth: 0.2
          }}
        />
        <View style={{ marginLeft: 15 }}>
          <DEIRegularText title={item.name} />
          <DEIMediumText
            title={item.price}
            style={{ fontSize: 16, marginTop: 6 }}
          />
          <SizeTextView title={'SIZE'} desc={item.size} />
          <SizeTextView title={'QUANTITY'} desc={item.quantity} />
        </View>
      </View>
    </View>
  );
};

export const MyOrderHeader = ({ order }) => {
  return (
    <View style={styles.headerViewStyle}>
      <DEIRegularText
        title={`OrderNo: ${order.order_id}`}
        style={{
          color: '#262628',
          padding: 10
        }}
      />
      <View style={{ backgroundColor: '#EBECED', height: 1 }} />
    </View>
  );
};

export const MyOrderFooter = orderDetails => {
  var orderStatus = '';
  var estimatedDelivery = '';
  if (orderDetails != null && orderDetails.orderDetails != null) {
    orderStatus = orderDetails.orderDetails.order_status;
    estimatedDelivery = orderDetails.orderDetails.estimated_delivery;
  }

  const { footerViewStyle, footerRowStyle } = styles;
  return (
    <View style={footerViewStyle}>
      {/* <View style={{ backgroundColor: '#EBECED', height: 1 }} /> */}
      <View style={footerRowStyle}>
        <View>
          <EstimatedTitleText text={'Status'} />
          <EstimatedDescText title={orderStatus} color={'#FF8960'} />
        </View>
        <View style={{ marginRight: 10 }}>
          <EstimatedTitleText text={'Estimated Delivery'} />
          <EstimatedDescText title={estimatedDelivery} color={'#262628'} />
        </View>
      </View>
      <View style={{ height: 20 }} />
    </View>
  );
};

const SizeTextView = ({ title, desc }) => {
  return (
    <View style={{ flexDirection: 'row', marginTop: 10 }}>
      <DEIRegularText title={title} style={{ color: '#C2C4CA' }} />
      <DEIRegularText
        title={desc}
        style={{ marginLeft: 10, color: '#262628' }}
      />
    </View>
  );
};
const EstimatedDescText = ({ title, customStyle, color }) => {
  return (
    <DEIRegularText
      title={title}
      style={[
        {
          color: color,
          paddingLeft: 10,
          fontSize: 16
        },
        customStyle
      ]}
    />
  );
};

const EstimatedTitleText = ({ text, customStyle }) => {
  return (
    <DEIRegularText
      title={text}
      style={[
        {
          color: '#C2C4CA',
          paddingLeft: 10,
          fontSize: 15
        },
        customStyle
      ]}
    />
  );
};

export const MyOrderDeliveryHeader = ({ deliveryInfo }) => {
  const { profile_name, address, zipcode, state, phone } = deliveryInfo;
  return (
    <View style={{ backgroundColor: '#fff' }}>
      <View style={{ height: 20, backgroundColor: '#f5f5f5' }} />
      <View style={{ margin: 20 }}>
        <DEIRegularText
          title={'DELIVERY ADDRESS'}
          style={styles.deliveryTitleStyle}
        />
        <DEIMediumText title={profile_name} style={styles.deliveryDescStyle} />
        <DEIMediumText
          title={address + ', ' + state + ' ' + zipcode}
          style={styles.deliveryDescStyle}
        />
        <DEIMediumText title={phone} style={styles.deliveryDescStyle} />
        <DEIMediumText
          title={'NEED HELP?'}
          style={{ color: '#F05522', textAlign: 'center', marginTop: 40 }}
        />
      </View>
    </View>
  );
};

export const MyOrderDetailFooter = ({ section }) => {
  return (
    <View style={styles.orderFooterStyle}>
      <View style={{ marginLeft: 20 }}>
        <EstimatedDescText
          title={section.status}
          customStyle={{ fontSize: 12 }}
          color={section.status_color}
        />
        <View style={{ marginRight: 10, flexDirection: 'row', marginTop: 5 }}>
          <EstimatedTitleText
            text={'Estimated Delivery : '}
            customStyle={{ fontSize: 12 }}
          />
          <EstimatedDescText
            title={section.estimated}
            color={'#262628'}
            customStyle={{ fontSize: 12, color: '#262628' }}
          />
        </View>
        <View style={{ height: 10 }} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  orderFooterStyle: {
    backgroundColor: '#fff',
    height: 50
  },
  headerViewStyle: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    height: 50,
    marginHorizontal: 10
  },
  footerViewStyle: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10
  },
  footerRowStyle: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  deliveryTitleStyle: {
    color: '#C2C4CA',
    paddingLeft: 10,
    fontSize: 12
  },
  deliveryDescStyle: {
    color: '#4A4A4A',
    paddingLeft: 10,
    fontSize: 13,
    marginVertical: 6
  }
});
