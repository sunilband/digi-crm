// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDiVzluCR8Y0AdrrTX7JuL7u_yeUGtAD-U",
  authDomain: "digi-crm-42dfa.firebaseapp.com",
  projectId: "digi-crm-42dfa",
  storageBucket: "digi-crm-42dfa.appspot.com",
  messagingSenderId: "222764499019",
  appId: "1:222764499019:web:bd1c95eaeae9f1d359cdce",
  measurementId: "G-W06JLSTMNV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider, app, db }
