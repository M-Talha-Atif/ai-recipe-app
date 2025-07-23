// src/services/recipeService.js
import {   getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs 
} from 'firebase/firestore';
import axios from 'axios';
import Constants from 'expo-constants';
import { db } from '../config/firebase'; 


const GEMINI_API_KEY = Constants.expoConfig.extra.GEMINI_API_KEY;
console.log('GEMINI_API_KEY:', GEMINI_API_KEY);
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
export async function generateRecipe(ingredients) {
  try {
    const prompt = `
      Suggest 5 recipes using ONLY these ingredients: ${ingredients.join(', ')}.
      Each recipe must include: 
      - name
      - estimated calories
      - steps (short instructions)
      Return JSON in format:
      [{ "name": "", "calories": "", "steps": ["", ""] }]
    `;
    const body = { contents: [{ parts: [{ text: prompt }] }] };

    const res = await axios.post(GEMINI_URL, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    let textResponse = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    // 🔹 Strip markdown code fences if present
    textResponse = textResponse.replace(/```json|```/g, '').trim();

    // 🔹 Extract first valid JSON array
    const match = textResponse.match(/\[.*\]/s);
    if (!match) throw new Error('No valid JSON found in Gemini response');

    return JSON.parse(match[0]);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate recipes');
  }
}

export async function addRecipeToFirestore(recipe, userId) {
  try {
    if (!userId) {
      throw new Error('User ID is required to save recipe');
    }

    const recipeWithMetadata = {
      ...recipe,
      userId, // Add user ID to the recipe
      type: 'generative',
      createdAt: serverTimestamp(), // Use server timestamp instead of local Date
      lastUpdated: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'Recipes'), recipeWithMetadata);
    
    console.log('Recipe saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Firestore Error:', error);
    throw new Error('Failed to save recipe');
  }
}

export async function getRecentRecipes(userId) {
  try {
    const q = query(
      collection(db, 'Recipes'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching recent recipes:', error);
    return [];
  }
}


// New function to get recipes by user
export async function getUserRecipes(userId) {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, 'Recipes'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
    );

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user recipes:', error);
    throw new Error('Failed to fetch recipes');
  }
}
