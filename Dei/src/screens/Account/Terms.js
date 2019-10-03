//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, WebView } from 'react-native';
import AppSessionManager from '../../components/AppSessionManager';

// create a component
class Terms extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title_name', 'Terms & Conditions')
    };
  };
  constructor(props) {
    super(props);
    var urlString = AppSessionManager.shared().getTermsUrl();
    if (this.props.navigation.state.params) {
      urlString = this.props.navigation.state.params.url;
    }
    console.log(urlString);
    this.state = { url: urlString };
  }

  componentDidMount() {}
  render() {
    return (
      <WebView source={{ uri: this.state.url }} style={{ marginTop: 20 }} />
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50'
  }
});

//make this component available to the app
export default Terms;
