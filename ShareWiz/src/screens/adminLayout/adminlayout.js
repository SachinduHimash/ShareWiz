/* eslint-disable react-native/no-inline-styles */
import React, {Component, Fragment} from 'react';
import {Text, Icon, View} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createAppContainer, StackNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import {NavigationContainer} from '@react-navigation/native';
import AdminStudents from './students';
import AdminTeacher from './teacher';
import Admin from './admins';
import Notifications from '../notifications';
import Profile from '../profile';
import AdminClasses from './classes';
import Welcome from '../Welcome_page/welcome';

const Tab = createMaterialBottomTabNavigator();

export default class AdminLayout extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: () => null,
    };
  };
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Profile"
          activeColor="white"
          barStyle={{backgroundColor: '#aa5ab4'}}>
          <Tab.Screen
            name="Students"
            component={AdminStudents}
            options={{
              tabBarLabel: 'Students',
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons
                  name="account-group"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Teachers"
            component={AdminTeacher}
            options={{
              tabBarLabel: 'Teachers',
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons name="teach" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Admins"
            component={Admin}
            options={{
              tabBarLabel: 'Admins',
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons
                  name="account-plus"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Classes"
            component={AdminClasses}
            options={{
              tabBarLabel: 'Classes',
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons name="domain" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Notifications"
            component={Notifications}
            options={{
              tabBarLabel: 'Notifications',
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons name="bell" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons
                  name="account"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
