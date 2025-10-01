import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Use standard getAuth
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvCACdbGcA2uGJie65v39XcMo7stW3ifU",
  authDomain: "unihub-5f1a8.firebaseapp.com",
  projectId: "unihub-5f1a8",
  storageBucket: "unihub-5f1a8.firebasestorage.app",
  messagingSenderId: "278114262710",
  appId: "1:278114262710:web:2c66db72519d19a02d9017",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize standard Auth
export const auth = getAuth(app); 

// Initialize and Export Firestore
export const db = getFirestore(app); 

export { app };