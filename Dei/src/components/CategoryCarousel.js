import React, { Component } from 'react';
import { View, Dimensions, Image } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const scrWidth = Dimensions.get('screen').width;
const itemWidth = scrWidth - 30;

class CategoryCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
      banners: [
        { image: require('../assets/Stores/ic_ctbanner01.png') },
        { image: require('../assets/Stores/ic_ctbanner01.png') },
        { image: require('../assets/Stores/ic_ctbanner01.png') }
      ]
    };
  }

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

  _renderItem({ item, index }) {
    return (
      <View style={{ justifyContent: 'center' }}>
        <Image
          source={item.image}
          style={{ width: 238, height: 197, resizeMode: 'contain' }}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={{ marginTop: 20, backgroundColor: '#fff' }}>
        <Carousel
          layout={'default'}
          removeClippedSubviews={false}
          ref={c => {
            this._carousel = c;
          }}
          data={this.state.banners}
          renderItem={this._renderItem}
          sliderWidth={scrWidth - 30}
          itemWidth={238}
          onSnapToItem={index => this.setState({ activeSlide: index })}
        />
        {this.pagination()}
      </View>
    );
  }
}

export { CategoryCarousel };
