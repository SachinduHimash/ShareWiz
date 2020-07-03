import React from 'react';
import {View, Text} from 'react-native';
import Welcome from './screens/Welcome_page';
import SignUp from './screens/SignUp';

import 'react-native-gesture-handler';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import {NavigationContainer} from '@react-navigation/native';
import AdminLayout from './screens/adminLayout';
import ChooseClasses from './screens/chooseClasses';

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
const AppNavigator = createStackNavigator(
  {
    Welcome: {
      screen: Welcome,
    },
    SignUp: {
      screen: SignUp,
    },
    AdminLayout: {
      screen: AdminLayout,
    },
    ChooseClasses: {
      screen: ChooseClasses,
    },
  },
  {
    initialRouteName: 'Welcome',
  },
);

const AppContainer = createAppContainer(AppNavigator);
