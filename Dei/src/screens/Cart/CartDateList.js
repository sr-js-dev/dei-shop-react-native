import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import moment from 'moment';
import { DEIRegularText, DEIMediumText } from '../../components';

class CartDateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: [],
      selectedDateIndex: 0
    };
  }

  componentDidMount() {
    var todayDate = moment(new Date());
    var currentMonth = todayDate.format('MM');
    var year = todayDate.format('YYYY');
    var currentDate = new Date();
    //console.log('Today date', currentDate.getDate());
    var names = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var date = new Date(year, currentMonth - 1, 1);
    var finalDate = new Date();
    finalDate = moment(currentDate).add(31, 'days');

    var fromDate = new Date();
    fromDate = moment(currentDate).add(1, 'days');
    let result = this.getDates(fromDate.toDate(), finalDate.toDate());

    /*var result = [];
    while (date.getMonth() == currentMonth - 1) {
      //  result.push(date.getDate() + '-' + names[date.getDay()]);
      var dateVal = date.getDate(); // FRI, 29 Mar 2019
      var desc = moment(date).format('DD, ddd MMM YYYY');
      var cartformat = moment(date).format('YYYY-MM-DD');
      //console.log(desc);
      if (dateVal >= currentDate.getDate()) {
        result.push({
          date: date.getDate(),
          day: names[date.getDay()],
          desc: desc,
          cartformat: cartformat
        });
      }
      date.setDate(date.getDate() + 1);
    }
    // console.log(result);*/
    this.setState({ dates: result });
    this.props.action(result[0]);
  }

  getDates(startDate, stopDate) {
    var names = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      var desc = moment(currentDate).format('DD, ddd MMM YYYY');
      var cartformat = moment(currentDate).format('YYYY-MM-DD');
      var date = new Date(cartformat);

      dateArray.push({
        date: date.getDate(),
        day: names[date.getDay()],
        desc: desc,
        cartformat: cartformat
      });
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }

  textColor = index => {
    return index == this.state.selectedDateIndex ? '#FF8960' : '#D5D5D5';
  };

  dateClicked = index => {
    this.setState({ selectedDateIndex: index });
    this.props.action(this.state.dates[index]);
  };

  render() {
    return (
      <View>
        <View>
          <DEIRegularText
            title={'Select date & time'}
            style={styles.dateTextStyle}
          />

          <FlatList
            horizontal
            data={this.state.dates}
            extraData={this.state}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.desc}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => this.dateClicked(index)}>
                <View style={styles.dateViewStyle}>
                  <DEIMediumText
                    title={item.day.toUpperCase()}
                    style={{ color: this.textColor(index) }}
                  />
                  <DEIMediumText
                    title={item.date}
                    style={{ color: this.textColor(index), fontSize: 10 }}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dateViewStyle: {
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateTextStyle: {
    textAlign: 'center',
    marginTop: 10,
    color: '#B19CFD',
    marginBottom: 10
  }
});

export default CartDateList;
