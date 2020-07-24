/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {useState} from 'react';
import {Fragment} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  FlatList,
  AsyncStorage,
  Image,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Dialog} from 'react-native-simple-dialogs';
import {Icon} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UploadScreen from './uploadScreen';
import storage from '@react-native-firebase/storage';

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
    marginBottom: 5,
  },
});

export default class ClassForums extends Component {
  constructor(props) {
    super(props);

    this.state = {
      snapShopList2: [],
      forumList: [],
      classID: '',
      className: '',
      teacherID: '',
      imageLink: '',
    };
    console.log(this.props.navigation.state.params.fileName);
    console.log(this.props.navigation.state.params.classID);
    var classID = this.props.navigation.state.params.classID;

    this.setObject();
    this.getClassDetails(classID);
    this.getForums(classID);
  }

  async setObject() {
    let storedObject = {};
    storedObject.imageLink = '';
    storedObject.isAvailable = false;
    try {
      await AsyncStorage.setItem('ImageLink', JSON.stringify(storedObject));
    } catch (error) {
      console.log("Couldn't set the object at constructor");
    }
  }

  getForums = async classID => {
    var snapShotList = [];
    var setList = [];
    var snapShot = await firestore()
      .collection('forums')
      .orderBy('createdAt', 'desc')
      .get();
    snapShot.forEach(doc => {
      snapShotList.push(doc._data);
    });

    this.setState({snapShopList2: snapShotList});

    this.state.snapShopList2.forEach(item => {
      if (item.classID === classID) {
        setList.push(item);
      }
    });
    this.setState({forumList: setList});
    console.log(this.state.forumList);
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
    imageLink: '',
  };

  openDialog() {
    this.setState({dialogVisible: true});
    console.log('dialog');
  }

  async createForum() {
    console.log('this is :', isAvailable);
    const infoValue = await AsyncStorage.getItem('ImageLink');
    let resObject = JSON.parse(infoValue);
    const imageLink = resObject.imageLink;
    const isAvailable = resObject.isAvailable;

    if (isAvailable === true) {
      console.log('aaaa');
      await AsyncStorage.removeItem('ImageLink');
      console.log(imageLink);
      var finalUrl;
      await storage()
        .ref(imageLink)
        .getDownloadURL()
        .then(url => {
          console.log(url);
          finalUrl = url;
        });
      this.descriptionValidator();
      if (this.state.description !== '') {
        console.log(this.props.navigation.state.params.fileName);
        var currentUser = auth().currentUser;
        var creatorName;
        var creatorPic;
        var refID;
        await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .get()
          .then(data => {
            creatorName = data._data.firstName + ' ' + data._data.lastName;
            creatorPic = data._data.profilePic;
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
            creatorPic: creatorPic,
            createdAt: new Date(),
            classID: this.state.classID,
            forumID: refID,
            likes: 0,
            imageLink: finalUrl,
            hasImage: true,
          });
        let storedObject = {};
        storedObject.imageLink = '';
        storedObject.isAvailable = false;
        try {
          await AsyncStorage.setItem('ImageLink', JSON.stringify(storedObject));
        } catch (error) {
          console.log("Couldn't set the link to false");
        }
        this.getForums(this.state.classID);
      }
    } else {
      console.log('aaaabbbb');

      this.descriptionValidator();
      if (this.state.description !== '') {
        console.log(this.props.navigation.state.params.fileName);
        var currentUser = auth().currentUser;
        var creatorName;
        var creatorPic;
        var refID;
        await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .get()
          .then(data => {
            creatorName = data._data.firstName + ' ' + data._data.lastName;
            creatorPic = data._data.profilePic;
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
            creatorPic: creatorPic,
            createdAt: new Date(),
            classID: this.state.classID,
            forumID: refID,
            likes: 0,
            hasImage: false,
          });

        this.getForums(this.state.classID);
      }
    }
    this.setState({
      dialogVisible: false,
    });
  }
  async deletePost(forumID) {
    var currentUserID = auth().currentUser.uid;
    await firestore()
      .collection('forums')
      .doc(forumID)
      .get()
      .then(data => {
        // eslint-disable-next-line prettier/prettier
                       if (
          data._data.creatorID === currentUserID ||
          data._data.teacherID === currentUserID
        ) {
          firestore()
            .collection('forums')
            .doc(forumID)
            .delete();
          this.getForums(this.state.classID);
        } else {
          // eslint-disable-next-line no-alert
          alert('You can only delete the posts you have created');
        }
      });
  }
  async likePost(forumID) {
    var postLikes;
    await firestore()
      .collection('forums')
      .doc(forumID)
      .get()
      .then(data => {
        postLikes = data._data.likes;
      });
    await firestore()
      .collection('forums')
      .doc(forumID)
      .update({
        likes: postLikes + 1,
      });
    this.getForums(this.state.classID);
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
              <View
                style={{
                  paddingLeft: '12%',
                  alignItems: 'flex-start',
                }}>
                <Text style={{color: 'red'}}>
                  {this.state.descriptionError}
                </Text>
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
                Image :
              </Text>
              <UploadScreen />
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
          <FlatList
            data={this.state.forumList}
            renderItem={({item}) => (
              <Fragment>
                <View style={styles.card2}>
                  <View
                    style={{
                      marginRight: 10,
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={{uri: item.creatorPic}}
                      style={{borderRadius: 40, height: 30, width: 30,marginLeft:17}}
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#aa5ab4',
                        marginLeft: 10,
                        fontWeight: 'bold',
                      }}>
                      {item.creatorName}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                      }}>
                      <MaterialCommunityIcons
                        style={{
                          alignSelf: 'flex-end',
                          marginRight: 13,
                          marginLeft: '30%',
                        }}
                        name="comment-outline"
                        color="#aa5ab4"
                        size={25}
                        onPress={() => this.likePost(item.forumID)}
                      />
                      <MaterialCommunityIcons
                        style={{
                          alignSelf: 'flex-end',
                          marginRight: 10,
                        }}
                        name="thumb-up-outline"
                        color="#aa5ab4"
                        size={25}
                        onPress={() => this.likePost(item.forumID)}
                      />
                      <MaterialCommunityIcons
                        style={{
                          alignSelf: 'flex-end',
                        }}
                        name="delete-outline"
                        color="#aa5ab4"
                        size={25}
                        onPress={() => this.deletePost(item.forumID)}
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 19,
                      color: '#aa5ab4',
                      marginLeft: 25,
                      marginBottom: 10,
                      marginTop: 10,
                    }}>
                    {item.description}
                  </Text>
                  {item.hasImage === true && (
                    <Image
                      style={{height: 200, width: 300, marginLeft: 25}}
                      source={{uri: item.imageLink}}
                    />
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 25,
                    }}>
                    <MaterialCommunityIcons
                      style={{
                        alignSelf: 'flex-end',
                        marginRight: 10,
                      }}
                      name="thumb-up-outline"
                      color="#aa5ab4"
                      size={15}
                      onPress={() =>
                        this.setState({
                          dialogVisible: false,
                        })
                      }
                    />
                    <Text style={{color: '#aa5ab4'}}>Likes : {item.likes}</Text>
                  </View>
                </View>
              </Fragment>
            )}
          />
        </View>
      </ScrollView>
    );
  }
}
