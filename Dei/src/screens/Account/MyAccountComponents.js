import React, { Component } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { DEIMediumText, SgProfilePic, DEIRegularText } from '../../components';

const AccountItemView = ({ title, details, isDisclosure = false, action }) => {

  
  return (
    <TouchableOpacity
      onPress={() => (isDisclosure ? action(title) : {})}
      style={styles.viewStyle}
    >
      <DEIMediumText title={title} style={{ color: '#262628', fontSize: 14 }} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <DEIMediumText
          title={details}
          style={{
            color: '#B19CFD',
            fontSize: 14,
            textAlign: 'right',
            marginRight: 20,
            justifyContent: 'center'
          }}
        />
        {isDisclosure == true && (
          <Image
            source={require('../../assets/Signup/ic_disclosure.png')}
            style={{ width: 6, height: 12 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    height: 50
  }
});
export { AccountItemView };
