import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '../theme';
import { useColors } from '../theme/hooks';

export default function ProgressBar({ progress = 0, height = 6 }) {
  const colors = useColors();
  return (
    <View style={[styles.bg, { height, backgroundColor: colors.border }]}> 
      <View style={[styles.fill, { width: `${progress}%`, height, backgroundColor: colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { backgroundColor: theme.colors.border, borderRadius: 999, overflow: 'hidden', marginTop: 8 },
  fill: { backgroundColor: theme.colors.primary },
});
