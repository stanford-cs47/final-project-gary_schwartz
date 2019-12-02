import * as firebase from 'firebase';
import 'firebase/firebase-firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAv5kW6XEq5lEUvA9TFnljVHCgxlfaGsKg",
  authDomain: "cs47-73230.firebaseapp.com",
  databaseURL: "https://cs47-73230.firebaseio.com",
  projectId: "cs47-73230",
  storageBucket: "cs47-73230.appspot.com",
  messagingSenderId: "224289708388",
  appId: "1:224289708388:web:869c6d8ba1b74282840271"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();

export default firestore;