import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';

import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';

class SgProfilePic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      picSource: null
    };
    var source = this.props.sourceURL;
    this.convertURLtoBase64(source);
  }

  convertURLtoBase64(source) {
    if (source != null) {
      const fs = RNFetchBlob.fs;
      let imagePath = null;
      RNFetchBlob.config({
        fileCache: true
      })
        .fetch('GET', source)
        // the image is now dowloaded to device's storage
        .then(resp => {
          // the image path you can use it directly with Image component
          imagePath = resp.path();
          return resp.readFile('base64');
        })
        .then(base64Data => {
          // here's base64 encoded image
          console.log(base64Data);
          // remove the file from storage
          const convertedSource = {
            uri: 'data:image/jpeg;base64,' + base64Data
          };
          this.setState({ picSource: convertedSource });
          return fs.unlink(imagePath);
        });
    }
  }

  photoSelected = picSource => {
    this.props.action(picSource);
  };

  photoAction = () => {
    const options = {
      title: 'Select Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    /* Capture the image from camera / album */
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        //const source = { uri: response.uri };
        // You can also display the image using data:
        //  const source = { uri: 'data:image/jpeg;base64,' + response.data };

        /* Resize the image received from image picker */
        const source = { uri: response.uri };
        ImageResizer.createResizedImage(response.uri, 250, 250, 'JPEG', 80)
          .then(({ uri, path }) => {
            console.log(path);
            console.log(uri);
            /* Store the resize image to file path using RNFetchBlob in order to get a base64 image data */
            RNFetchBlob.fs
              .readFile(path, 'base64')
              .then(data => {
                console.log('converted source');
                const convertedSource = {
                  uri: 'data:image/jpeg;base64,' + data
                };
                this.setState({
                  picSource: convertedSource
                });

                setTimeout(() => {
                  this.photoSelected(convertedSource);
                }, 100);
              })
              .catch(err => {
                console.log('error');
                this.setState({
                  picSource: source
                });
              });
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };
  render() {
    const sourceImage =
      this.state.picSource == null
        ? require('./../assets/Signup/ic_emptyprofile.png')
        : this.state.picSource;
    return (
      <TouchableOpacity
        onPress={this.photoAction}
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          marginVertical: 20
        }}
      >
        <Image
          style={{
            width: 125,
            height: 125,
            borderRadius: 62.5,
            borderWidth: 0.3,
            borderColor: 'transparent'
          }}
          source={sourceImage}
        />
      </TouchableOpacity>
    );
  }
}

export { SgProfilePic };
