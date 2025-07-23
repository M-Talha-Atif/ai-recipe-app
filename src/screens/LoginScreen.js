import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Button, ActivityIndicator
} from 'react-native';
import { authStyles as styles, COLORS } from '../styles/common';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import Constants from 'expo-constants';


// testing@gmail.com with same password for testing
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  console.log('DETECTION_KEY:', Constants.expoConfig.extra.DETECTION_KEY); // Debugging line to check if key is loaded

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      navigation.replace('Dashboard'); // this replaces Login in the stack
      // Navigate to Home
    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animatable.View animation="fadeInUp" style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={{ position: 'relative' }}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={secure}
        />
        <TouchableOpacity
          style={{ position: 'absolute', right: 12, top: 14 }}
          onPress={() => setSecure(!secure)}
        >
          <Icon name={secure ? 'eye-off' : 'eye'} size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} size="large" />
      ) : (
        <Button title="Login" color={COLORS.primary} onPress={handleLogin} />
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default LoginScreen;
