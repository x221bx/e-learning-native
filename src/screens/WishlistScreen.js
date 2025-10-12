import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { Ionicons } from '@expo/vector-icons';
import { courses } from '../mock/data';

export default function WishlistScreen({ navigation }) {
  const colors = useColors();
  const items = useSelector((s) => s.wishlist.items);
  const data = courses.filter((c) => items.includes(c.id));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      {data.length === 0 ? (
        <Text style={styles.empty}>Your wishlist is empty</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.row, { backgroundColor: colors.card }]} onPress={() => navigation.navigate('CourseDetails', { courseId: item.id })}>
              <Ionicons name="heart" size={18} color={colors.primary} style={{ marginRight: 10 }} />
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, padding: 12, borderRadius: 12 },
  title: { color: theme.colors.text, fontWeight: '700' },
  empty: { color: theme.colors.muted, fontStyle: 'italic' },
});
