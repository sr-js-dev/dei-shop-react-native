import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { StoreMainCategoriesList } from './mockData';
import { StoreCategoryItem } from './index';

class StoreCategories extends Component {
  constructor(props) {
    super(props);
    // var categories = [];
    // if (this.props.categories != null) {
    //   if (this.props.categories.count > 0) {
    //     categories = this.props.categories;
    //   }
    // }

    var selectedCategoryindex = 0;
    if (this.props.selectedIndex != null) {
      selectedCategoryindex = this.props.selectedIndex;
    }
    this.state = {
      categoryList: [],
      selectedCategoryIndex: selectedCategoryindex
    };
  }
  componentWillReceiveProps = nextProps => {
    //  debugger;
    if (nextProps.categories != null && Array.isArray(nextProps.categories)) {
      //console.log('inside category props' + nextProps.categories);
      this.setState({
        categoryList: nextProps.categories,
        selectedCategoryIndex: nextProps.selectedIndex
      });
    }
  };

  storeCategoryItemClicked = (item, index) => {
    this.setState({
      selectedCategoryIndex: index
    });

    this.props.action(item, index);
  };

  imageForCategory = title => {
    var image = require('../assets/Stores/ic_beauty.png');
    if (title.includes('Groceries & Staples')) {
      image = require('../assets/Stores/ic_grocery.png');
    } else if (title.includes('Health & Beauty')) {
      image = require('../assets/Stores/ic_beauty.png');
    } else if (title.includes('Organic')) {
      image = require('../assets/Stores/ic_organic.png');
    } else if (title.includes('Prayer Items')) {
      image = require('../assets/Stores/ic_prayer.png');
    } else if (title.includes('Household')) {
      image = require('../assets/Stores/ic_household.png');
    }
    return image;
  };

  renderRow = (item, index) => {
    const { category } = item;
    return (
      <TouchableOpacity
        onPress={() => this.storeCategoryItemClicked(item, index)}
      >
        <StoreCategoryItem
          title={category}
          icon={this.imageForCategory(category)}
          isselected={this.state.selectedCategoryIndex == index ? true : false}
        />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View
        style={{
          width: '100%',
          height: 60,
          marginLeft: 10,
          marginRight: 30
        }}
      >
        <FlatList
          horizontal
          style={{ marginRight: 20 }}
          keyExtractor={item => item.category_id}
          showsHorizontalScrollIndicator={false}
          extraData={this.state}
          data={this.state.categoryList}
          renderItem={({ item, index }) => this.renderRow(item, index)}
        />
      </View>
    );
  }
}

export { StoreCategories };
