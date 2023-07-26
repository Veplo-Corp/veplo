// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  updateProfile,
  deleteUser
} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


// const firebaseConfig  =  {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STRORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
// } 


let firebaseConfig;



if (process.env.NODE_ENV === 'production') {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  firebaseConfig = {
    apiKey: "AIzaSyA0UyXbwg7IctHllndT7t4iR4gMUi699Bc",
    authDomain: "account.veplo.it",
    projectId: "veplo-clothes",
    storageBucket: "veplo-clothes.appspot.com",
    messagingSenderId: "133580758542",
    appId: "1:133580758542:web:a47b0eb6292d5fc9af265f",
    measurementId: "G-26QK67CY12"
  };
} else {
  firebaseConfig = {
    apiKey: 'AIzaSyDs607C9zpuZjhM9H9lA48QRkFX4nZwi9o',
    authDomain: "dintorni-dev.firebaseapp.com",
    projectId: "dintorni-dev",
    storageBucket: "dintorni-dev.appspot.com",
    messagingSenderId: "519973926988",
    appId: "1:519973926988:web:8570da91f33a1b6b2d9ce9",
    measurementId: "G-FJ9863RJ7L"
  };
}


//console.log(firebaseConfig);


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const provider = new GoogleAuthProvider();


// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

//init services
const auth = getAuth();
auth.languageCode = 'it';
let analytics: any = () => { };
// Initialize Analytics and get a reference to the service
// if (typeof window !== 'undefined') {
//   analytics = getAnalytics(app);
// }


export {
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  verifyPasswordResetCode,
  confirmPasswordReset,
  sendPasswordResetEmail,
  applyActionCode,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
  provider,
  storage,
  deleteUser
}