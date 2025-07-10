// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXzYagDq_NzOl8d-GJAGPf5W0nRhI-Igw",
  authDomain: "ecommerce-store-reactjs.firebaseapp.com",
  projectId: "ecommerce-store-reactjs",
  storageBucket: "ecommerce-store-reactjs.firebasestorage.app",
  messagingSenderId: "93478167317",
  appId: "1:93478167317:web:996fb774bc26b523dc3f1c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export as default
const db = getFirestore(app);
export default db;