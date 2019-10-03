import React, { Component } from 'react';
import { View, Image, Dimensions, TouchableOpacity } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const scrWidth = Dimensions.get('screen').width;
const itemWidth = scrWidth - 30;

class StoreCarousel extends Component {
  constructor(props) {
    super(props);
    var bannerArray = [];
    const bannerList = this.props.banners;
    if (Array.isArray(bannerList) && bannerList.length) {
      bannerArray = bannerList;
    }
    /*
    [
        { image: require('../assets/Stores/ic_banner03.png') },
        { image: require('../assets/Stores/ic_banner02.png') },
        { image: require('../assets/Stores/ic_banner01.png') }
      ] */
    this.state = {
      activeSlide: 0,
      layoutType: this.props.type,
      banners: bannerList
    };

    this._onPress = this._onPress.bind(this);
  }

  componentWillReceiveProps = nextProps => {
    var bannerArray = [];
    if (nextProps.banners != null && Array.isArray(nextProps.banners)) {
      const bannerList = nextProps.banners;
      if (Array.isArray(bannerList) && bannerList.length) {
        bannerArray = bannerList;
      }
      this.setState({ banners: bannerArray });
    }
  };

  pagination() {
    const { banners, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={banners.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: '#fff' }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 4,
          backgroundColor: '#7850FF'
        }}
        inactiveDotStyle={{
          backgroundColor: '#A7A7A7'
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={1.0}
      />
    );
  }

  _onPress(item) {
    this.props.clickAction(item);
  }

  _renderItem({ item, index }) {
    const _this = this;
    return (
      <View style={{ justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => _this._onPress(item)}>
          <Image
            source={{ uri: item.image }}
            style={{ width: itemWidth, height: 120, resizeMode: 'contain' }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View>
        <Carousel
          layout={'tinder'}
          layoutCardOffset={9}
          removeClippedSubviews={false}
          ref={c => {
            this._carousel = c;
          }}
          data={this.state.banners}
          renderItem={this._renderItem.bind(this)}
          sliderWidth={scrWidth}
          itemWidth={itemWidth}
          onSnapToItem={index => this.setState({ activeSlide: index })}
        />
        {/* {this.pagination()} */}
      </View>
    );
  }
}

export default StoreCarousel;

export { StoreCarousel };
