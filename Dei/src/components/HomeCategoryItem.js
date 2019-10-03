import React, { Component } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { DEIBoldText, DEIMediumText } from './APIConstants';
import ImageLoad from 'react-native-image-placeholder';

export class HomeCategoryItem extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
      item: this.props.item
    };
  }
  componentWillReceiveProps = nextProps => {
    // debugger;
    if (nextProps.item != null) {
      this.setState({ item: nextProps.item });
    }
  };

  itemClicked(category) {
    this.props.onclick(category);
  }

  render() {
    var categoryItem = {};
    if (this.state.item.item != null) {
      categoryItem = this.state.item.item;
    }
    const { category, icon_url } = categoryItem;
    console.log("q", this.state.item);
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start'}}>
        {this.state.item.map((category, index) => {
          return (<TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10, 
            
          }}
          onPress={() => this.itemClicked(category)}
          >
            <ImageLoad
             key={index}
               style={{ width: 45, height: 45, resizeMode: 'contain' }}
               source={{ uri: category.icon_url }}
               customImagePlaceholderDefaultStyle={{
                 width: 45,
                 height: 45,
                 resizeMode: 'contain'
               }}
               placeholderSource={require('../assets/Home/ic_placeholderproduct_box.png')}
               isShowActivity={false}
               backgroundColor={'#E6E7E8'}
             />
            <DEIMediumText
              title={category.category}
              style={{
                width: 50,
                color: '#000',
                marginVertical: 20,
                textAlign: 'center',
                fontSize: 12
              }}
            />
          </TouchableOpacity>)
        })}
      </View>
    );
  }
}

export default HomeCategoryItem;
