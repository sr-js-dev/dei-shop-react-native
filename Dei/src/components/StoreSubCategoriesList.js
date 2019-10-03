import React, { Component } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { DEIMediumText, DEIRegularText, DEIBoldText } from './APIConstants';

class StoreSubCategoriesList extends Component {
  constructor(props) {
    super(props);
    var items = [];
    if (Array.isArray(this.props.subcategoriesList)) {
      items = this.props.subcategoriesList;
    }

    var index = 0;
    if (this.props.selectedCategoryIndex) {
      index = selectedCategoryIndex;
    }
    this.state = {
      subcategories: items,
      selectedIndex: index
    };
  }

  componentWillReceiveProps = nextProps => {
    if (
      nextProps.subcategoriesList != null &&
      Array.isArray(nextProps.subcategoriesList)
    ) {
      this.setState({ subcategories: nextProps.subcategoriesList });
    }

    if (nextProps.selectedCategoryIndex != null) {
      this.setState({ selectedIndex: nextProps.selectedCategoryIndex });
    } else {
      this.setState({ selectedIndex: 0 });
    }
  };

  itemClicked = index => {
    this.setState({ selectedIndex: index });

    var item = this.state.subcategories[index];
    item.selectedIndex = index;

    this.props.action(item);
  };

  render() {
    const { selectedIndex } = this.state;

    return (
      <View style={{ height: 42, backgroundColor: '#B19CFD' }}>
        <View style={{ height: 0.5, backgroundColor: '#EFEFEF' }} />
        <FlatList
          horizontal
          keyExtractor={item => item.category_id}
          style={{ marginHorizontal: 20, marginTop: 10 }}
          data={this.state.subcategories}
          extraData={this.state}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => this.itemClicked(index)}>
              <DEIMediumText
                title={item.category}
                style={{
                  color: index == selectedIndex ? '#ffffff' : '#000000', //'#8CA2F8' : '#9393A7',
                  textAlign: 'center',
                  marginHorizontal: 10,
                  fontSize: 13
                }}
              />
              {index == selectedIndex && (
                <View
                  style={{
                    marginTop: 5,
                    height: 1,
                    backgroundColor: '#ffffff' //'#8CA2F8'
                  }}
                />
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

export { StoreSubCategoriesList };
