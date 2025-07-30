import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
  GestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { getUserRecipes } from '../services/recipeService';
import { deleteRecipe } from '../services/recipeService';
import { getAuth } from 'firebase/auth';
import { COLORS } from '../theme/colors';
import { Directions } from 'react-native-gesture-handler';
import { Alert } from 'react-native';


const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown Date';
  const date = timestamp.toDate();
  return date.toLocaleString();
};


const RecipeCard = ({ item, isExpanded, onToggle, onDeleted }) => {
  const scale = useSharedValue(1);

  const confirmDelete = () => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(item.id);
              onDeleted(item.id); // notify parent
            } catch (error) {
              console.error('Delete failed', error);
            }
          },
        },
      ]
    );
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 200 });
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(onToggle)(item.id);
  });

  const longPressGesture = Gesture.LongPress()
    .minDuration(600)
    .onStart(() => {
      runOnJS(confirmDelete)();
    });

  const combinedGestures = Gesture.Simultaneous(
    tapGesture,
    pinchGesture,
    longPressGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ingredientList = item.ingredients?.join(', ') || 'No ingredients found';
  const stepList =
    item.steps?.map((s, i) => `${i + 1}. ${s}`).join('\n') || 'No steps provided';

  return (
    <GestureDetector gesture={combinedGestures}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.meta}>Calories: {item.calories}</Text>
        <Text style={styles.meta}>Created: {formatDate(item.createdAt)}</Text>

        <Text style={styles.label}>Ingredients:</Text>
        <Text style={styles.value}>{ingredientList}</Text>

        {isExpanded && (
          <>
            <Text style={styles.label}>Steps:</Text>
            <Text style={styles.value}>{stepList}</Text>
          </>
        )}

        <Text style={styles.toggleHint}>
          {isExpanded ? 'Tap to hide steps' : 'Tap to show steps'}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default function FridgeHistoryScreen() {
  const [recipes, setRecipes] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // new
  const [expandedIds, setExpandedIds] = useState([]);
  const auth = getAuth();
  const listRef = useRef(null);

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

  useEffect(() => {
    fetchRecipes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecipes();
    setRefreshing(false);
  };

  const toggleExpanded = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const currentIndex = useSharedValue(0);

  const scrollToIndex = (index) => {
    if (!listRef.current || index < 0 || index >= recipes.length) return;
    listRef.current.scrollToIndex({ index, animated: true });
  };

  const flingUp = Gesture.Fling()
    .direction(Directions.UP)
    .onEnd(() => {
      currentIndex.value = Math.min(currentIndex.value + 3, recipes.length - 1);
      runOnJS(scrollToIndex)(currentIndex.value);
    });

  const flingDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onEnd(() => {
      currentIndex.value = Math.max(currentIndex.value - 3, 0);
      runOnJS(scrollToIndex)(currentIndex.value);
    });

  const gesture = Gesture.Simultaneous(flingUp, flingDown);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <View style={styles.container}>
          <FlatList
            ref={listRef}
            data={recipes}
            refreshing={refreshing} // new
            onRefresh={onRefresh} // new
            keyExtractor={(item, idx) => item.id || idx.toString()}
            renderItem={({ item }) => (
              <RecipeCard
                item={item}
                isExpanded={expandedIds.includes(item.id)}
                onToggle={toggleExpanded}
                onDeleted={async (id) => {
                  // Re-fetch to ensure consistency
                  await fetchRecipes();
                }}
              />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            onScrollToIndexFailed={() => { }}
          />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
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
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary || '#FF7F50',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    color: COLORS.text || '#333',
  },
  value: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
    lineHeight: 20,
  },
  toggleHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});
