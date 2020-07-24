/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Fragment} from 'react';
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
  FlatList,
} from 'react-native';
import {signup_img} from './../../../images';
import LinearGradient from 'react-native-linear-gradient';
import {add} from 'react-native-reanimated';

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
    paddingVertical: 10,
    borderWidth: 0.6,
    borderColor: '#aa5ab4',
    marginBottom: '5%',
  },
  card2: {
    borderRadius: 20,
    height: '50%',
    width: '90%',
    backgroundColor: 'white',
    flex: 1,
    alignSelf: 'center',
    marginTop: 7,
    paddingVertical: 10,
    paddingHorizontal: 3,
    borderWidth: 0.6,
    borderColor: '#aa5ab4',
  },
});

const enableList = [];
export default class ChooseClasses extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: () => null,
    };
  };
  constructor(props) {
    super(props);
    this.getClasses();
    this.state = {
      classList: [],
      isFirstTime: true,
    };
  }
  state = {};

  getClasses = async () => {
    var snapShotList = [];

    var snapShot = await firestore()
      .collection('classes')
      .get();
    snapShot.forEach(doc => {
      snapShotList.push(doc.data());
    });
    this.setState({classList: snapShotList});
    console.log(this.state.classList);
    if (this.state.isFirstTime) {
      snapShotList.forEach(item => {
        enableList[item.classID] = false;
      });
      this.setState({isFirstTime: false});
    }
  };

  async sendTeacherNotification(classID) {
    var currentUser = auth().currentUser;
    var userName;
    var teacherID;
    var className;

    await firestore()
      .collection('classes')
      .doc(classID)
      .get()
      .then(querySnapshot => {
        console.log(querySnapshot);
        className =
          'Grade ' + querySnapshot._data.grade + ' ' + querySnapshot._data.name;
        teacherID = querySnapshot._data.teacherID;
      });

    await firestore()
      .collection('users')
      .doc(currentUser.uid)
      .get()
      .then(snapShot => {
        userName = snapShot._data.firstName + ' ' + snapShot._data.lastName;
      });
    await firestore()
      .collection('notifications')
      .doc()
      .set({
        to: teacherID,
        message: userName + ' has been added to your ' + className,
        createdAt: new Date(),
      });
  }

  async chooseClass(classID) {
    var currentUser = auth().currentUser;
    var userID = currentUser.uid;
    var userName;
    var className;

    await firestore()
      .collection('users')
      .doc(currentUser.uid)
      .get()
      .then(snapShot => {
        userName = snapShot._data.firstName + ' ' + snapShot._data.lastName;
      });
    await firestore()
      .collection('classes')
      .doc(classID)
      .get()
      .then(querySnapshot => {
        console.log(querySnapshot);
        className =
          'Grade ' + querySnapshot._data.grade + ' ' + querySnapshot._data.name;
      });
    await firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('classes')
      .doc(classID)
      .set({
        classID,
        className,
      })
      .then(() => {
        firestore()
          .collection('classes')
          .doc(classID)
          .collection('studentList')
          .doc(userID)
          .set({
            userID,
            userName,
          });
        enableList[classID] = true;
        this.sendTeacherNotification(classID);
        this.getClasses();
        console.log('mylist is ::::', enableList);
      })
      .catch(error => console.log(error));
  }
  submit() {
    var currentUser = auth().currentUser;
    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .update({
        isFirstTime: false,
      })
      .then(() => {
        Alert.alert('Success', 'Please upload your profile picture');
        this.props.navigation.navigate('StudentLayout');
      });
  }

  render() {
    return (
      <ImageBackground source={signup_img} style={styles.signup_img}>
        <ScrollView style={styles.container}>
          <Text style={styles.caption}>Choose your classes</Text>
          <View style={styles.card}>
            <FlatList
              data={this.state.classList}
              renderItem={({item}) => (
                <Fragment>
                  <View style={styles.card2}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: '#aa5ab4',
                        marginLeft: 25,
                      }}>
                      Grade {item.grade} {item.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#aa5ab4',
                        marginLeft: 25,
                        fontStyle: 'italic',
                      }}>
                      Conducted by : {item.teacherName}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                      }}>
                      {enableList[item.classID] === false && (
                        <TouchableOpacity
                          onPress={() => this.chooseClass(item.classID)}
                          style={{
                            height: 40,
                            width: '30%',
                            marginTop: 5,
                            marginBottom: 5,
                            borderRadius: 10,
                            marginLeft: 20,

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
                              Choose
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                      {enableList[item.classID] === true && (
                        <TouchableOpacity
                          disabled
                          style={{
                            height: 40,
                            width: '30%',
                            marginTop: 5,
                            marginBottom: 5,
                            borderRadius: 10,
                            marginLeft: 20,

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
                            colors={['#5c5c5c', '#383838']}>
                            <Text
                              style={{
                                color: 'white',
                              }}>
                              Choose
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Fragment>
              )}
            />
            <TouchableOpacity onPress={() => this.submit()}>
              <Text
                style={{
                  alignSelf: 'flex-end',
                  color: '#aa5ab4',
                  marginRight: 25,
                  fontSize: 23,
                  marginTop: 7,
                }}>
                Next ->
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}
