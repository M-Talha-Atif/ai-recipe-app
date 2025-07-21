import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { COLORS } from '../styles/common';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

const ActionCard = ({ icon, title, subtitle, onPress, color }) => (
  <TouchableOpacity style={[styles.card, { borderColor: color }]} onPress={onPress}>
    <View style={styles.cardIcon}>{icon}</View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.welcome}>👋 Hello, Chef!</Text>
      <Text style={styles.subtitle}>Let’s save your fridge (again).</Text>

      <View style={styles.cardRow}>
        <ActionCard
          icon={<Ionicons name="camera" size={32} color={COLORS.primary} />}
          title="Scan Fridge"
          subtitle="Upload a fridge photo"
          onPress={() => console.log('Open camera')}
          color={COLORS.primary}
        />

        <ActionCard
          icon={<FontAwesome5 name="keyboard" size={28} color={COLORS.primary} />}
          title="Manual Input"
          subtitle="Type ingredients manually"
          onPress={() => console.log('Navigate to manual input')}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.cardRow}>
        <ActionCard
          icon={<MaterialIcons name="qr-code-scanner" size={32} color={COLORS.primary} />}
          title="Scan Barcode"
          subtitle="Detect groceries via barcode"
          onPress={() => console.log('Open barcode scanner')}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 32,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    height: 130,
    borderRadius: 16,
    borderWidth: 2,
    marginHorizontal: 6,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  tipBox: {
    backgroundColor: '#FFE4B5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  tipText: {
    color: COLORS.text,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.primary,
  },
  alertBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertText: {
    color: COLORS.text,
    marginBottom: 4,
  },
});

export default HomeScreen;
