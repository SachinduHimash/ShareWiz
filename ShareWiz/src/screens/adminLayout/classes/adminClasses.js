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
export default class AdminClasses extends Component {
  constructor(props) {
    super(props);
    this.getClasses();
    this.state = {
      classList: [],
    };
  }
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
  };

  nameValidator() {
    if (this.state.name === '') {
      this.setState({
        nameError: 'Your first name is required',
      });
    }
  }
  teacherNameValidator() {
    if (this.state.lastName === '') {
      this.setState({
        teacherNameError: 'Teacher name is required',
      });
    }
  }
  gradeValidator() {
    if (this.state.grade === '') {
      this.setState({
        gradeError: 'Grade is required',
      });
    }
  }
  classIDValidator() {
    if (this.state.classID === '') {
      this.setState({
        classIDError: 'Class ID is a must',
      });
    }
  }

  state = {
    dialogVisible: false,
    dialogVisible2: false,
    name: '',
    teacherName: '',
    grade: '',
    classID: '',
    nameError: '',
    teacherNameError: '',
    gradeError: '',
    classIDError: '',
    updatingID: '',
  };
  openDialog() {
    this.setState({dialogVisible: true});
    console.log('dialog');
  }
  addClass() {
    this.nameValidator();
    this.teacherNameValidator();
    this.gradeValidator();
    this.classIDValidator();
    if (
      this.state.name !== '' &&
      this.state.teacherName !== '' &&
      this.state.grade !== '' &&
      this.state.classID !== ''
    ) {
      firestore()
        .collection('classes')
        .doc(this.state.classID)
        .set({
          name: this.state.name,
          teacherName: this.state.teacherName,
          grade: this.state.grade,
          classID: this.state.classID,
        })
        .then(() => {
          this.getClasses();
          this.setState({name: ''});
          this.setState({teacherName: ''});
          this.setState({grade: ''});
          this.setState({classID: ''});

          this.setState({
            dialogVisible: false,
          });
        })
        .catch(error => console.log(error));
    }
  }
  deleteClass(userID) {
    firestore()
      .collection('classes')
      .doc(userID)
      .delete()
      .then(() => {
        console.log('Class deleted!');
        this.getClasses();
      })

      .catch(error => console.log(error));
  }
  updateClass() {
    this.nameValidator();
    this.teacherNameValidator();
    if (this.state.name !== '' && this.state.teacherName !== '') {
      firestore()
        .collection('classes')
        .doc(this.state.updatingID)
        .update({
          name: this.state.name,
          teacherName: this.state.teacherName,
        })

        .then(() => {
          this.setState({name: ''});
          this.setState({teacherName: ''});
          this.getClasses();
          this.setState({
            dialogVisible2: false,
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
            dialogStyle={{
              marginTop: -10,
              height: '90%',
            }}
            visible={this.state.dialogVisible}
            onTouchOutside={() =>
              this.setState({
                dialogVisible: false,
              })
            }>
            <ScrollView>
              <MaterialCommunityIcons
                style={{alignSelf: 'flex-end'}}
                name="close"
                color="#aa5ab4"
                size={26}
                onPress={() =>
                  this.setState({
                    dialogVisible: false,
                  })
                }
              />
              <Text
                style={{
                  alignSelf: 'center',
                  color: '#aa5ab4',
                  fontSize: 30,
                  fontWeight: '600',
                }}>
                Add a Class
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
                Class ID
              </Text>
              <View style={styles.text_input}>
                <TextInput
                  placeholder="Enter class ID"
                  placeholderTextColor="#aa5ab4"
                  onChangeText={classID => this.setState({classID})}
                  value={this.state.classID}
                  onBlur={() => this.classIDValidator()}
                />
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
                Class Name
              </Text>
              <View style={styles.text_input}>
                <TextInput
                  placeholder="Enter class name"
                  placeholderTextColor="#aa5ab4"
                  onChangeText={name => this.setState({name})}
                  value={this.state.name}
                  onBlur={() => this.nameValidator()}
                />
              </View>
              <View
                style={{
                  paddingLeft: '12%',
                  alignItems: 'flex-start',
                }}>
                <Text style={{color: 'red'}}>{this.state.nameError}</Text>
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
                Teacher Name
              </Text>
              <View style={styles.text_input}>
                <TextInput
                  placeholder="Enter teacher's  name"
                  placeholderTextColor="#aa5ab4"
                  onChangeText={teacherName => this.setState({teacherName})}
                  value={this.state.teacherName}
                  onBlur={() => this.teacherNameValidator()}
                />
              </View>
              <View
                style={{
                  paddingLeft: '12%',
                  alignItems: 'flex-start',
                }}>
                <Text style={{color: 'red'}}>
                  {this.state.teacherNameError}
                </Text>
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
                Grade
              </Text>
              <View style={styles.text_input}>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Enter the grade"
                  placeholderTextColor="#aa5ab4"
                  onChangeText={grade => this.setState({grade})}
                  value={this.state.grade}
                  onBlur={() => this.gradeValidator()}
                />
              </View>
              <View
                style={{
                  paddingLeft: '12%',
                  alignItems: 'flex-start',
                }}>
                <Text style={{color: 'red'}}>{this.state.gradeError}</Text>
              </View>

              <TouchableOpacity
                onPress={() => this.addClass()}
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
                    Add a Class
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </Dialog>
        </View>
        <View>
          <Dialog
            dialogStyle={{
              marginTop: -10,
              height: '70%',
            }}
            visible={this.state.dialogVisible2}
            onTouchOutside={() =>
              this.setState({
                dialogVisible2: false,
              })
            }>
            <ScrollView>
              <MaterialCommunityIcons
                style={{alignSelf: 'flex-end'}}
                name="close"
                color="#aa5ab4"
                size={26}
                onPress={() =>
                  this.setState({
                    dialogVisible2: false,
                  })
                }
              />
              <Text
                style={{
                  alignSelf: 'center',
                  color: '#aa5ab4',
                  fontSize: 30,
                  fontWeight: '600',
                }}>
                Update Class
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
                Class Name
              </Text>
              <View style={styles.text_input}>
                <TextInput
                  placeholder="Enter class name"
                  placeholderTextColor="#aa5ab4"
                  onChangeText={name => this.setState({name})}
                  value={this.state.name}
                  onBlur={() => this.nameValidator()}
                />
              </View>
              <View
                style={{
                  paddingLeft: '12%',
                  alignItems: 'flex-start',
                }}>
                <Text style={{color: 'red'}}>{this.state.nameError}</Text>
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
                Teacher Name
              </Text>
              <View style={styles.text_input}>
                <TextInput
                  placeholder="Enter teacher  name"
                  placeholderTextColor="#aa5ab4"
                  onChangeText={teacherName => this.setState({teacherName})}
                  value={this.state.teacherName}
                  onBlur={() => this.teacherNameValidator()}
                />
              </View>
              <View
                style={{
                  paddingLeft: '12%',
                  alignItems: 'flex-start',
                }}>
                <Text style={{color: 'red'}}>
                  {this.state.teacherNameError}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => this.updateClass()}
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
                    Update Class
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
              Add a Class
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
              data={this.state.classList}
              renderItem={({item}) => (
                <Fragment>
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
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#aa5ab4',
                      marginLeft: 25,
                      fontStyle: 'italic',
                    }}>
                    Class ID : {item.classID}
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
                          updatingID: item.classID,
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
                      onPress={() => this.deleteClass(item.classID)}
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
