// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Import } from "lucide-react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJoq8MNOUxsmMGXtt14pCJ-wkktxdwZ9E",
  authDomain: "vault-1d37c.firebaseapp.com",
  projectId: "vault-1d37c",
  storageBucket: "vault-1d37c.firebasestorage.app",
  messagingSenderId: "1023522735707",
  appId: "1:1023522735707:web:62c8d5c40400da91a1e17e",
  measurementId: "G-75RPMTHNK4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);