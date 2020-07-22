import React, {Component} from 'react';
import {Text, Icon, View} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createStackNavigator, createAppContainer} from 'react-navigation';

import {NavigationContainer} from '@react-navigation/native';


import Profile from '../profile';
import ClassNavigation from '../class/classNavigation';



const Tab = createMaterialBottomTabNavigator();
export default class StudentLayout extends Component {
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
            name="Classes"
            component={ClassNavigation}
            options={{
              tabBarLabel: 'Classes',
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons name="domain" color={color} size={26} />
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
