import { addDoc, collection, serverTimestamp, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { scheduleExpirationReminders, sendImmediateBarcodeNotification } from './notificationService';

export const saveBarcodeItem = async (userId, barcodeData, itemName, expiryDate) => {
  try {
    const docRef = await addDoc(collection(db, 'Barcodes'), {
      userId,
      barcode: barcodeData,
      itemName,
      expiryDate,
      createdAt: serverTimestamp()
    });

    // Schedule notifications for this new item
    await scheduleExpirationReminders(userId);


        // Send immediate 10-second confirmation
    await sendImmediateBarcodeNotification(itemName);

    return docRef.id;
  } catch (error) {
    console.error('Error saving barcode item:', error);
    throw error;
  }
};

export const getUserBarcodeItems = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, 'Barcodes'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user barcode items:', error);
    throw error;
  }
};