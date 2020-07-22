import React, {Component} from 'react';
import {Text} from 'react-native';


export default class ClassForums extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.navigation.state.params.classID);
  }
  render() {
    return <Text>Here are the forums</Text>;
  }
}
