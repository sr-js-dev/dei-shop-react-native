import React, { Component } from 'react';
import { View, Text, SectionList, TouchableOpacity } from 'react-native';
import { SectionGrid } from 'react-native-super-grid';
import { DEIBoldText, DEIRegularText, DEIMediumText } from '../../components';

class VariantView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      selectedIndex: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options != null) {
      // console.log(nextProps.options);
      this.state.options = nextProps.options;
    }
  }

  variantItemClicked = (section, item, index) => {
    //alert(item.variant_name);

    var optionList = this.state.options;
    for (let optionindex = 0; optionindex < optionList.length; optionindex++) {
      const sectionInfo = optionList[optionindex];
      if (sectionInfo.option_id == section.option_id) {
        for (
          let dataIndex = 0;
          dataIndex < sectionInfo.data.length;
          dataIndex++
        ) {
          const dataRow = sectionInfo.data[dataIndex];
          if (dataIndex == index) {
            dataRow.selected = true;
          } else {
            dataRow.selected = false;
          }
        }
      }
    }

    this.setState({ options: optionList });
    this.props.variantChanged(optionList);
  };

  render() {
    return (
      <View>
        <View style={{ backgroundColor: '#70707020', height: 1, margin: 20 }} />
        <SectionGrid
          style={{ marginHorizontal: 10 }}
          itemDimension={130}
          sections={this.state.options}
          renderItem={({ section, item, index }) => (
            <TouchableOpacity
              key={item.variant_id}
              onPress={() => this.variantItemClicked(section, item, index)}
              style={{
                backgroundColor: item.selected ? '#8CA2F8' : '#fff',
                minHeight: 30,
                borderColor: '#9393A7',
                borderWidth: item.selected ? 0 : 1,
                borderRadius: 15,
                justifyContent: 'center'
              }}
            >
              <DEIRegularText
                title={item.variant_name}
                style={{
                  color: item.selected ? '#fff' : '#9393A7',
                  fontSize: 14,
                  textAlign: 'center',
                  marginHorizontal: 10
                }}
              />
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section }) => (
            <DEIRegularText
              title={section.option_name}
              style={{ color: '#87879D', fontSize: 18, marginLeft: 10 }}
            />
          )}
        />
      </View>
    );
  }
}

export default VariantView;
