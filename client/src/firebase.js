// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-355bd.firebaseapp.com",
  projectId: "mern-estate-355bd",
  storageBucket: "mern-estate-355bd.appspot.com",
  messagingSenderId: "701727373105",
  appId: "1:701727373105:web:b8f02c63e3d493f8316210",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
