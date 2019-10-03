/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Image, View, Text } from 'react-native';
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation';
import AppSessionManager from './src/components/AppSessionManager';
import SplashScreen from './src/screens/Signup/Welcome';

import AppOnboardingScreen from './src/screens/Signup/AppOnboarding';
import LoginScreen from './src/screens/Signup/Login';
import RegisterScreen from './src/screens/Signup/Register';
import ForgotPasswordScreen from './src/screens/Signup/ForgotPassword';
import VerifyForgotPasswordScreen from './src/screens/Signup/ForgotVerifyPassword';

import HomeScreen from './src/screens/Home/Home';
import HomeNewScreen from './src/screens/Home/HomePage';
import StoresListScreen from './src/screens/Home/StoresList';
import StoreDetailScreen from './src/screens/Home/StoreDetail';
import ProductDetailScreen from './src/screens/Home/ProductDetail';
import ProductPreviewScreen from './src/screens/Home/ProductPreview';

import CategoriesListScreen from './src/screens/Categories/CategoriesList';
import CategoriesBannerListScreen from './src/screens/Categories/CategoryBannerList';
import CategorySearchScreen from './src/screens/Categories/CategorySearch';
import BannerCategoryScreen from './src/screens/Home/BannerCategory';

import MyAccountScreen from './src/screens/Account/MyAccount';
import MyAddressListScreen from './src/screens/Account/MyAddressList';
import MyOrderScreen from './src/screens/Account/MyOrders';
import MyOrderDetailScreen from './src/screens/Account/MyOrderDetail';
import MySettingScreen from './src/screens/Account/MySettings';
import ChangePasswordScreen from './src/screens/Account/ChangePassword';

import CartListScreen from './src/screens/Cart/CartList';
import AddNewCard from './src/screens/Cart/AddNewCard';
import PaymentListScreen from './src/screens/Account/PaymentList';
import CheckoutScreen from './src/screens/Cart/Checkout';
import TermsScreen from './src/screens/Account/Terms';

const WelcomeStack = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null
      }
    },
    Register: { screen: RegisterScreen },
    Onboard: { screen: AppOnboardingScreen },
    Terms: { screen: TermsScreen },
    ForgotPassword: { screen: ForgotPasswordScreen },
    VerifyForgotPassword: { screen: VerifyForgotPasswordScreen }
  },
  {
    initialRouteName: 'Onboard',
    defaultNavigationOptions: {
      headerBackTitle: 'Back',
      headerTintColor: '#B19CFD'
    }
  }
);

const HomeStack = createStackNavigator(
  {
    Home: { screen: HomeNewScreen },
    StoreList: { screen: StoresListScreen },
    StoreDetail: { screen: StoreDetailScreen },
    ProductDetail: { screen: ProductDetailScreen },
    HomeStoreCategories: { screen: CategoriesListScreen },
    HomeProductDetail: { screen: ProductDetailScreen },
    HomeCategorySearch: { screen: CategorySearchScreen },
    BannerCategory: { screen: BannerCategoryScreen },
    ProductPreview: { screen: ProductPreviewScreen },
    HomeBannerUrlPage: { screen: TermsScreen },
    HomeBannerCategoryList: { screen: CategoriesBannerListScreen }
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerBackTitle: 'Back',
      headerTintColor: '#B19CFD'
    }
  }
);

HomeStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};
  // if (
  //   routeName == 'HomeCategorySearch' ||
  //   routeName == 'HomeProductDetail' ||
  //   routeName == 'HomeStoreCategories' ||
  //   routeName == 'StoreList' ||
  //   routeName == 'StoreDetail'
  // ) {
  //   navigationOptions.tabBarVisible = false;
  // }

  if (routeName != 'Home') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

const CategoryStack = createStackNavigator(
  {
    StoreList: { screen: CategoriesListScreen },
    HomeProductDetail: { screen: ProductDetailScreen },
    CategorySearch: { screen: CategorySearchScreen },
    ProductPreview: { screen: ProductPreviewScreen }
  },
  {
    initialRouteName: 'StoreList', //'StoreList'
    defaultNavigationOptions: {
      headerBackTitle: 'Back',
      headerTintColor: '#B19CFD'
    }
  }
);

CategoryStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};
  if (
    routeName === 'HomeProductDetail' ||
    routeName === 'CategorySearch' ||
    routeName === 'ProductPreview'
  ) {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

const StoreCategoryStack = createStackNavigator({
  StoreCategoriesMain: { screen: CategoriesListScreen }
});

const MyAccountStack = createStackNavigator(
  {
    MyAccountMain: { screen: MyAccountScreen },
    MyOrders: { screen: MyOrderScreen },
    MyOrderDetail: { screen: MyOrderDetailScreen },
    SavedCards: { screen: PaymentListScreen },
    MySetting: { screen: MySettingScreen },
    ChangePassword: { screen: ChangePasswordScreen },
    AddNewCard: { screen: AddNewCard },
    MyAddressList: { screen: MyAddressListScreen },
    Terms: { screen: TermsScreen },
    Register: { screen: RegisterScreen }
  },
  {
    initialRouteName: 'MyAccountMain',
    defaultNavigationOptions: {
      headerBackTitle: 'Back',
      headerTintColor: '#B19CFD'
    }
  }
);

MyAccountStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (routeName != 'MyAccountMain') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

const CartStack = createStackNavigator(
  {
    CartMain: { screen: CartListScreen },
    CheckoutMain: { screen: CheckoutScreen },
    AddNewCard: { screen: AddNewCard }
  },
  {
    initialRouteName: 'CartMain'
  }
);

CartStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};
  if (routeName == 'AddNewCard' || routeName == 'CheckoutMain') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

const AppTabStack = createBottomTabNavigator(
  {
    Home: { screen: HomeStack },
    Categories: { screen: CategoryStack },
    Account: { screen: MyAccountStack },
    Cart: { screen: CartStack }
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        AppSessionManager.shared().setNavigation(navigation);
        const { routeName } = navigation.state;
        if (routeName === 'Home') {
          const homeIcon = focused
            ? require('./src/assets/Tabs/ic_tab_home_select.png')
            : require('./src/assets/Tabs/ic_tab_home.png');
          return <Image source={homeIcon} style={{ width: 23, height: 23 }} />;
        } else if (routeName === 'Categories') {
          const goalIcon = focused
            ? require('./src/assets/Tabs/ic_tab_category_select.png')
            : require('./src/assets/Tabs/ic_tab_category.png');
          return (
            <Image
              source={goalIcon}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          );
        } else if (routeName === 'Account') {
          const earningIcon = focused
            ? require('./src/assets/Tabs/ic_tab_acc_select.png')
            : require('./src/assets/Tabs/ic_tab_acc.png');
          return (
            <Image source={earningIcon} style={{ width: 23, height: 23 }} />
          );
        }
        const badgeCount = navigation.getParam('badgeCount', 0);
        const learnIcon = focused
          ? require('./src/assets/Tabs/ic_tab_cart_select.png')
          : require('./src/assets/Tabs/ic_tab_cart.png');
        // return (
        //   <Image
        //     source={learnIcon}
        //     style={{ width: 23, height: 23, resizeMode: 'contain' }}
        //   />
        // );
        return (
          <View style={{ width: 24, height: 24, margin: 5 }}>
            <Image source={learnIcon} style={{ width: 23, height: 23 }} />
            {badgeCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  right: -8,
                  top: -4,
                  backgroundColor: '#FF8960',
                  borderRadius: 8,
                  width: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}
                >
                  {badgeCount}
                </Text>
              </View>
            )}
          </View>
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: '#8CA2F8',
      inactiveTintColor: '#9393A7'
    }
  }
);

const AppSwitchStack = createSwitchNavigator(
  {
    Welcome: SplashScreen,
    Auth: WelcomeStack,
    StoreHome: AppTabStack
  },
  {
    initialRouteName: 'Welcome'
  }
);

export default createAppContainer(AppSwitchStack);
