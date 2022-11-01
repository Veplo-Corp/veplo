// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

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

//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

//init services
const auth = getAuth();
auth.languageCode = 'it';


export {
auth,
createUserWithEmailAndPassword,
onAuthStateChanged,
signInWithEmailAndPassword,
signOut,
sendPasswordResetEmail,
storage
}