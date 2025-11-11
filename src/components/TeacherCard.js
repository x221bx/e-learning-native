import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../theme/hooks';
import RatingStars from './RatingStars';

export default function TeacherCard({ teacher, onPress, variant = 'grid' }) {
  const colors = useColors();
  const isList = variant === 'list';
  return (
    <TouchableOpacity
      style={[
        isList ? styles.cardList : styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: teacher.avatar }} style={isList ? styles.avatarList : styles.avatar} />
      <View style={isList ? styles.listBody : null}>
        <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>{teacher.name}</Text>
        <Text numberOfLines={1} style={[styles.title, { color: colors.muted }]}>{teacher.title}</Text>
        {!isList && teacher.rating ? <RatingStars rating={teacher.rating} /> : null}
        {teacher.bio ? <Text numberOfLines={2} style={[styles.bio, { color: colors.muted }]}>{teacher.bio}</Text> : null}
      </View>
      {isList ? (
        <View style={{ marginLeft: 8 }}>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    ...theme.shadow.sm,
  },
  cardList: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    ...theme.shadow.xs,
  },
  avatar: { width: 72, height: 72, borderRadius: 18, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)' },
  avatarList: { width: 72, height: 72, borderRadius: 12, marginRight: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)' },
  listBody: { flex: 1 },
  name: { fontSize: 15, fontWeight: '800', color: theme.colors.text },
  title: { fontSize: 13, color: theme.colors.muted, marginTop: 4 },
  bio: { fontSize: 12, marginTop: 6, lineHeight: 16 },
});
