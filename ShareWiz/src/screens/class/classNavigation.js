import React, {Component} from 'react';
import {Text} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import {NavigationContainer} from '@react-navigation/native';
import ClassList from './classList';
import ClassForums from './class';



export default class ClassNavigation extends Component {
  render() {
    return <AppContainer />;
  }
}
const AppNavigator = createStackNavigator(
  {
    ClassList: {
      screen: ClassList,
    },
    ClassForums: {
      screen: ClassForums,
    },
  },
  {
    initialRouteName: 'ClassList',
  },
);

const AppContainer = createAppContainer(AppNavigator);
