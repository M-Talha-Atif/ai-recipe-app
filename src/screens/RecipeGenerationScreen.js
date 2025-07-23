// src/screens/RecipeGenerationScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../theme/colors';
import { generateRecipe, addRecipeToFirestore } from '../services/recipeService';
import { getAuth } from 'firebase/auth';


export default function RecipeGenerationScreen({ route }) {
  const { ingredients } = route.params; 
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => { fetchRecipes(); }, []);

  const fetchRecipes = async () => {
    try {
      const data = await generateRecipe(ingredients);
      setRecipes(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipe = async (recipe) => {
    try {
    const userId = auth.currentUser?.uid;
     await addRecipeToFirestore(recipe, userId);
    Alert.alert('Success', 'Recipe added to your collection!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderRecipeCard = ({ item }) => (
    <Animatable.View animation="fadeInUp" duration={500} style={styles.card}>
      <Text style={styles.recipeName}>{item.name}</Text>
      <Text style={styles.calories}>Calories: {item.calories}</Text>
      <Text style={styles.stepsTitle}>Steps:</Text>
      {item.steps.map((step, idx) => (
        <Text key={idx} style={styles.step}>• {step}</Text>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={() => handleAddRecipe(item)}>
        <Text style={styles.addButtonText}>Add to My Recipes</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI-Generated Recipes</Text>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderRecipeCard}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  calories: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 10,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.text,
  },
  step: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
