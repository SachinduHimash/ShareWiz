'use strict';
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import ValidationComponent from 'react-native-form-validator';
import {YellowBox} from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {b_img, logo} from './../../../images';
// eslint-disable-next-line no-unused-vars
import {createStackNavigator, createAppContainer} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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
    width: '100%',
    height: '100%',
  },
  logo: {
    alignSelf: 'center',
    marginTop: 10,
    width: 155,
    height: 55,
  },
  text_input: {
    alignSelf: 'center',
    paddingLeft: '7%',
    marginTop: '90%',
    borderWidth: 0.6,
    borderColor: '#aa5ab4',
    borderRadius: 10,
    width: '80%',
    height: '6%',
  },
  text_input2: {
    alignSelf: 'center',
    paddingLeft: '7%',
    marginTop: 4,
    borderWidth: 0.6,
    borderColor: '#aa5ab4',
    borderRadius: 10,
    width: '80%',
    height: '6%',
  },
});

export default class Welcome extends ValidationComponent {
  static navigationOptions = ({navigation}) => {
    return {
      header: () => null,
    };
  };

  state = {
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
  };

  emailValidator() {
    let rjx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = rjx.test(this.state.email);

    if (this.state.email === '') {
      this.setState({emailError: 'E-mail is required'});
    } else if (isValid === false) {
      this.setState({emailError: 'E-mail is not valid'});
    } else {
      this.setState({emailError: ''});
    }
  }
  passwordValidator() {
    if (this.state.password === '') {
      this.setState({passwordError: 'Password is required'});
    } else if (this.state.password.length < 8) {
      this.setState({passwordError: 'Password must be more than 8 characters'});
    } else {
      this.setState({passwordError: ''});
    }
  }

  login() {
    this.emailValidator();
    this.passwordValidator();
    if (this.state.email !== '' && this.state.password !== '') {
      auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(data => {
          firestore()
            .collection('users')
            .doc(data.user.uid)
            .get()
            .then(documentSnapshot => {
              if (documentSnapshot.data().active === true) {
                if (documentSnapshot.data().role === 'admin') {
                  this.props.navigation.navigate('AdminLayout');
                } else {
                  this.props.navigation.navigate('ChooseClasses');
                }
              } else {
                alert('Your account has been banned by the admin');
              }
            });
        })

        .catch(error => {
          // eslint-disable-next-line no-alert
          alert(error);
        });
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <ImageBackground source={b_img} style={styles.b_img}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.text_input}>
            <TextInput
              keyboardType="email-address"
              autoCapitalize="none"
              autoCompleteType="email"
              placeholder="E-mail"
              placeholderTextColor="#aa5ab4"
              onChangeText={email => this.setState({email})}
              value={this.state.email}
              onBlur={() => this.emailValidator()}
            />
          </View>
          <View style={{paddingLeft: '18%', alignItems: 'flex-start'}}>
            <Text style={{color: 'red'}}>{this.state.emailError}</Text>
          </View>
          <View style={styles.text_input2}>
            <TextInput
              secureTextEntry={true}
              autoCapitalize="none"
              autoCompleteType="password"
              placeholder="Password"
              placeholderTextColor="#aa5ab4"
              onChangeText={password => this.setState({password})}
              value={this.state.password}
              onBlur={() => this.passwordValidator()}
            />
          </View>
          <View style={{paddingLeft: '18%', alignItems: 'flex-start'}}>
            <Text style={{color: 'red'}}>{this.state.passwordError}</Text>
          </View>
          <TouchableOpacity
            onPress={() => this.login()}
            style={{
              height: '6.5%',
              width: '25%',
              marginTop: 3,
              color: '#aa5ab4',
              borderRadius: 10,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LinearGradient
              style={{
                height: '100%',
                width: '100%',

                color: '#aa5ab4',
                borderRadius: 10,

                justifyContent: 'center',
                alignItems: 'center',
              }}
              colors={['#aa5ab4', '#873991']}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 17,
                }}>
                Login
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text>{this.getErrorMessages()}</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SignUp')}
            style={{alignSelf: 'center'}}>
            <Text
              style={{
                color: '#aa5ab4',
                marginTop: 2,
              }}>
              Don't you have an account?
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </ScrollView>
    );
  }
}
