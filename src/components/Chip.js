import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../theme';

export default function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.active]}> 
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
  },
  active: { backgroundColor: `${theme.colors.primary}11` },
  text: { color: theme.colors.primary, fontWeight: '600' },
  activeText: { color: theme.colors.primary },
});

