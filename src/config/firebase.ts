// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";


import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDs607C9zpuZjhM9H9lA48QRkFX4nZwi9o",
  authDomain: "dintorni-dev.firebaseapp.com",
  projectId: "dintorni-dev",
  storageBucket: "dintorni-dev.appspot.com",
  messagingSenderId: "519973926988",
  appId: "1:519973926988:web:8570da91f33a1b6b2d9ce9",
  measurementId: "G-FJ9863RJ7L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);




// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

//init services
const auth = getAuth();
auth.languageCode = 'it';
let analytics:any = () => {};
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
  sendPasswordResetEmail,
  storage,
  analytics
}