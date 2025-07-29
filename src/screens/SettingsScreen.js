import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { COLORS } from '../styles/common';

const SettingsScreen = ({ navigation }) => {
  const auth = getAuth();
  const db = getFirestore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Load user data from Firestore
  useEffect(() => {
  const loadUserProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setEmail(user.email);

    try {
      const userRef = doc(db, 'Users', user.uid); 
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setName(data.fullName || '');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load profile.');
    }
  };

  loadUserProfile();
}, []);

   

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, 'Users', user.uid);
      await updateDoc(userRef, {
        fullName: name,
        updatedAt: new Date(),
      });
      Alert.alert('Success', 'Name updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update name.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login'); // or navigation.navigate if using stack
    } catch (error) {
      Alert.alert('Error', 'Logout failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.disabledInput]}
        placeholder="Email"
        value={email}
        editable={false}
      />
      <Button title="Save" onPress={handleSave} color={COLORS.primary} />

      <View style={styles.logoutSection}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.background,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.primary,
  },
  input: {
    height: 48,
    borderColor: COLORS.inputBorder,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#eee',
    color: '#888',
  },
  logoutSection: {
    marginTop: 40,
  },
});
