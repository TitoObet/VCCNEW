
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyADrNZoDOiIU9YOVETpixE-zFq7_84Cm6s",
  authDomain: "login-52b0e.firebaseapp.com",
  projectId: "login-52b0e",
  storageBucket: "login-52b0e.appspot.com",
  messagingSenderId: "1052635005495",
  appId: "1:1052635005495:web:aa8cfb07b53287431bf5b2",
  measurementId: "G-M4JTYNDKXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default firebaseConfig;