// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAPGzFL3DgGEXfevxpVQgejEvYLzYdGNA",
  authDomain: "saikrishna-1845c.firebaseapp.com",
  projectId: "saikrishna-1845c",
  storageBucket: "saikrishna-1845c.appspot.com",
  messagingSenderId: "429846734410",
  appId: "1:429846734410:web:02c003be0f990ba97b28b3",
  measurementId: "G-KT7Y1VVJ4B"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore();