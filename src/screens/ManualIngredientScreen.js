import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function ManualIngredientScreen({ navigation }) {
  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState([]);

  const addIngredient = () => {
    if (ingredient.trim() && !ingredients.includes(ingredient.trim())) {
      setIngredients([...ingredients, ingredient.trim()]);
      setIngredient('');
      Keyboard.dismiss();
    }
  };

  const removeIngredient = (item) => {
    setIngredients(ingredients.filter(i => i !== item));
  };

  const renderChip = ({ item }) => (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{item}</Text>
      <TouchableOpacity onPress={() => removeIngredient(item)}>
        <Ionicons name="close-circle" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Ingredients</Text>
      <Text style={styles.subtitle}>Type an ingredient & press enter</Text>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="e.g. Chicken, Tomato, Garlic"
        value={ingredient}
        onChangeText={setIngredient}
        onSubmitEditing={addIngredient}
        returnKeyType="done"
      />

      {/* Chips */}
      {ingredients.length > 0 && (
        <FlatList
          data={ingredients}
          renderItem={renderChip}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          numColumns={3}
          contentContainerStyle={{ marginVertical: 20 }}
        />
      )}

      {/* Generate Button */}
      {ingredients.length > 0 && (
        <TouchableOpacity
          style={styles.generateBtn}
          onPress={() => navigation.navigate('MakeRecipe', { ingredients })}
        >
          <Text style={styles.generateBtnText}>Generate Recipes</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    elevation: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 6,
  },
  chipText: {
    color: '#fff',
    marginRight: 6,
    fontWeight: 'bold',
  },
  generateBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  generateBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
