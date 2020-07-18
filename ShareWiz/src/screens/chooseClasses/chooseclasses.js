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
    };
  }
  state = {};

  getClasses = async () => {
    var snapShotList = [];
    var enableList = [];
    var snapShot = await firestore()
      .collection('classes')
      .get();
    snapShot.forEach(doc => {
      snapShotList.push(doc.data());
    });
    this.setState({classList: snapShotList});
    console.log(this.state.classList);
  };

  ChooseClass(classID) {}

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
                    </View>
                  </View>
                </Fragment>
              )}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}
