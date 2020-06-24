import React, {Component} from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import {Formik} from 'formik';

import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  Button,
  Linking,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {signup_img} from './../../../images';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  signup_img: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  caption: {
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: '10%',
    marginLeft: '7%',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
  },
});

export default class SignUp extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: () => null,
    };
  };
  render() {
    return (
      <ImageBackground source={signup_img} style={styles.signup_img}>
        <ScrollView style={styles.container}>
          <Text style={styles.caption}>Create An Account</Text>

        </ScrollView>
      </ImageBackground>
    );
  }
}
