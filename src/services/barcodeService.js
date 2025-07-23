import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const saveBarcodeItem = async (userId, barcodeData, itemName, expiryDate) => {
  try {
    const docRef = await addDoc(collection(db, 'Barcodes'), {
      userId,
      barcode: barcodeData,
      itemName,
      expiryDate,
      createdAt: serverTimestamp()
    });
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