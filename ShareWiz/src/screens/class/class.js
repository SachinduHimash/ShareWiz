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
    height: 150,
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
export default class ClassForums extends Component {
  constructor(props) {
    super(props);
    this.getAdmins();
    this.state = {
      adminList: [],
      classID: '',
      className: '',
      teacherID: '',
    };
    console.log(this.props.navigation.state.params.classID);
    var classID = this.props.navigation.state.params.classID;

    this.getClassDetails(classID);
  }
  getAdmins = async () => {
    var snapShotList = [];
    var snapShot = await firestore()
      .collection('admins')
      .get();
    snapShot.forEach(doc => {
      snapShotList.push(doc.data());
    });
    this.setState({adminList: snapShotList});
    console.log(this.state.adminList);
  };

  async getClassDetails(classID) {
    var className;
    var teacherID;
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
    this.setState({
      className: className,
      teacherID: teacherID,
      classID: classID,
    });
  }
  descriptionValidator() {
    if (this.state.description === '') {
      this.setState({
        descriptionError: 'The description is a must to create a post',
      });
    }
  }
  state = {
    dialogVisible: false,
    dialogVisible2: false,
    description: '',
    descriptionError: '',
  };

  openDialog() {
    this.setState({dialogVisible: true});
    console.log('dialog');
  }

  async createForum() {
    this.descriptionValidator();

    var currentUser = auth().currentUser;
    var creatorName;
    var refID;
    await firestore()
      .collection('users')
      .doc(currentUser.uid)
      .get()
      .then(data => {
        creatorName = data._data.firstName + ' ' + data._data.lastName;
      });

    var ref = await firestore()
      .collection('forums')
      .doc();
    refID = ref.id;
    await firestore()
      .collection('forums')
      .doc(refID)
      .set({
        description: this.state.description,
        teacherID: this.state.teacherID,
        creatorID: currentUser.uid,
        creatorName: creatorName,
        createdAt: new Date(),
        classID: this.state.classID,
        forumID: refID,
      });
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
                Create a Post
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
                Description
              </Text>
              <View style={styles.text_input}>
                <TextInput
                  placeholder="Enter the description of the post"
                  placeholderTextColor="#aa5ab4"
                  onChangeText={description => this.setState({description})}
                  value={this.state.description}
                  onBlur={() => this.descriptionValidator()}
                />
              </View>
              <View style={{paddingLeft: '12%', alignItems: 'flex-start'}}>
                <Text style={{color: 'red'}}>
                  {this.state.descriptionError}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => this.createForum()}
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
                    Create a Post
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </Dialog>
        </View>
        <Text
          style={{
            fontSize: 25,
            color: '#aa5ab4',
            marginTop: 10,
            alignSelf: 'center',
          }}>
          {this.state.className}
        </Text>
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
              Create a post
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.card2}>
            <FlatList
              data={this.state.adminList}
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
                      onPress={() => this.deleteAdmin(item.userID)}
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
