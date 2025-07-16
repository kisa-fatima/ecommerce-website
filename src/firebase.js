// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEx3o68-gUjoREtM3ZL5WwIZW9GqmjPyE",
  authDomain: "qabliforms.firebaseapp.com",
  projectId: "qabliforms",
  storageBucket: "qabliforms.appspot.com",
  messagingSenderId: "441312144281",
  appId: "1:441312144281:web:17efddf6f778ba32290108"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
// Initialize Firestore and export as default
const db = getFirestore(app);
export const auth = getAuth(app);
export default db;