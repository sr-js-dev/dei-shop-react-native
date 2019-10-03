import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Image
} from 'react-native';

class SortModalView extends Component {
  constructor(props) {
    super(props);

    // Price - Low to High
    // Price - High to Low
    // Product - A to Z
    // Product - Z to A

    const sortOptions = [
      { title: 'Price - Low to High', param: '&sort_order=asc&sort_by=price' },
      { title: 'Price - High to Low', param: '&sort_order=desc&sort_by=price' },
      { title: 'Product - A to Z', param: '&sort_order=asc&sort_by=product' },
      { title: 'Product - Z to A', param: '&sort_order=desc&sort_by=product' }
    ];

    var selectedIndex = -1;
    if (this.props.sortBy != null) {
      for (let index = 0; index < sortOptions.length; index++) {
        const element = sortOptions[index];
        if (element.param == this.props.sortBy) {
          selectedIndex = index;
          break;
        }
      }
    }

    this.state = {
      options: sortOptions,
      sortOrder: 'asc',
      selectedIndex: selectedIndex,
      offsetY: new Animated.Value(1000)
    };
  }

  componentDidMount() {
    setTimeout(() => {
      Animated.spring(this.state.offsetY, {
        toValue: 0,
        tension: 3,
        friction: 12
      }).start();
    }, 100);
  }

  sortItemClicked = index => {
    const item = this.state.options[index];
    this.setState({
      selectedIndex: index
    });

    setTimeout(() => {
      setTimeout(() => {
        this.props.onDismiss(item.param);
      }, 300);
      Animated.spring(this.state.offsetY, {
        toValue: 1000,
        tension: 3,
        friction: 12
      }).start();
    }, 40);
  };

  renderSortItem = (item, index) => {
    var selected = (selected =
      index == this.state.selectedIndex ? true : false);

    const fontWeightValue = selected ? '600' : '400';
    const selectedImage = selected
      ? require('../assets/Stores/ic_sort_select.png')
      : require('../assets/Stores/ic_sort_unselect.png');
    return (
      <TouchableOpacity
        style={{
          marginVertical: 8,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
        onPress={() => this.sortItemClicked(index)}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: fontWeightValue,
            color: selected ? '#fff' : '#ffffff80'
          }}
        >
          {item.title}
        </Text>
        <Image
          source={selectedImage}
          style={{ width: 15, height: 15, resizeMode: 'contain' }}
        />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.props.onDismiss(-1)}
          style={{
            justifyContent: 'flex-end',
            alignContent: 'flex-end',
            height: '100%',
            backgroundColor: '#00000038'
          }}
        >
          <Animated.View
            style={[{ transform: [{ translateY: this.state.offsetY }] }]}
          >
            <View
              style={{
                backgroundColor: '#B19CFD',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 15,
                  marginTop: 20,
                  marginLeft: 20
                }}
              >
                SORT BY
              </Text>
              <Text
                style={{
                  height: 1,
                  backgroundColor: '#ffffff20',
                  marginTop: 20
                }}
              />

              <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                <FlatList
                  data={this.state.options}
                  extraData={this.state}
                  renderItem={({ item, index }) =>
                    this.renderSortItem(item, index)
                  }
                />
              </View>
              <View style={{ height: 40 }} />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default SortModalView;
