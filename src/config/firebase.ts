// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";


import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode
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
  firebaseConfig = {
    apiKey: "AIzaSyD2Qy57T2kfvcmUXsgId8X2aUPJbnqvq34",
    authDomain: "dintorni-prod.firebaseapp.com",
    projectId: "dintorni-prod",
    storageBucket: "dintorni-prod.appspot.com",
    messagingSenderId: "890670080840",
    appId: "1:890670080840:web:1c04dd1f4e6a29d4c5497d",
    measurementId: "G-EETDDVBRRY"
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




// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

//init services
const auth = getAuth();
auth.languageCode = 'it';
let analytics: any = () => { };
// Initialize Analytics and get a reference to the service
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}


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
  storage,
  analytics
}