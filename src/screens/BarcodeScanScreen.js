import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth } from 'firebase/auth';
import { COLORS } from '../styles/common';
import { saveBarcodeItem } from '../services/barcodeService';

export default function BarcodeScanScreen({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState('');
  const [itemName, setItemName] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const auth = getAuth();
  
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarcodeScanned = ({ data }) => {
    setScanned(true);
    setBarcodeData(data);
    setItemName('');
  };

  const handleSave = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not logged in');

      if (!itemName) {
        Alert.alert('Error', 'Please enter item name');
        return;
      }

      await saveBarcodeItem(userId, barcodeData, itemName, expiryDate);
      Alert.alert('Success', 'Item saved!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  
    if (!permission) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Requesting camera permission...</Text>;
  }

    if (!permission.granted) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!scanned ? (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr'],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Barcode: {barcodeData}</Text>
          <TextInput
            placeholder="Item Name"
            value={itemName}
            onChangeText={setItemName}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              {`Expiry Date: ${expiryDate.toDateString()}`}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={expiryDate}
              mode="date"
              display="default"
              onChange={(e, date) => {
                setShowDatePicker(false);
                if (date) setExpiryDate(date);
              }}
            />
          )}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rescanButton} onPress={() => setScanned(false)}>
            <Text style={styles.rescanText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Keep your existing styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  formContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: COLORS.text },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12,
    marginBottom: 12, fontSize: 16, backgroundColor: '#fff'
  },
  dateButton: {
    backgroundColor: COLORS.primary, padding: 14, borderRadius: 8, marginBottom: 20
  },
  dateButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  saveButton: {
    backgroundColor: COLORS.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 10
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  rescanButton: { marginTop: 12, alignItems: 'center' },
  rescanText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 }
});