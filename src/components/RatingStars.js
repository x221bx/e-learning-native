import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

export default function RatingStars({ rating = 4.5, reviews }) {
  return (
    <View style={styles.row}>
      <Ionicons name="star" size={14} color={theme.colors.star} />
      <Text style={styles.text}> {rating.toFixed(1)}{reviews ? ` (${reviews})` : ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { fontSize: 12, color: theme.colors.muted, marginLeft: 2 },
});

