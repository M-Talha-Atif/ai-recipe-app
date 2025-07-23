// src/screens/FridgeScanScreen.js
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';
import { recognizeFoodFromImage } from '../services/logMealService';
import { COLORS } from '../theme/colors';

export default function FridgeScanScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async (fromCamera = false) => {
    try {
      const pickerFunc = fromCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
      const result = await pickerFunc({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 0.4,
        allowsEditing: true,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setLoading(true);

        try {
          const foodNames = await recognizeFoodFromImage(asset.base64);
          setLabels(foodNames);
        } catch (err) {
          Alert.alert('Recognition Error', err.message);
        } finally {
          setLoading(false);
        }
      }
    } catch (pickerError) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const renderIngredient = ({ item }) => (
    <Animatable.View animation="fadeInUp" duration={500} style={styles.ingredientCard}>
      <Text style={styles.ingredientText}>🍽️ {item}</Text>
    </Animatable.View>
  );

  const AnimatedLoader = () => (
    <View style={styles.loaderContainer}>
      <Animatable.Text animation="pulse" iterationCount="infinite" easing="ease-in-out" style={styles.loaderText}>
        Scanning your fridge...
      </Animatable.Text>
      <Animatable.View animation="bounce" iterationCount="infinite" style={styles.dotLoader}>
        <Text style={styles.dot}>• • •</Text>
      </Animatable.View>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Animatable.Text animation="fadeInDown" style={styles.title}>Fridge Scanner</Animatable.Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(false)}>
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(true)}>
          <Text style={styles.buttonText}>Use Camera</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <Animatable.Image animation="zoomIn" source={{ uri: imageUri }} style={styles.image} />
      )}

      {loading && <AnimatedLoader />}

      {labels.length > 0 && <Text style={styles.resultTitle}>Detected Ingredients:</Text>}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={labels}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderIngredient}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={[styles.container, { paddingBottom: 120 }]} // extra bottom padding
        ListHeaderComponent={ListHeader}
        stickyHeaderIndices={[0]}
      />

      {labels.length > 0 && (
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity style={styles.makeRecipeButton} onPress={() => navigation.navigate('MakeRecipe', { ingredients: labels })}> 
            <Text style={styles.makeRecipeText}>Make Recipes</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 10,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 16,
    marginVertical: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.primary,
    textAlign: 'center',
  },
  ingredientCard: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    elevation: 1,
  },
  ingredientText: {
    fontSize: 16,
    color: COLORS.text,
  },
  footerButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  makeRecipeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  makeRecipeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loaderContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loaderText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  dotLoader: {
    marginTop: 8,
  },
  dot: {
    fontSize: 30,
    color: COLORS.primary,
    letterSpacing: 3,
  },
});
