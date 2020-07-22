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
export default class ClassList extends Component {
  constructor(props) {
    super(props);
    this.getClasses();
    this.state = {
      classList: [],
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

  state = {};

  openDialog() {
    this.setState({dialogVisible: true});
    console.log('dialog');
  }
  sendToForum(classID) {
    this.props.navigation.navigate('ClassForums', {classID});
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
            Choose The Class
          </Text>

          <FlatList
            data={this.state.classList}
            renderItem={({item}) => (
              <Fragment>
                <TouchableOpacity
                  onPress={() => this.sendToForum(item.classID)}
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
