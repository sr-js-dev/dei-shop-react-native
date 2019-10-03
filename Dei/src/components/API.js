import React, { Component } from 'react';
import { NetInfo } from 'react-native';

const BASEURL = 'http://api.dei.com.sg/api';

// Load More :  https://medium.com/@pateldhara248/flatlist-with-loadmore-and-pull-to-refresh-582d48eca60b
// https://github.com/morishin/react-native-infinite-scroll-grid

export default {
  Login: `${BASEURL}/customer/login`,
  Register: `${BASEURL}/customer/register`,
  ChangePassword: `${BASEURL}/customer/password`,
  ForgotPassword: `${BASEURL}/forgot`,
  VerifyForgotPassword: `${BASEURL}/forgot/verify`,
  launch: `${BASEURL}/launch`,
  Stores: `${BASEURL}/store`,
  StoresDetail: `${BASEURL}/product/store/`,
  Product: `${BASEURL}/product/`,
  SearchProduct: `${BASEURL}/product`,
  CategoryList: `${BASEURL}/product/categories`,
  CategoryProductList: `${BASEURL}/product/category/`,
  AddressAdd: `${BASEURL}/address/add`,
  AddressUpdate: `${BASEURL}/address/`,
  AddressList: `${BASEURL}/address`,
  AddressDelete: `${BASEURL}/address/delete/`,
  AddCard: `${BASEURL}/card/add`,
  Cards: `${BASEURL}/card`,
  RemoveCard: `${BASEURL}/card/delete/`,
  CustomerDetail: `${BASEURL}/customer/detail`,
  ProfileUpdate: `${BASEURL}/customer/update`,
  CartAdd: `${BASEURL}/cart/add`,
  Checkout: `${BASEURL}/checkout`,
  MyOrders: `${BASEURL}/order`
};

export const isNetworkConnected = () =>
  new Promise(resolve => {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
      resolve(isConnected);
    });
  });

export function NoInternetAlert() {
  return alert(
    'No Internet connection found.Check your connection or try again.'
  );
}
