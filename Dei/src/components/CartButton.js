import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { DEIBoldText } from './APIConstants';

class CartButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, viewStyle } = this.props;
    return (
      <ImageBackground
        style={[{ width: '100%', height: 100 }, viewStyle]}
        imageStyle={{ resizeMode: 'contain' }}
        source={require('../assets/Stores/ic_cartshadow.png')}
      >
        <TouchableOpacity onPress={() => this.props.action()}>
          <View style={styles.viewStyle}>
            <DEIBoldText
              title={title}
              style={{ fontSize: 16, color: '#fff' }}
            />
          </View>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    height: 47,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8CA2F8',
    marginTop: 15,
    borderRadius: 25
  }
});
export { CartButton };
