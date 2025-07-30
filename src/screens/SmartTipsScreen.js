import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getUserBarcodeItems, deleteBarcodeItem } from '../services/barcodeService';
import { COLORS } from '../styles/common';
import { format } from 'date-fns';
import { SegmentedButtons } from 'react-native-paper';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { auth } from '../config/firebase';

// Expiring Item Card Component
const ExpiringItemCard = ({ item, onPress }) => {
    const now = new Date();
    const expiry = item.expiryDate.toDate();
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    let color = COLORS.success;
    if (daysLeft < 0) color = COLORS.error;
    else if (daysLeft < 3) color = COLORS.warning;
    else if (daysLeft <= 7) color = COLORS.orange;

    const progress = Math.max(0, Math.min(1, (10 - daysLeft) / 10));
    const pulse = useSharedValue(1);

    useEffect(() => {
        if (daysLeft <= 1) {
            pulse.value = withRepeat(
                withTiming(1.03, {
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                }),
                -1,
                true
            );
        }
    }, [daysLeft]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        shadowOpacity: pulse.value * 0.2,
    }));

    return (
        <Animated.View style={[styles.card, animatedStyle]}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <Text style={[styles.itemName, { color }]}>{item.itemName}</Text>
                <Text style={styles.expiryText}>{format(expiry, 'MMM do, yyyy')}</Text>
                <Text style={[styles.daysLeft, { color }]}>
                    {daysLeft < 0
                        ? `Expired ${Math.abs(daysLeft)} day(s) ago`
                        : `Expires in ${daysLeft} day(s)`}
                </Text>
                <Text style={styles.barcode}>Barcode: {item.barcode}</Text>
                <View style={styles.progressBarContainer}>
                    <View
                        style={[
                            styles.progressBar,
                            { width: `${progress * 100}%`, backgroundColor: color },
                        ]}
                    />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// 🔹 Main Screen
const SmartTipsScreen = () => {
    const navigation = useNavigation();
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('expiringSoon');
    const [userId, setUserId] = useState(null);

    const fetchItems = useCallback(async () => {
        try {
            if (!userId) return;
            setLoading(true);
            const allItems = await getUserBarcodeItems(userId);
            setItems(allItems);
        } catch (e) {
            console.error('Fetch error:', e);
            Alert.alert('Error', 'Failed to fetch items');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        fetchItems().finally(() => setRefreshing(false));
    }, [fetchItems]);

    useFocusEffect(
        useCallback(() => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUserId(currentUser.uid);
                fetchItems();
            }
        }, [fetchItems])
    );

    useEffect(() => {
        const now = new Date();
        const filtered = items.filter(item => {
            if (!item.expiryDate) return false;
            const expiryDate = item.expiryDate.toDate();
            const diff = (expiryDate - now) / (1000 * 60 * 60 * 24);
            if (selectedFilter === 'all') return true;
            if (selectedFilter === 'expired') return diff < 0;
            return diff >= 0 && diff <= 3;
        });
        setFilteredItems(filtered);
    }, [items, selectedFilter]);

    const handleAction = (item) => {
        Alert.alert(item.itemName, 'What would you like to do?', [
            {
                text: 'Use in Recipe',
                onPress: () => navigation.navigate('MakeRecipe', { ingredients: [item.itemName] }),
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteBarcodeItem(item.id);
                        fetchItems();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete item');
                    }
                },
            },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const renderItem = ({ item }) => (
        <ExpiringItemCard item={item} onPress={() => handleAction(item)} />
    );

    const tips = useMemo(() => {
        if (!items.length) return [];
        const expiringItems = items.filter(item => {
            if (!item.expiryDate) return false;
            const daysLeft = (item.expiryDate.toDate() - new Date()) / (1000 * 60 * 60 * 24);
            return daysLeft < 3 && daysLeft >= 0;
        });

        if (!expiringItems.length) {
            return ['All your items are fresh! Keep up the good organization.'];
        }

        return expiringItems.map(item => {
            const daysLeft = Math.ceil((item.expiryDate.toDate() - new Date()) / (1000 * 60 * 60 * 24));
            return `• Your ${item.itemName} expires in ${daysLeft} day(s) - perfect for soups or stir fries!`;
        });
    }, [items]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Smart Tips</Text>
                    <View style={styles.headerRightSpacer} />

                    <Animated.View style={styles.fabContainer}>

                        <TouchableOpacity
                            style={styles.fab}
                            onPress={() => navigation.navigate('BarcodeScanner')}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="barcode-outline" size={28} color="#fff" />
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <SegmentedButtons
                    value={selectedFilter}
                    onValueChange={setSelectedFilter}
                    buttons={[
                        {
                            value: 'expiringSoon',
                            label: 'Expiring Soon',
                            icon: 'clock-alert-outline',
                            style: selectedFilter === 'expiringSoon' ? styles.activeSegment : null
                        },
                        {
                            value: 'all',
                            label: 'All Items',
                            icon: 'format-list-bulleted',
                            style: selectedFilter === 'all' ? styles.activeSegment : null
                        },
                        {
                            value: 'expired',
                            label: 'Expired',
                            icon: 'alert-circle-outline',
                            style: selectedFilter === 'expired' ? styles.activeSegment : null
                        },
                    ]}
                    style={styles.segment}
                />

                <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={[COLORS.primary]}
                            tintColor={COLORS.primary}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="ios-information-circle-outline" size={48} color={COLORS.gray} />
                            <Text style={styles.emptyText}>
                                {loading ? 'Loading...' : 'No items found'}
                            </Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                />

                {tips.length > 0 && (
                    <View style={styles.tipsSection}>
                        <Text style={styles.tipTitle}>Smart Suggestions</Text>
                        {tips.map((tip, idx) => (
                            <Text key={idx} style={styles.tipText}>{tip}</Text>
                        ))}
                    </View>
                )}


            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingBottom: 100, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerRightSpacer: {
    width: 28,
  },
  segment: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  activeSegment: {
    backgroundColor: COLORS.primaryLight,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: COLORS.dark,
  },
  expiryText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 2,
  },
  daysLeft: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  barcode: {
    fontSize: 12,
    color: COLORS.lightGray,
    fontFamily: 'monospace',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.lightestGray,
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  listContent: {
    paddingBottom: 160,
  },
  tipsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.primaryLightest,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 6,
    lineHeight: 20,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    zIndex: 100,
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default SmartTipsScreen;
