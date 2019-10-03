import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions } from 'react-native';
import Image from 'react-native-image-progress';
import ImageZoom from 'react-native-image-pan-zoom';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
class ProductPreview extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const taskImageUrl = navigation.getParam('url', '');
    console.log(taskImageUrl);

    this.state = {
      image: taskImageUrl,
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    Image.getSize(this.state.image, (width, height) => {
      console.log(width);
      console.log(height);
      const ratio = width / height;
      var imageWidth = width;
      var imageHeight = height;
      if (width > windowWidth) {
        imageWidth = windowWidth;
        imageHeight = imageWidth / ratio;
      }
      console.log(imageWidth);
      console.log(imageHeight);
      this.setState({ width: imageWidth, height: imageHeight });
    });
  }

  render() {
    return (
      <View>
        <ImageZoom
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height}
          imageWidth={this.state.width}
          imageHeight={this.state.height}
        >
          <Image
            source={{ uri: this.state.image }}
            style={{ width: '100%', height: '90%', resizeMode: 'contain' }}
          />
        </ImageZoom>
      </View>
    );
  }
}

export default ProductPreview;
