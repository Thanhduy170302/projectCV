// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdGDJALZQDm5Uu7CGyF2gy7zGzFJOzuv4",
  authDomain: "ecommerce-dc62e.firebaseapp.com",
  projectId: "ecommerce-dc62e",
  storageBucket: "ecommerce-dc62e.appspot.com",
  messagingSenderId: "231537054514",
  appId: "1:231537054514:web:6d5c8d5e2a6c74b317fd2b",
  measurementId: "G-K7D1W0ZTLX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);