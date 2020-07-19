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
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 3,
    borderWidth: 0.6,
    borderColor: '#aa5ab4',
    alignItems: 'center',
    alignContent: 'center',
  },
});
export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.getNotifications();
    this.state = {
      snapShotList2: [],
      notificationList: [],
    };
  }
  getNotifications = async () => {
    var currentUser = auth().currentUser;
    var role;
    var snapShotList = [];
    var setList = [];

    await firestore()
      .collection('users')
      .doc(currentUser.uid)
      .get()
      .then(querySnapshot => {
        role = querySnapshot._data.role;
      });
    if (role === 'admin') {
      var snapShot = await firestore()
        .collection('notifications')
        .orderBy('createdAt', 'desc')
        .get();
      console.log(snapShot);
      snapShot.forEach(doc => {
        snapShotList.push(doc.data());
      });

      this.setState({snapShotList2: snapShotList});

      this.state.snapShotList2.forEach(item => {
        if (item.to === 'admin') {
          setList.push(item);
        }
      });
      this.setState({notificationList: setList});
      console.log(this.state.notificationList);
    }
  };

  state = {};
  openDialog() {
    this.setState({dialogVisible: true});
    console.log('dialog');
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text
            style={{
              color: '#aa5ab4',
              marginLeft: 20,
              fontSize: 25,
              marginBottom: 10,
            }}>
            Notifications
          </Text>

          <FlatList
            data={this.state.notificationList}
            renderItem={({item}) => (
              <Fragment>
                <View style={styles.card2}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#aa5ab4',
                      marginLeft: 10,
                    }}>
                    {item.message}
                  </Text>
                </View>
              </Fragment>
            )}
          />
        </View>
      </ScrollView>
    );
  }
}
