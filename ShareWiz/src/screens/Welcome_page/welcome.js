/* eslint-disable react-native/no-inline-styles */
import React from 'react';
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
import {b_img, logo} from './../../../images';
import {createStackNavigator, createAppContainer} from 'react-navigation';


const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  b_img: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  logo: {
    marginTop: 10,
    width: 155,
    height: 55,
  },
  text_input: {
    paddingLeft: '7%',
    marginTop: '90%',
    backgroundColor: '#e8d7f3',
    borderRadius: 20,
    width: '80%',
    height: '6%',
  },
  text_input2: {
    paddingLeft: '7%',
    marginTop: '5%',
    backgroundColor: '#e8d7f3',
    borderRadius: 20,
    width: '80%',
    height: '6%',
  },
});

export default class Welcome extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: () => null,
    };
  };
  render() {
    return (
      <ScrollView style={styles.container}>
        <ImageBackground source={b_img} style={styles.b_img}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.text_input}>
            <TextInput placeholder="E-mail" placeholderTextColor="#aa5ab4" />
          </View>
          <View style={styles.text_input2}>
            <TextInput placeholder="Password" placeholderTextColor="#aa5ab4" />
          </View>
          <TouchableOpacity
            style={{
              height: '6.5%',
              width: '25%',
              marginTop: '3%',
              color: '#aa5ab4',
              borderRadius: 20,
              backgroundColor: '#aa5ab4',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
              }}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SignUp')}>
            <Text style={{color: '#aa5ab4', marginTop: '4%'}}>
              Don't you have an account?
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </ScrollView>
    );
  }
}
