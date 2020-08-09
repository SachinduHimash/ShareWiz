import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Image,
  PermissionsAndroid,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import {AsyncStorage} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#aa5ab4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#aa5ab4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center',
  },
  progressBarContainer: {
    marginTop: 20,
  },
  imageBox: {
    width: 300,
    height: 300,
  },
});

export default function PdfUploadScreen() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  var pdfUri;

  const selectPdf = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );
    //   const source = res.uri;
    //   await setImage(res.uri);
      pdfUri = res.uri;
      console.log(pdfUri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };
  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Files Permission',
          message:
            'App needs access to your files ' +
            'so you can run face detection.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('We can now read files');
      } else {
        console.log('File read permission denied');
      }
      return granted;
    } catch (err) {
      console.warn(err);
    }
  };

  const uploadPdf = async () => {
    var ref;
    //const data = await RNFS.readFile(pdfUri, 'base64');
    //await ref.putString(data, 'base64');
    
    // console.log(image);
    var stat = await RNFetchBlob.fs.stat(pdfUri);
    console.log('hey', stat);
    const uri = stat.path;
    console.log(uri);
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage()
      .ref(filename)
      .putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });
    try {
      await task;
    } catch (e) {
      console.log(e);
    }
    setUploading(false);
    Alert.alert('Pdf uploaded!', 'Your Pdf has been uploaded to the post!');
    setImage(null);
    let storedObject = {};
    storedObject.imageLink = filename;
    storedObject.isAvailable = true;
    try {
      await AsyncStorage.setItem('ImageLink', JSON.stringify(storedObject));
    } catch (error) {
      console.log("Couldn't send link");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.selectButton} onPress={selectPdf}>
        <Text style={styles.buttonText}>Pick an pdf</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {image !== null ? (
          <Image source={{uri: image.uri}} style={styles.imageBox} />
        ) : null}
        {uploading ? (
          <View style={styles.progressBarContainer}>
            <Progress.Bar progress={transferred} width={300} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={async () => {
              const permission = await requestPermission();
              if (permission === PermissionsAndroid.RESULTS.GRANTED) {
                uploadPdf();
              }
            }}>
            <Text style={styles.buttonText}>Upload pdf</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
