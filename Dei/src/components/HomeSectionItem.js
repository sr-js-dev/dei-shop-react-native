import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';
import Grid from './EasyGrid';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { STCartGridItem } from './STCartGridItem';
import { DEIMediumText, DEIBoldText } from './APIConstants';
import ImageLoad from 'react-native-image-placeholder';

export class HomeSectionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item,
      index: 0
    };
  }
  componentWillReceiveProps = nextProps => {
    // debugger;
    if (nextProps.stores != null) {
      var storeList = nextProps.item;
      this.setState({ item: item });
    }

    if (nextProps.index != null) {
      this.setState({ index: nextProps.index });
    }
  };

  productItemClicked = item => {
    this.props.homeNavigation.navigate('HomeProductDetail', {
      ProductId: item.product_id,
      count: item.quantity,
      product: item
    });
  };

  renderProduct(item) {
    return <STCartGridItem item={item} action={this.productItemClicked} />;
  }

  bannerClicked = item => {
    //debugger;
    this.props.urlClicked(item);
  };

  renderTitleandViewAll(name) {
    return (
      <View
        style={{
          marginTop: 13,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 20
        }}
      >
        <DEIBoldText title={name} />
        <TouchableOpacity>
          <DEIMediumText title={'View All'} style={{ color: '#868686' }} />
        </TouchableOpacity>
      </View>
    );
  }

  renderBannerImage(bannerUrl) {
    return (
      <View style={styles.bannerViewStyle}>
        <TouchableOpacity onPress={() => this.bannerClicked(this.state.item)}>
          <ImageLoad
            style={{ height: 108, width: '100%' }}
            source={{ uri: bannerUrl }}
            placeholderSource={require('../assets/Home/ic_placeholder_banner.png')}
            isShowActivity={false}
            backgroundColor={'#fff'}
          />
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    var products = [];
    if (this.state.item.products != null) {
      products = this.state.item.products;
    }

    var name = '';
    if (this.state.item.name != null) {
      name = this.state.item.name;
    }

    var bannerUrl = '';
    if (
      this.state.item.banner_url != null &&
      this.state.item.banner_url.length > 0
    ) {
      bannerUrl = this.state.item.banner_url;
    }
    console.log(this.state.index);
    const bgColor = this.state.index % 2 == 0 ? '#fff' : '#e9e9e9';
    return (
      <View style={{ backgroundColor: bgColor }}>
        {bannerUrl.length < 1
          ? this.renderTitleandViewAll(name)
          : this.renderBannerImage(bannerUrl)}

        <View style={styles.productViewStyle} elevation={5}>
          <Grid
            marginExternal={4}
            marginInternal={4}
            numColumns={3}
            data={products}
            renderItem={product => (
              <View style={{ backgroundColor: '#fff' }}>
                <STCartGridItem
                  item={product.item}
                  action={this.productItemClicked}
                />
              </View>
            )}
          />
        </View>
        {/* <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginTop: 10
          }}
          data={products}
          extraDat={this.state}
          renderItem={({ item, index }) => this.renderProduct(item)}
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bannerViewStyle: {
    height: 108,
    backgroundColor: '#fff',
    shadowColor: '#868686',
    shadowOffset: {
      width: 1,
      height: 3
    },
    shadowOpacity: 1.0,
    shadowRadius: 10.0,
    elevation: 10
  },
  productViewStyle: {
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 10,
    shadowColor: '#00000050',
    shadowOffset: {
      width: 1,
      height: 10
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    backgroundColor: '#E9E9E9'
  }
});

export default HomeSectionItem;
