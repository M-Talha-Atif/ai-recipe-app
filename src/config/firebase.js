// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBagXudzBlk_97pBViVY4x_6ITCWy5RNH8",
  authDomain: "recipe-app-5c318.firebaseapp.com",
  projectId: "recipe-app-5c318",
  storageBucket: "recipe-app-5c318.firebasestorage.app",
  messagingSenderId: "1063251229810",
  appId: "1:1063251229810:web:59cd72d495512f37c216eb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app); // Add this export

export { auth };
