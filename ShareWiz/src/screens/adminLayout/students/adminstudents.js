/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Fragment} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Dialog} from 'react-native-simple-dialogs';
import {Icon} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  text_input: {
    alignSelf: 'center',
    paddingLeft: '4%',
    borderWidth: 0.5,
    borderColor: '#aa5ab4',
    borderRadius: 10,
    width: '95%',
    height: 40,
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
    paddingHorizontal: 3,
    borderWidth: 0.6,
    borderColor: '#aa5ab4',
    marginBottom: '5%',
  },
  card2: {
    borderRadius: 20,
    height: '70%',
    width: '95%',
    backgroundColor: 'white',
    flex: 1,
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 3,
    borderWidth: 0.6,
    borderColor: '#aa5ab4',
    marginBottom: '5%',
  },
});
export default class AdminStudents extends Component {
  constructor(props) {
    super(props);
    this.getStudents();
    this.state = {
      studentList: [],
    };
  }
  getStudents = async () => {
    var snapShotList = [];
    var snapShot = await firestore()
      .collection('students')
      .get();
    snapShot.forEach(doc => {
      snapShotList.push(doc.data());
    });
    this.setState({studentList: snapShotList});
    console.log(this.state.studentList);
  };

  firstNameValidator() {
    if (this.state.firstName === '') {
      this.setState({
        firstNameError: 'Your first name is required',
      });
    }
  }
  lastNameValidator() {
    if (this.state.lastName === '') {
      this.setState({
        lastNameError: 'Your last name is required',
      });
    }
  }
  emailValidator() {
    let rjx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = rjx.test(this.state.email);

    if (this.state.email === '') {
      this.setState({
        emailError: 'E-mail is required',
      });
    } else if (isValid === false) {
      this.setState({
        emailError: 'E-mail is not valid',
      });
    } else {
      this.setState({emailError: ''});
    }
  }
  passwordValidator() {
    if (this.state.password === '' || this.state.password === null) {
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
  state = {
    dialogVisible: false,
    dialogVisible2: false,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstNameError: '',
    lastNameError: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
    role: '',
    updatingID: '',
  };
  openDialog() {
    this.setState({dialogVisible: true});
    console.log('dialog');
  }
  addStudent() {
    this.setState({role: 'teacher'});
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
              isFirstTime: true,
            })
            .then(() => {
              firestore()
                .collection('students')
                .doc(data.user.uid)
                .set({
                  firstName: this.state.firstName,
                  lastName: this.state.lastName,
                  email: this.state.email,
                  userID: data.user.uid,
                })
                .then(() => {
                  this.getStudents();
                  this.setState({firstName: ''});
                  this.setState({lastName: ''});
                  this.setState({email: ''});
                  this.setState({password: ''});
                  this.setState({confirmPassword: ''});
                  this.setState({dialogVisible: false});
                })
                .catch(error => console.log(error));
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
  deleteStudent(userID) {
    firestore()
      .collection('students')
      .doc(userID)
      .delete()
      .then(() => {
        console.log('Student deleted!');
        firestore()
          .collection('users')
          .doc(userID)
          .set({
            active: false,
          })
          .then(this.getStudents())
          .catch(error => console.log(error));
      })

      .catch(error => console.log(error));
  }
  updateStudent() {
    this.firstNameValidator();
    this.lastNameValidator();
    if (this.state.firstName !== '' && this.state.lastName !== '') {
      firestore()
        .collection('users')
        .doc(this.state.updatingID)
        .update({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
        })
        .then(() => {
          firestore()
            .collection('students')
            .doc(this.state.updatingID)
            .update({
              firstName: this.state.firstName,
              lastName: this.state.lastName,
            })
            .then(() => {
              this.setState({firstName: ''});
              this.setState({lastName: ''});
              this.getTeachers();
              this.setState({dialogVisible2: false});
            });
        })
        .catch(error => console.log(error));
    }
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View>
          <Dialog
            dialogStyle={{marginTop: -10, height: '90%'}}
            visible={this.state.dialogVisible}
            onTouchOutside={() => this.setState({dialogVisible: false})}>
            <ScrollView>
              <MaterialCommunityIcons
                style={{alignSelf: 'flex-end'}}
                name="close"
                color="#aa5ab4"
                size={26}
                onPress={() => this.setState({dialogVisible: false})}
              />
              <Text
                style={{
                  alignSelf: 'center',
                  color: '#aa5ab4',
                  fontSize: 30,
                  fontWeight: '600',
                }}>
                Add a student
              </Text>

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
                  placeholder="Enter student's first name"
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
                  placeholder="Enter student's last name"
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
                  placeholder="Enter student's E-mail"
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
                  placeholder="Enter default password"
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
                  placeholder="Confirm default password"
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
                onPress={() => this.addStudent()}
                style={{
                  height: 40,
                  width: '85%',
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
                    Add a Student
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </Dialog>
        </View>
        <View>
          <Dialog
            dialogStyle={{marginTop: -10, height: '70%'}}
            visible={this.state.dialogVisible2}
            onTouchOutside={() => this.setState({dialogVisible2: false})}>
            <ScrollView>
              <MaterialCommunityIcons
                style={{alignSelf: 'flex-end'}}
                name="close"
                color="#aa5ab4"
                size={26}
                onPress={() => this.setState({dialogVisible2: false})}
              />
              <Text
                style={{
                  alignSelf: 'center',
                  color: '#aa5ab4',
                  fontSize: 30,
                  fontWeight: '600',
                }}>
                Update Student
              </Text>

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
                  placeholder="Enter student first name"
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
                  placeholder="Enter student last name"
                  placeholderTextColor="#aa5ab4"
                  onChangeText={lastName => this.setState({lastName})}
                  value={this.state.lastName}
                  onBlur={() => this.lastNameValidator()}
                />
              </View>
              <View style={{paddingLeft: '12%', alignItems: 'flex-start'}}>
                <Text style={{color: 'red'}}>{this.state.lastNameError}</Text>
              </View>

              <TouchableOpacity
                onPress={() => this.updateStudent()}
                style={{
                  height: 40,
                  width: '85%',
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
                    Update Student
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </Dialog>
        </View>
        <TouchableOpacity
          onPress={() => this.openDialog()}
          style={{
            height: 40,
            width: '85%',
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
              Add a Student
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.text_input}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#aa5ab4"
              onChangeText={confirmPassword => this.setState({confirmPassword})}
              value={this.state.confirmPassword}
              onBlur={() => this.confirmPasswordValidator()}
            />
          </View>
          <View style={styles.card2}>
            <FlatList
              data={this.state.studentList}
              renderItem={({item}) => (
                <Fragment>
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#aa5ab4',
                      marginLeft: 25,
                    }}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#aa5ab4',
                      marginLeft: 25,
                      fontStyle: 'italic',
                    }}>
                    {item.email}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          dialogVisible2: true,
                          updatingID: item.userID,
                        })
                      }
                      style={{
                        height: 40,
                        width: '30%',
                        marginTop: 5,
                        marginBottom: '5%',
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
                          Update
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.deleteStudent(item.userID)}
                      style={{
                        height: 40,
                        width: '30%',
                        marginTop: 5,
                        marginBottom: '5%',
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
                        colors={['#c42b2b', '#942525']}>
                        <Text
                          style={{
                            color: 'white',
                          }}>
                          Delete
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </Fragment>
              )}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
