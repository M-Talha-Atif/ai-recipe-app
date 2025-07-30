import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { COLORS } from '../styles/common';

const { width } = Dimensions.get('window');

const tipsData = [
  {
    type: 'storage',
    emoji: '🥑',
    title: 'Avocado Hack',
    text: 'Store cut avocados with the pit to slow browning',
  },
  {
    type: 'alert',
    emoji: '⚠️',
    title: 'Expiring Soon',
    text: 'Your milk expires tomorrow - make pancakes!',
  },
  {
    type: 'fun',
    emoji: '🍞',
    title: 'Did You Know?',
    text: 'Bread lasts 3x longer in the freezer',
  },
  {
    type: 'usage',
    emoji: '🍌',
    title: 'Banana Bread',
    text: 'Overripe bananas? Perfect for banana bread!',
  },
  {
    type: 'motivation',
    emoji: '💰',
    title: 'Great Job!',
    text: "You've saved $24 this month by using expiring items!",
  },
];

const getGradient = (type) => {
  switch (type) {
    case 'storage':
      return ['#E0F7E9', '#B2F0C8'];
    case 'alert':
      return ['#FFE5E5', '#FFBABA'];
    case 'usage':
      return ['#FFF3E0', '#FFD59B'];
    case 'fun':
      return ['#E0F1FF', '#B2D4FF'];
    case 'motivation':
      return ['#F3E5F5', '#CE93D8'];
    default:
      return ['#fff', '#fff'];
  }
};

const TipsCarousel = () => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      carouselRef.current?.snapToNext?.();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }) => {
    const [bgFrom, bgTo] = getGradient(item.type);
    return (
      <TouchableOpacity activeOpacity={0.9} style={[styles.card, { backgroundColor: bgFrom }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <View style={styles.badgeContainer}>
          <Text style={[styles.badge, { backgroundColor: bgTo }]}>{item.type.toUpperCase()}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.carouselWrapper}>
      <Carousel
        layout="default"
        ref={carouselRef}
        data={tipsData}
        sliderWidth={width}
        itemWidth={width * 0.8}
        renderItem={renderItem}
        onSnapToItem={index => setActiveIndex(index)}
        loop
      />
      <Pagination
        dotsLength={tipsData.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.dot}
        inactiveDotOpacity={0.3}
        inactiveDotScale={0.7}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselWrapper: {
    marginTop: 12,
    marginBottom: 30,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  badge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#555',
  },
  paginationContainer: {
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
});

export default TipsCarousel;
