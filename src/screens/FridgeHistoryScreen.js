import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getUserRecipes } from '../services/recipeService';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors'; // Make sure this exists

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown Date';
  const date = timestamp.toDate();
  return date.toDateString();
};

export default function FridgeHistoryScreen() {
  const [recipes, setRecipes] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;
        const userRecipes = await getUserRecipes(userId);
        setRecipes(userRecipes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipes();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        🧊 Fridge Scanned on {formatDate(item.createdAt)}
      </Text>
      <Text style={styles.subtitle}>Ingredients:</Text>
      {item.ingredients?.length > 0 ? (
        item.ingredients.map((ing, idx) => (
          <Text key={idx} style={styles.ingredient}>
            • {ing}
          </Text>
        ))
      ) : (
        <Text style={styles.ingredient}>No ingredients found.</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#fff',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary || '#FF7F50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: COLORS.text || '#333',
  },
  ingredient: {
    fontSize: 13,
    color: '#555',
  },
});
