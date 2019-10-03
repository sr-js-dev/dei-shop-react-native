import React, { Component } from 'react';
import { View, Text, Modal } from 'react-native';
import SortModalView from './SortModalView';

class SortView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSort: 2,
      visible: this.props.visible
    };
  }

  sortItemclicked = option => {
    this.setState({
      visible: false,
      selectedSort: option
    });
    setTimeout(() => {
      this.props.action(option);
    }, 400);
  };

  render() {
    const options = [];
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={this.state.visible}
      >
        <SortModalView
          sortOption={this.state.selectedSort}
          sortBy={this.props.sortBy}
          onDismiss={option => this.sortItemclicked(option)}
        />
      </Modal>
    );
  }
}

export { SortView };
