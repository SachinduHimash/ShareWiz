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
    marginBottom: 10,
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
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 3,
    borderWidth: 0.6,
    borderColor: '#aa5ab4',
    alignItems: 'flex-start',
  },
  card3: {
    borderRadius: 20,
    height: '70%',
    width: '100%',
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
export default class TeacherStudent extends Component {
  constructor(props) {
    super(props);
    this.getClasses();
    this.state = {
      classList: [],
      studentList: [],
    };
  }
  getClasses = async () => {
    var currentUser = auth().currentUser;

    var snapShotList = [];
    var setList = [];
    var snapShot;
    snapShot = await firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('classes')
      .get();

    snapShot.forEach(doc => {
      snapShotList.push(doc.data());
    });

    this.setState({classList: snapShotList});

    console.log(this.state.classList);
  };

  state = {
    dialogVisible: false,
    className: '',
    classID: '',
  };

  async openStudentList(classID, className) {
    this.setState({className: className, classID: classID});
    var currentUser = auth().currentUser;
    var setList = [];
    var data;
    data = await firestore()
      .collection('classes')
      .doc(classID)
      .collection('studentList')
      .get();

    data.forEach(doc => {
      setList.push(doc.data());
    });

    this.setState({studentList: setList});

    console.log(this.state.studentList);
    this.setState({dialogVisible: true});
  }

  async deleteStudent(userID) {
    await firestore()
      .collection('classes')
      .doc(this.state.classID)
      .collection('studentList')
      .doc(userID)
      .delete()
      .then(() => {
        firestore()
          .collection('users')
          .doc(userID)
          .collection('classes')
          .doc(this.state.classID)
          .delete();
      });
    this.setState({dialogVisible: false});
  }

  render() {
    return (
      <ScrollView style={styles.container}>
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
            <Text style={{fontSize: 25, color: '#aa5ab4'}}>
              {this.state.className}
            </Text>
            <View style={styles.card3}>
              <View style={styles.text_input}>
                <TextInput
                  placeholder="Search for a student"
                  placeholderTextColor="#aa5ab4"
                  onChangeText={confirmPassword =>
                    this.setState({confirmPassword})
                  }
                  value={this.state.confirmPassword}
                  onBlur={() => this.confirmPasswordValidator()}
                />
              </View>

              <FlatList
                data={this.state.studentList}
                renderItem={({item}) => (
                  <Fragment>
                    <View style={styles.card2}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: '#aa5ab4',
                          marginLeft: 10,
                        }}>
                        {item.userName}
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                        }}>
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
                    </View>
                  </Fragment>
                )}
              />
            </View>
          </ScrollView>
        </Dialog>

        <View style={styles.card}>
          <Text
            style={{
              color: '#aa5ab4',
              marginLeft: 20,
              fontSize: 25,
              marginBottom: 10,
            }}>
            Choose The Class
          </Text>

          <FlatList
            data={this.state.classList}
            renderItem={({item}) => (
              <Fragment>
                <TouchableOpacity
                  onPress={() =>
                    this.openStudentList(item.classID, item.className)
                  }
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
                      {item.className}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Fragment>
            )}
          />
        </View>
      </ScrollView>
    );
  }
}
