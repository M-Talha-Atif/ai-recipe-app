import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Button, ActivityIndicator
} from 'react-native';
import { authStyles as styles, COLORS } from '../styles/common';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true); // Separate state for password
  const [secureConfirm, setSecureConfirm] = useState(true);   // Separate state for confirm
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      return setError("Passwords don't match!");
    }

    setLoading(true);
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signup successful');
       navigation.replace('Login'); // Navigate to Login 
    } catch (err) {
      console.error('Signup error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animatable.View animation="fadeInUp" style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Field */}
      <View style={{ position: 'relative', marginBottom: 15 }}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={securePassword}
        />
        <TouchableOpacity
          style={{ position: 'absolute', right: 12, top: 14 }}
          onPress={() => setSecurePassword(!securePassword)}
        >
          <Icon 
            name={securePassword ? 'eye-off' : 'eye'} 
            size={20} 
            color={COLORS.primary} 
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Field (Matching Style) */}
      <View style={{ position: 'relative', marginBottom: 15 }}>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry={secureConfirm}
        />
        <TouchableOpacity
          style={{ position: 'absolute', right: 12, top: 14 }}
          onPress={() => setSecureConfirm(!secureConfirm)}
        >
          <Icon 
            name={secureConfirm ? 'eye-off' : 'eye'} 
            size={20} 
            color={COLORS.primary} 
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} size="large" />
      ) : (
        <Button title="Sign Up" color={COLORS.primary} onPress={handleSignup} />
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default SignupScreen;