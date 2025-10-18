import React from 'react';
import { View, StyleSheet } from 'react-native';
import Chip from './Chip';

export default function ChipGroup({ items = [], value, onChange }) {
  return (
    <View style={styles.wrap}>
      {items.map((t) => (
        <Chip key={t} label={t} active={t === value} onPress={() => onChange?.(t)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
});

