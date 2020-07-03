import React, {Component} from 'react';
import {Text} from 'react-native';

export default class ChooseClasses extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: () => null,
    };
  };
  render() {
    return <Text>Choose Classes</Text>;
  }
}
