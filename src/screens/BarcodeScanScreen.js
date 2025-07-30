import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { COLORS } from '../styles/common';
import { saveBarcodeItem } from '../services/barcodeService';

export default function BarcodeScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState('');
  const [itemName, setItemName] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const auth = getAuth();

  const handleBarcodeScanned = ({ data }) => {
    setScanned(true);
    setBarcodeData(data);
    setShowCamera(false); // Close camera after scanning
  };

  const handleSave = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not logged in');

      if (!itemName) {
        Alert.alert('Error', 'Please enter item name');
        return;
      }

      await saveBarcodeItem(
        userId,
        barcodeData,
        itemName,
        Timestamp.fromDate(expiryDate)
      );

      Alert.alert('Success', 'Item saved!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const pickImage = async (fromCamera = false) => {
    const picker = fromCamera
      ? ImagePicker.launchCameraAsync
      : ImagePicker.launchImageLibraryAsync;

    const result = await picker({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setScanned(true);
      setBarcodeData('placeholder-barcode'); // simulate scan result
    }
  };

  return (
    <View style={styles.container}>
      {showCamera && permission?.granted ? (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr'],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      ) : !scanned ? (
        <View style={styles.introContainer}>
          <Text style={styles.title}>Scan Item Barcode</Text>
          <Text style={styles.description}>
            Scan the barcode from your food items to track expiry dates with funny reminders.
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => {
                requestPermission();
                setShowCamera(true);
              }}
            >
              <Text style={styles.optionText}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => pickImage(false)}
            >
              <Text style={styles.optionText}>Pick from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.formContainer}>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImg} />}
          <Text style={styles.label}>Barcode: {barcodeData}</Text>
          <TextInput
            placeholder="Item Name"
            value={itemName}
            onChangeText={setItemName}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Text style={styles.dateButtonText}>
              {`Expiry Date: ${expiryDate.toDateString()}`}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={expiryDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                if (date) setExpiryDate(date);
                setShowDatePicker(false);
              }}
            />
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={() => {
              setScanned(false);
              setImageUri(null);
              setBarcodeData('');
              setItemName('');
            }}
          >
            <Text style={styles.rescanText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  dateButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rescanButton: { marginTop: 12, alignItems: 'center' },
  rescanText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  previewImg: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  optionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  optionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
