/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
// eslint-disable-next-line no-unused-vars
import {createStackNavigator, createAppContainer} from 'react-navigation';
import DropDownPicker from 'react-native-dropdown-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// require('firebase/firestore');
import AwesomeAlert from 'react-native-awesome-alerts';

import {
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {signup_img} from './../../../images';
import LinearGradient from 'react-native-linear-gradient';

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
  text_input: {
    marginLeft: 25,
    paddingLeft: '4%',
    borderWidth: 0.5,
    borderColor: '#aa5ab4',
    borderRadius: 10,
    width: '85%',
    height: 40,
  },
  card: {
    borderRadius: 20,
    height: '70%',
    width: '90%',
    backgroundColor: 'white',
    flex: 1,
    alignSelf: 'center',
    marginTop: '5%',
    paddingVertical: '7%',
    borderWidth: 0.6,
    borderColor: '#aa5ab4',
    marginBottom: '5%',
  },
});

export default class SignUp extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: () => null,
    };
  };

  state = {
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleError: '',
    firstNameError: '',
    lastNameError: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
    errorMessage: '',
  };

  roleValidator() {
    if (this.state.role === '') {
      this.setState({roleError: 'This field is required'});
    }
  }
  firstNameValidator() {
    if (this.state.firstName === '') {
      this.setState({firstNameError: 'Your first name is required'});
    }
  }
  lastNameValidator() {
    if (this.state.lastName === '') {
      this.setState({lastNameError: 'Your last name is required'});
    }
  }
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
  confirmPasswordValidator() {
    if (this.state.confirmPassword === '') {
      this.setState({confirmPasswordError: 'Password is required'});
    } else if (this.state.confirmPassword !== this.state.password) {
      this.setState({confirmPasswordError: "Passwords doesn't match"});
    } else {
      this.setState({passwordError: ''});
    }
  }
  submit() {
    this.roleValidator();
    this.firstNameValidator();
    this.lastNameValidator();
    this.emailValidator();
    this.passwordValidator();
    this.confirmPasswordValidator();
    if (
      this.state.role !== '' &&
      this.state.firstName !== '' &&
      this.state.lastName !== '' &&
      this.state.email !== '' &&
      this.state.password !== ''
    ) {
      auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(data => {
          console.log(JSON.stringify(data, null, 2));

          firestore()
            .collection('users')
            .doc(data.user.uid)
            .set({
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              email: this.state.email,
              role: this.state.role,
              active: true,
            })
            .then(snapshot => {
              if (this.state.role.value === 'student') {
                firestore()
                  .collection('students')
                  .doc(data.user.uid)
                  .set({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                  })
                  .then(() => {
                    this.props.navigation.navigate('Welcome');
                  })
                  .catch(error => console.log(error));
              }
              if (this.state.role.value === 'teacher') {
                firestore()
                  .collection('teachers')
                  .doc(data.user.uid)
                  .set({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                  })
                  .then(() => {
                    this.props.navigation.navigate('Welcome');
                  })
                  .catch(error => console.log(error));
              }
            })

            .catch(error => console.log(error));
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }

          console.error(error);
        });
    }
  }
  render() {
    return (
      <ImageBackground source={signup_img} style={styles.signup_img}>
        <ScrollView style={styles.container}>
          <Text style={styles.caption}>Create An Account</Text>
          <View style={styles.card}>
            <Text
              style={{
                marginBottom: 2,
                color: '#aa5ab4',
                marginLeft: 25,
                fontWeight: 'bold',
                fontSize: 17,
              }}>
              I am?
            </Text>

            <DropDownPicker
              style={{
                marginLeft: 25,
                paddingLeft: '4%',
                borderWidth: 0.5,
                borderColor: '#aa5ab4',

                borderRadius: 10,
                width: '85%',
                height: 40,
              }}
              items={[
                {label: 'A Student', value: 'student'},
                {label: 'A Teacher', value: 'teacher'},
              ]}
              defaultNull
              placeholder="Select from here"
              placeholderStyle={{color: '#aa5ab4'}}
              containerStyle={{height: 40, flex: 1}}
              dropDownStyle={{
                width: '85%',
                alignItems: 'center',
                marginLeft: 25,
              }}
              labelStyle={{color: '#aa5ab4'}}
              onChangeItem={role => this.setState({role})}
              value={this.state.role}
            />
            <View style={{paddingLeft: '12%', alignItems: 'flex-start'}}>
              <Text style={{color: 'red'}}>{this.state.roleError}</Text>
            </View>
            <Text
              style={{
                marginTop: 10,
                marginBottom: 2,
                color: '#aa5ab4',
                marginLeft: 25,
                fontWeight: 'bold',
                fontSize: 17,
              }}>
              First Name
            </Text>
            <View style={styles.text_input}>
              <TextInput
                placeholder="Enter your first name"
                placeholderTextColor="#aa5ab4"
                onChangeText={firstName => this.setState({firstName})}
                value={this.state.firstName}
                onBlur={() => this.firstNameValidator()}
              />
            </View>
            <View style={{paddingLeft: '12%', alignItems: 'flex-start'}}>
              <Text style={{color: 'red'}}>{this.state.firstNameError}</Text>
            </View>
            <Text
              style={{
                marginTop: 5,
                marginBottom: 2,
                color: '#aa5ab4',
                marginLeft: 25,
                fontWeight: 'bold',
                fontSize: 17,
              }}>
              Last Name
            </Text>
            <View style={styles.text_input}>
              <TextInput
                placeholder="Enter your last name"
                placeholderTextColor="#aa5ab4"
                onChangeText={lastName => this.setState({lastName})}
                value={this.state.lastName}
                onBlur={() => this.lastNameValidator()}
              />
            </View>
            <View style={{paddingLeft: '12%', alignItems: 'flex-start'}}>
              <Text style={{color: 'red'}}>{this.state.lastNameError}</Text>
            </View>
            <Text
              style={{
                marginTop: 5,
                marginBottom: 2,
                color: '#aa5ab4',
                marginLeft: 25,
                fontWeight: 'bold',
                fontSize: 17,
              }}>
              E-mail
            </Text>
            <View style={styles.text_input}>
              <TextInput
                keyboardType="email-address"
                autoCapitalize="none"
                autoCompleteType="email"
                placeholder="Enter your E-mail"
                placeholderTextColor="#aa5ab4"
                onChangeText={email => this.setState({email})}
                value={this.state.email}
                onBlur={() => this.emailValidator()}
              />
            </View>
            <View style={{paddingLeft: '12%', alignItems: 'flex-start'}}>
              <Text style={{color: 'red'}}>{this.state.emailError}</Text>
            </View>
            <Text
              style={{
                marginTop: 5,
                marginBottom: 2,
                color: '#aa5ab4',
                marginLeft: 25,
                fontWeight: 'bold',
                fontSize: 17,
              }}>
              Password
            </Text>
            <View style={styles.text_input}>
              <TextInput
                secureTextEntry={true}
                autoCapitalize="none"
                autoCompleteType="password"
                placeholder="Enter your password"
                placeholderTextColor="#aa5ab4"
                onChangeText={password => this.setState({password})}
                value={this.state.password}
                onBlur={() => this.passwordValidator()}
              />
            </View>
            <View style={{paddingLeft: '12%', alignItems: 'flex-start'}}>
              <Text style={{color: 'red'}}>{this.state.passwordError}</Text>
            </View>
            <Text
              style={{
                marginTop: 5,
                marginBottom: 2,
                color: '#aa5ab4',
                marginLeft: 25,
                fontWeight: 'bold',
                fontSize: 17,
              }}>
              Confirm password
            </Text>
            <View style={styles.text_input}>
              <TextInput
                secureTextEntry={true}
                autoCapitalize="none"
                autoCompleteType="password"
                placeholder="Confirm your password"
                placeholderTextColor="#aa5ab4"
                onChangeText={confirmPassword =>
                  this.setState({confirmPassword})
                }
                value={this.state.confirmPassword}
                onBlur={() => this.confirmPasswordValidator()}
              />
            </View>
            <View style={{paddingLeft: '12%', alignItems: 'flex-start'}}>
              <Text style={{color: 'red'}}>
                {this.state.confirmPasswordError}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.submit()}
              style={{
                height: '6.5%',
                width: '25%',
                marginTop: '5%',

                borderRadius: 10,

                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <LinearGradient
                style={{
                  height: '100%',
                  width: '100%',

                  marginTop: '3%',
                  color: '#aa5ab4',
                  borderRadius: 10,

                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                colors={['#aa5ab4', '#873991']}>
                <Text
                  style={{
                    color: 'white',
                  }}>
                  Sign Up
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}
