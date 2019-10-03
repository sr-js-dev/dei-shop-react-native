import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
  Animated,
  Modal
} from 'react-native';

import { FlatGrid } from 'react-native-super-grid';
import { FilterCategories } from './mockData';

import MultiSlider from '@ptomasroos/react-native-multi-slider';

const scrWidth = Dimensions.get('screen').width;
const GridWidth = scrWidth / 3 - 30;
const gradBgImage = require('../assets/Signup/ic_signin.png');
const backImage = require('../assets/Signup/ic_back.png');

class StoreFilter extends Component {
  constructor(props) {
    super(props);

    var priceRange = [1, 1000];
    let isPriceRangeAvailable = Boolean(
      Array.isArray(this.props.priceRange) && this.props.priceRange.length
    );
    if (isPriceRangeAvailable) {
      priceRange = this.props.priceRange;
    }

    var filterList = [];
    for (let index = 0; index < FilterCategories.length; index++) {
      const title = FilterCategories[index];
      filterList.push({ title: title, selected: index == 0 ? true : false });
    }
    this.state = {
      categories: filterList,
      priceRange: priceRange,
      offsetY: new Animated.Value(-1000),
      isFilterVisible: this.props.visible,
      isPriceRangeAvailable: isPriceRangeAvailable
    };
  }

  componentDidMount() {
    setTimeout(() => {
      Animated.spring(this.state.offsetY, {
        toValue: 0,
        velocity: 50,
        tension: 10,
        friction: 5
      }).start();
    }, 100);
  }

  filterCategoryItemClicked = item => {
    const index = this.state.categories.indexOf(item);
    if (index != null) {
      item.selected = !item.selected;
      var categoriesList = this.state.categories;
      categoriesList[index] = item;
      this.setState({
        categories: categoriesList
      });
    }
  };

  renderFilterCategories = () => {
    const { FilterItemSelectedStyle, FilterItemStyle } = styles;
    return (
      <FlatGrid
        itemDimension={GridWidth}
        items={this.state.categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => this.filterCategoryItemClicked(item)}
          >
            <ImageBackground
              style={FilterItemStyle}
              source={item.selected ? gradBgImage : null}
              imageStyle={{
                borderRadius: 20,
                borderWidth: item.selected ? 0.1 : 1,
                borderColor: '#747474'
              }}
            >
              <Text style={{ color: item.selected ? '#fff' : '#747474' }}>
                {item.title}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    );
  };

  sliderValueChanged = values => {
    this.setState({
      priceRange: values
    });
  };

  priceRangeText = isMin => {
    const value = isMin ? this.state.priceRange[0] : this.state.priceRange[1];
    return '$' + value;
  };

  formatPriceRange = () => {
    if (this.state.priceRange.length < 2) {
      return;
    }
    return `&price_from=${this.state.priceRange[0]}&price_to=${
      this.state.priceRange[1]
    }`;
  };

  submitFilter = () => {
    // const stringPriceRange = this.formatPriceRange();
    this.setState({ isFilterVisible: false });
    this.props.applyFilter(this.state.priceRange);
  };

  resetFilter = () => {
    this.setState({ isFilterVisible: false });
    this.props.applyFilter([]);
  };

  renderReset = () => {
    return (
      <TouchableOpacity onPress={this.resetFilter}>
        <View style={styles.resetFilterViewStyle}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>
            Reset
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      filterContainerStyle,
      titleStyle,
      applyFilterViewStyle,
      maxminViewStyle,
      viewStyle,
      filterTitlestyle
    } = styles;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isFilterVisible}
      >
        <SafeAreaView style={{ backgroundColor: '#fff' }}>
          <View style={viewStyle}>
            <TouchableOpacity
              style={{ marginLeft: 20, width: '10%', marginTop: 10 }}
              onPress={this.props.backAction}
            >
              <Image
                source={backImage}
                style={{ width: 15, height: 15, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
            <Text style={filterTitlestyle}>Filter</Text>
          </View>
          <Animated.View
            style={[{ transform: [{ translateY: this.state.offsetY }] }]}
          >
            <View style={filterContainerStyle}>
              <View>
                <Text style={titleStyle}>Price Range</Text>
                <View style={maxminViewStyle}>
                  <MaxMinPriceView
                    title={'Min Price'}
                    desc={this.priceRangeText(true)}
                  />
                  <MaxMinPriceView
                    title={'Max Price'}
                    desc={'$100'}
                    desc={this.priceRangeText(false)}
                  />
                </View>
                <View style={{ marginHorizontal: 10 }}>
                  <MultiSlider
                    values={this.state.priceRange}
                    sliderLength={scrWidth - 100}
                    onValuesChange={this.sliderValueChanged}
                    min={0}
                    max={1000}
                    step={5}
                    allowOverlap
                    snapped
                  />
                </View>
                <View style={{ height: 10 }} />
              </View>
              {/* <View style={{ minHeight: 150, marginBottom: 20 }}>
              <Text style={titleStyle}>Categories</Text>
              {this.renderFilterCategories()}
            </View> */}

              <TouchableOpacity onPress={this.submitFilter}>
                <View style={applyFilterViewStyle}>
                  <Text
                    style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}
                  >
                    Apply Filter
                  </Text>
                </View>
              </TouchableOpacity>

              {this.state.isPriceRangeAvailable == true && this.renderReset()}

              <View style={{ height: 10 }} />
            </View>
          </Animated.View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const MaxMinPriceView = ({ title, desc }) => {
  return (
    <View style={{ justifyContent: 'flex-start' }}>
      <Text style={{ color: '#979797', fontSize: 12 }}>{title}</Text>
      <Text style={{ fontSize: 13 }}>{desc}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 15
  },
  filterTitlestyle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    width: '70%'
  },
  filterContainerStyle: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#fff',
    marginVertical: 10,
    shadowColor: '#00000060',
    padding: 10,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13
  },
  titleStyle: {
    fontSize: 17,
    fontWeight: '500',
    marginTop: 10
  },

  FilterItemStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40
  },
  applyFilterViewStyle: {
    backgroundColor: '#8CA2F8',
    marginHorizontal: 20,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25
  },
  resetFilterViewStyle: {
    backgroundColor: '#999',
    marginHorizontal: 20,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 15
  },
  maxminViewStyle: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
export default StoreFilter;
