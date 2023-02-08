// Import the functions you need from the SDKs you need
//import * as firebase from "firebase
//import * as firebase from "firebase/app";
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// cada produto do firebase deve ser importad separadamente
//por exemplo auth de autenticação
import "firebase/compat/auth";

import "firebase/compat/firestore";
import "firebase/compat/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7wBZ2OpUuhjKjXUC2UT_FSh4H6AtWI5A",
    authDomain: "tcheemprega-3ccb8.firebaseapp.com",
    projectId: "tcheemprega-3ccb8",
    storageBucket: "tcheemprega-3ccb8.appspot.com",
    messagingSenderId: "1033975557497",
    appId: "1:1033975557497:web:3cf5d0b86fb7a2b0ac53a8"
  };
// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
export { auth, firestore, storage};