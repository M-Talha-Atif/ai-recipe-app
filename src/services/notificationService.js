import * as Notifications from 'expo-notifications';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

// Configure notifications handler
export async function configureNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('You wont get funny food reminders!');
  }

  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  // Set notification channel for Android
  await Notifications.setNotificationChannelAsync('expiry-reminders', {
    name: 'Expiry Reminders',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
}

// Get funny/aggressive reminder message
const getRandomMessage = (itemName, daysLeft) => {
  const messages = [
    `"${itemName}" is plotting your demise in ${daysLeft} days! Use it first!`,
    `Your ${itemName} feels neglected. Give it some love today!`,
    `Emergency! ${itemName} will revolt in ${daysLeft} days!`,
    `${itemName} says: "Eat me before I eat you!"`,
    `Your ${itemName} is aging faster than your last relationship`,
    `${itemName} is about to stage a fridge coup!`,
    `Final warning: ${itemName} will biohazard your fridge soon`
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Schedule notifications for expiring items
export async function scheduleExpirationReminders(userId) {
  try {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    const q = query(
      collection(db, 'Barcodes'),
      where('userId', '==', userId),
      where('expiryDate', '<=', threeDaysFromNow),
      where('expiryDate', '>=', now)
    );

    const querySnapshot = await getDocs(q);
    
    // Cancel all existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Schedule new ones
    querySnapshot.forEach(async (doc) => {
      const item = doc.data();
      const expiryDate = item.expiryDate.toDate();
      const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
      
      // Schedule notification for each day leading up to expiry
      for (let days = 1; days <= daysLeft; days++) {
        const triggerTime = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: days === 1 ? '🚨 LAST CHANCE!' : '⚠️ Ingredient Alert',
            body: getRandomMessage(item.itemName, days),
            sound: 'default',
            data: { itemId: doc.id },
            channelId: 'expiry-reminders'
          },
          trigger: { 
            date: triggerTime,
            repeats: false
          },
        });
      }
    });
  } catch (error) {
    console.error('Error scheduling reminders:', error);
  }
}

// Setup background task to check for expiring items
export function setupDailyReminderCheck(userId) {
  // Check immediately on setup
  scheduleExpirationReminders(userId);
  
  // Then check every 24 hours
  const interval = setInterval(() => {
    scheduleExpirationReminders(userId);
  }, 24 * 60 * 60 * 1000);
  
  return () => clearInterval(interval);
}


export async function sendImmediateBarcodeNotification(itemName) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🍏 Item Saved!',
      body: `"${itemName}" was added to your fridge. We'll remind you before it expires!`,
      sound: 'default',
      data: { type: 'barcode-saved' },
      channelId: 'expiry-reminders'
    },
    trigger: { seconds: 10 }, // 10 second delay
  });
}