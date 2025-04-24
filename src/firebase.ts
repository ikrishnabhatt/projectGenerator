// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6bKO8_w-A1-_QyEWMMvKq-LeLR8mQLuM",
  authDomain: "thynkai-a47ab.firebaseapp.com",
  projectId: "thynkai-a47ab",
  storageBucket: "thynkai-a47ab.firebasestorage.app",
  messagingSenderId: "311408274731",
  appId: "1:311408274731:web:3da68d7524efc0f0ce296e",
  measurementId: "G-RBRJTEWZEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);