import firebase from 'firebase';
import 'firebase/storage';


const fire = firebase.initializeApp({
    apiKey: "AIzaSyBPxvXbR_O26M5mTi1ltG-qNKD0mBOFwrY",
    authDomain: "nbb---brasil-basquete.firebaseapp.com",
    projectId: "nbb---brasil-basquete",
    storageBucket: "nbb---brasil-basquete.appspot.com",
    messagingSenderId: "162191187340",
    appId: "1:162191187340:web:1704810ded85d87c9fcaa9",
    measurementId: "G-KLCQ017X13"
  });

export default fire;