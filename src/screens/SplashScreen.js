import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const auth = getAuth();

    // Listen to auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        if (user) {
          navigation.replace('Dashboard'); // User is logged in
        } else {
          navigation.replace('Login'); // User not logged in
        }
      }, 1500); // Add short splash delay
    });

    // Clean up listener
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
