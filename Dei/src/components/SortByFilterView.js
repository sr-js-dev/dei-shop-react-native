import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { DEIRegularText } from './APIConstants';

const SortItem = ({ title, action }) => {
  const { sortViewStyle, rowViewStyle, textStyle } = styles;
  const icon =
    title == 'Sort By'
      ? require('../assets/Stores/ic_sort.png')
      : require('../assets/Stores/ic_filter.png');
  return (
    <TouchableOpacity style={rowViewStyle} onPress={action}>
      <Image
        style={{
          width: 15,
          height: 17,
          resizeMode: 'contain',
          marginRight: 15
        }}
        source={icon}
      />
      <DEIRegularText style={textStyle} title={title} />
    </TouchableOpacity>
  );
};

// const SortByFilterView = ({ sort, filter }) => {
//   const { sortViewStyle, rowViewStyle, textStyle } = styles;
//   return (
//     <View style={sortViewStyle}>
//       <TouchableOpacity style={rowViewStyle} onPress={() => sort}>
//         <Text style={textStyle}>Sort By</Text>
//       </TouchableOpacity>
//       {/* <SortItem title={'Sort By'} action={sort} /> */}
//       <SortItem title={'Filter'} action={filter} />
//     </View>
//   );
// };

class SortByFilterView extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {};
  }

  render() {
    const { sortViewStyle, rowViewStyle, textStyle } = styles;
    return (
      <View style={sortViewStyle}>
        <SortItem title={'Sort By'} action={() => this.props.sort()} />
        <SortItem title={'Filter'} action={() => this.props.filter()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sortViewStyle: {
    flexDirection: 'row',
    width: '100%',
    height: 42,
    alignItems: 'center'
  },
  textStyle: {
    color: '#232323',
    fontSize: 15
  },
  rowViewStyle: {
    justifyContent: 'center',
    width: '50%',
    height: 42,
    alignItems: 'center',
    borderColor: '#EFEFEF',
    borderWidth: 1,
    flexDirection: 'row'
  }
});

export default SortByFilterView;
