// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";    
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAT65fMKTOhAnF2SuAHQwtU0401tW2YAss",
  authDomain: "doushare-e44d0.firebaseapp.com",
  projectId: "doushare-e44d0",
  storageBucket: "doushare-e44d0.firebasestorage.app",
  messagingSenderId: "298097590898",
  appId: "1:298097590898:web:7a53a1080060e76efab8eb",
  measurementId: "G-6R9DQKPKB0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export default app;