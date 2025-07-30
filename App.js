import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase';
import { setupDailyReminderCheck, configureNotifications } from './src/services/notificationService';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import FridgeScanScreen from './src/screens/FridgeScanScreen';
import Dashboard from './src/screens/Dashboard';
import RecipeGenerationScreen from './src/screens/RecipeGenerationScreen';
import ManualIngredientScreen from './src/screens/ManualIngredientScreen';
import BarcodeScanScreen from './src/screens/BarcodeScanScreen';
import SmartTipsScreen from './src/screens/SmartTipsScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Configure notifications handler
    configureNotifications();

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Start daily reminder checks for logged in user
        setupDailyReminderCheck(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Scan" component={FridgeScanScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="MakeRecipe" component={RecipeGenerationScreen} />
        <Stack.Screen name="ManualInput" component={ManualIngredientScreen} />
        <Stack.Screen name="BarcodeScanner" component={BarcodeScanScreen} />
        <Stack.Screen
          name="SmartTips"
          component={SmartTipsScreen}
          options={{
            title: 'Smart Tips',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}