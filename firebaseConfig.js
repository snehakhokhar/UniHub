// firebaseConfig.js

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getDatabase } from "firebase/database"; 
// import { getFirestore } from "firebase/firestore";
// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCvCACdbGcA2uGJie65v39XcMo7stW3ifU",
//   authDomain: "unihub-5f1a8.firebaseapp.com",
//   databaseURL: "https://unihub-5f1a8-default-rtdb.firebaseio.com",
//   projectId: "unihub-5f1a8",
//   storageBucket: "unihub-5f1a8.firebasestorage.app",
//   messagingSenderId: "278114262710",
//   appId: "1:278114262710:web:2c66db72519d19a02d9017",
//   databaseURL: "https://unihub-5f1a8-default-rtdb.firebaseio.com",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getDatabase(app);
// export { app };
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvCACdbGcA2uGJie65v39XcMo7stW3ifU",
  authDomain: "unihub-5f1a8.firebaseapp.com",
  projectId: "unihub-5f1a8",
  storageBucket: "unihub-5f1a8.firebasestorage.app",
  messagingSenderId: "278114262710",
  appId: "1:278114262710:web:2c66db72519d19a02d9017",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // Export the Firestore instance as db
export { app };