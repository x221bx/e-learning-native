import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../theme';
import { useColors } from '../theme/hooks';

export default function TeacherCard({ teacher, onPress }) {
  const colors = useColors();
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: teacher.avatar }} style={styles.avatar} />
      <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>{teacher.name}</Text>
      <Text numberOfLines={1} style={[styles.title, { color: colors.muted }]}>{teacher.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  avatar: { width: 72, height: 72, borderRadius: 36, marginBottom: 8 },
  name: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  title: { fontSize: 12, color: theme.colors.muted, marginTop: 2 },
});
