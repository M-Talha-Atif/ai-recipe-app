import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import FridgeScanscreen from './src/screens/FridgeScanScreen';
import Dashboard from './src/screens/Dashboard';
import RecipeGenerationScreen from './src/screens/RecipeGenerationScreen';
import ManualIngredientScreen from './src/screens/ManualIngredientScreen';
import BarcodeScanScreen from './src/screens/BarcodeScanScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Scan" component={FridgeScanscreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="MakeRecipe" component={RecipeGenerationScreen} />
        <Stack.Screen name="ManualInput" component={ManualIngredientScreen} />
        <Stack.Screen name="BarcodeScanner" component={BarcodeScanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}