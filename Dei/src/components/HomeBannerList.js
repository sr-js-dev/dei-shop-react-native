import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import { DEIMediumText } from './APIConstants';

const scrWidth = Dimensions.get('screen').width;

export class HomeBannerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: this.props.stores
    };
  }
  componentWillReceiveProps = nextProps => {
    // debugger;
    if (nextProps.stores != null) {
      var storeList = nextProps.stores;
      this.setState({ stores: storeList });
      for (item in storeList) {
        console.log(item);
      }
    }
  };

  renderStore = item => {
    var imageurl = '';
    if (item.banner_url != null) {
      imageurl = item.logo.image_path;
    }
    return (
      <TouchableOpacity
        style={{ width: 108, height: 108, marginRight: 15 }}
        onPress={() => this.props.onClick(item)}
      >
        <ImageLoad
          style={{
            width: 108,
            height: 108,
            shadowColor: '#000',
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 10,
            shadowOffset: {
              width: 0,
              height: 4
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8
          }}
          placeholderSource={require('../assets/Home/ic_PlaceholderShop_box.png')}
          source={{ uri: imageurl }}
          isShowActivity={false}
          backgroundColor={'#E6E7E8'}
        />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{
          height: 118,
          marginTop: 10
        }}
        horizontal
        data={this.state.stores}
        extraDat={this.state}
        renderItem={({ item, index }) => this.renderStore(item)}
      />
    );
  }
}

export default HomeBannerList;
