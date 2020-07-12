/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {propic} from './../../../images';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-picker';
import {imagePickerOptions, uploadFileToFireBase} from '../../utils/index';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import * as firebase from 'firebase';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  avatar: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 20,
    height: '70%',
    width: '90%',
    backgroundColor: 'white',
    flex: 1,
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderWidth: 0.6,
    borderColor: '#aa5ab4',
    marginBottom: '5%',
  },
  text_input: {
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderColor: '#aa5ab4',
    borderRadius: 10,
    width: '85%',
    height: 40,
  },
});
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.getUserDetails();
  }

  state = {
    userEmail: '',
    userID: '',
    userFirstName: '',
    userLastName: '',
    password: '',
    passwordError: '',
    confirmPassword: '',
    confirmPasswordError: '',
    currentPassword: '',
    currentPasswordError: '',
  };

  getUserDetails() {
    const user = auth().currentUser;
    if (user) {
      console.log(user);

      firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(documentSnapShot => {
          this.setState({
            userFirstName: documentSnapShot.data().firstName,
          });
          this.setState({
            userLastName: documentSnapShot.data().lastName,
          });
          this.setState({
            userEmail: documentSnapShot.data().email,
          });
        });
    }
  }
  currentPasswordValidator() {
    if (this.state.currentPassword === '') {
      this.setState({
        currentPasswordError: 'Password is required',
      });
    } else if (this.state.currentPassword.length < 8) {
      this.setState({
        currentPasswordError: 'Password must be more than 8 characters',
      });
    } else {
      this.setState({currentPasswordError: ''});
    }
  }
  passwordValidator() {
    if (this.state.password === '') {
      this.setState({
        passwordError: 'Password is required',
      });
    } else if (this.state.password.length < 8) {
      this.setState({
        passwordError: 'Password must be more than 8 characters',
      });
    } else {
      this.setState({passwordError: ''});
    }
  }
  confirmPasswordValidator() {
    if (this.state.confirmPassword === '') {
      this.setState({
        confirmPasswordError: 'Password is required',
      });
    } else if (this.state.confirmPassword !== this.state.password) {
      this.setState({
        confirmPasswordError: "Passwords doesn't match",
      });
    } else {
      this.setState({passwordError: ''});
    }
  }

  uploadFile = () => {
    ImagePicker.launchImageLibrary(imagePickerOptions, response => {
      if (response.didCancel) {
      } else {
        setImageURI({uri: response.uri});

        console.log(
          'My file storage reference is: ',
          createStorageReferenceToFile(response),
        );
        // Add this
        Promise.resolve(uploadFileToFireBase(response));
      }
    });
  };
  reauthenticate(currentPassword) {
    console.log("ggggggggggggggggggggggggg");
    var user = auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    console.log('ggggggggggggggggggggggggg');
    return user.reauthenticateWithCredential(cred);
  }

  async changePassword() {
    this.passwordValidator();
    this.currentPasswordValidator();
    this.confirmPasswordValidator();
    if (
      this.state.password !== '' &&
      this.state.currentPassword !== '' &&
      this.state.confirmPassword !== ''
    ) {
      await this.reauthenticate(this.state.currentPassword)
        .then(() => {
          console.log('ggggggggggggggggggggggggg');
          var user = auth().currentUser;
          user
            .updatePassword(this.state.password)
            .then(() => {
              console.log('Password updated!');
            })
            .catch(error => {
              console.log(error);
              alert(error);
            });
        })
        .catch(error => {
          alert(error);
        });
    }
  }

  async signOut() {
    await auth().signOut();
    this.props.navigation.navigate('Welcome');
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View
          style={{
            alignItems: 'center',
            paddingTop: 15,
          }}>
          <Avatar
            avatarStyle={styles.avatar}
            source={propic}
            size="xlarge"
            rounded
            showEditButton
            onPress={() => console.log('Works!')}
            activeOpacity={0.7}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 30,
              fontWeight: '600',
              marginTop: 10,
            }}>
            {this.state.userFirstName} {this.state.userLastName}
          </Text>
          <Text
            style={{
              color: '#aa5ab4',
              fontStyle: 'italic',
              fontSize: 15,
            }}>
            {this.state.userEmail}
          </Text>
          <TouchableOpacity
            onPress={() => this.signOut()}
            style={{
              height: 40,
              width: 125,
              marginTop: '5%',
              marginBottom: '5%',
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
                Sign Out
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontSize: 25,
              color: '#aa5ab4',
              fontWeight: '600',
            }}>
            Change Password
          </Text>
          <Text
            style={{
              marginTop: 20,
              marginBottom: 2,
              color: '#aa5ab4',

              fontWeight: 'bold',
              fontSize: 17,
            }}>
            Current Password
          </Text>
          <View style={styles.text_input}>
            <TextInput
              secureTextEntry={true}
              autoCapitalize="none"
              autoCompleteType="password"
              placeholder="Enter your current password"
              placeholderTextColor="#aa5ab4"
              onChangeText={currentPassword =>
                this.setState({currentPassword})
              }
              value={this.state.currentPassword}
              onBlur={() => this.currentPasswordValidator()}
            />
          </View>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={{color: 'red'}}>
              {this.state.currentPasswordError}
            </Text>
          </View>
          <Text
            style={{
              marginTop: 5,
              marginBottom: 2,
              color: '#aa5ab4',

              fontWeight: 'bold',
              fontSize: 17,
            }}>
            New Password
          </Text>
          <View style={styles.text_input}>
            <TextInput
              secureTextEntry={true}
              autoCapitalize="none"
              autoCompleteType="password"
              placeholder="Enter your new password"
              placeholderTextColor="#aa5ab4"
              onChangeText={password => this.setState({password})}
              value={this.state.password}
              onBlur={() => this.passwordValidator()}
            />
          </View>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={{color: 'red'}}>{this.state.passwordError}</Text>
          </View>
          <Text
            style={{
              marginTop: 5,
              marginBottom: 2,
              color: '#aa5ab4',

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
              placeholder="Confirm your new password"
              placeholderTextColor="#aa5ab4"
              onChangeText={confirmPassword =>
                this.setState({confirmPassword})
              }
              value={this.state.confirmPassword}
              onBlur={() => this.confirmPasswordValidator()}
            />
          </View>
          <View style={{alignItems: 'flex-start'}}>
            <Text style={{color: 'red'}}>
              {this.state.confirmPasswordError}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => this.changePassword()}
            style={{
              height: 50,
              width: 150,
              marginTop: '5%',
              marginBottom: '5%',
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
                Change Password
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
