/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import {Dialog} from 'react-native-simple-dialogs';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
});
export default class AdminStudents extends Component {
  render() {
    return <ScrollView style={styles.container} />;
  }
}
