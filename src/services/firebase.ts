import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
// NOTE: In a production environment, these should be environment variables.
// For this project, we'll use a placeholder structure.
const firebaseConfig = {
    apiKey: "AIzaSyDummyKey_TaskMate_2026",
    authDomain: "taskmate-collaboration.firebaseapp.com",
    projectId: "taskmate-collaboration",
    storageBucket: "taskmate-collaboration.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
