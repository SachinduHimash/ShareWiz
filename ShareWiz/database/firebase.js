import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCXa39tNCBvi_6eT140z8NF2WvIgisQ90s',
  authDomain: 'sharewiz-680d0.firebaseapp.com',
  databaseURL: 'https://sharewiz-680d0.firebaseio.com',
  projectId: 'sharewiz-680d0',
  storageBucket: 'sharewiz-680d0.appspot.com',
  messagingSenderId: '508826641846',
  appId: '1:508826641846:web:49d2d1e34a38b91509cd17',
  measurementId: 'G-4YLMEYBN4Z',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
