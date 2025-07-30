// src/services/userService.js
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase'; // Make sure this exports your initialized Firestore instance

export const storeUserData = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'Users', userId), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('User data stored successfully');
  } catch (error) {
    console.error('Error storing user data:', error);
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, 'Users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

