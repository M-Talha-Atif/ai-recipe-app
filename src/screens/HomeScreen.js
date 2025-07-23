import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList
} from 'react-native';
import { COLORS } from '../styles/common';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';
import { getRecentRecipes } from '../services/recipeService';

const ActionCard = ({ icon, title, subtitle, onPress, color }) => (
  <TouchableOpacity style={[styles.card, { borderColor: color }]} onPress={onPress}>
    <View style={styles.cardIcon}>{icon}</View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const RecipeCard = ({ recipe }) => (
  <View style={styles.recipeCard}>
    <Text style={styles.recipeTitle}>{recipe.name}</Text>
    <Text style={styles.recipeCalories}>{recipe.calories} kcal</Text>
    <TouchableOpacity style={styles.addBtn}>
      <Text style={styles.addBtnText}>View</Text>
    </TouchableOpacity>
  </View>
);


const HomeScreen = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const recent = await getRecentRecipes(userId);
        setRecipes(recent);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.welcome}>👋 Hello, Chef!</Text>
      <Text style={styles.subtitle}>Let’s save your fridge (again).</Text>

      <View style={styles.cardRow}>
        <ActionCard
          icon={<Ionicons name="camera" size={32} color={COLORS.primary} />}
          title="Scan Fridge"
          subtitle="Upload a fridge photo"
          onPress={() => navigation.navigate('Scan')}
          color={COLORS.primary}
        />

        <ActionCard
          icon={<FontAwesome5 name="keyboard" size={28} color={COLORS.primary} />}
          title="Manual Input"
          subtitle="Type ingredients manually"
          onPress={() => navigation.navigate('ManualInput')}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.cardRow}>
        <ActionCard
          icon={<MaterialIcons name="qr-code-scanner" size={32} color={COLORS.primary} />}
          title="Scan Barcode"
          subtitle="Detect groceries via barcode"
          onPress={() => navigation.navigate('BarcodeScanner')}
          color={COLORS.primary}
        />

        <ActionCard
          icon={<Ionicons name="bulb" size={30} color={COLORS.primary} />}
          title="Smart Tips"
          subtitle="Check what's expiring"
          onPress={() => console.log('View smart tips')}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>💡 Tip of the Day</Text>
        <Text style={styles.tipText}>"Don’t be a quitter. Cook that chicken."</Text>
      </View>

      <Text style={styles.sectionHeader}>Recent Alerts</Text>
      <View style={styles.alertBox}>
        <Text style={styles.alertText}>🥬 Your spinach expires in 2 days.</Text>
        <Text style={styles.alertText}>🍄 That mushroom? It’s evolving.</Text>
      </View>

      {/* Recipes Carousel */}
      {recipes.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Recently Generated Recipes</Text>
          <FlatList
            data={recipes}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            contentContainerStyle={{ paddingVertical: 12 }}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcome: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 24,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    height: 140,
    borderRadius: 14,
    borderWidth: 1.5,
    marginHorizontal: 6,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIcon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#777',
  },
  tipBox: {
    backgroundColor: '#FFEFD5',
    padding: 18,
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 28,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  tipText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 24,
    color: COLORS.primary,
  },
  alertBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    marginBottom: 24,
  },
  alertText: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 6,
  },
  recipeCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginRight: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  recipeCalories: {
    fontSize: 13,
    color: '#888',
    marginBottom: 14,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});


export default HomeScreen;
