import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  Button,
  Linking,
  Text,
  ScrollView
} from 'react-native';
import {b_img, logo} from './../../../images';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  b_img: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  logo: {
    marginTop: 10,
    width: 155,
    height: 55,
  },
  text_input: {
    marginTop: '90%',
    backgroundColor: '#e8d7f3',
    borderRadius: 20,
    width: '80%',
    height: '6%',
  },
  text_input2: {
    marginTop: '5%',
    backgroundColor: '#e8d7f3',
    borderRadius: 20,
    width: '80%',
    height: '6%',
  },
});

const Welcome = () => {
  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={b_img} style={styles.b_img}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.text_input}>
          <TextInput placeholder="E-mail" placeholderTextColor="#aa5ab4" />
        </View>
        <View style={styles.text_input2}>
          <TextInput placeholder="Password" placeholderTextColor="#aa5ab4" />
        </View>
        <Button color="#aa5ab4" raised title="Login" />
        <Text
          style={{color: '#aa5ab4'}}
          onPress={() => Linking.openURL('http://google.com')} >
          Don't you have an account?
        </Text>
      </ImageBackground>
    </ScrollView>
  );
};

export default Welcome;
