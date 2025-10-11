import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../theme/hooks';
import theme from '../theme';
import { t } from '../i18n';
import { courses } from '../mock/data';

export default function LiveNowScreen({ navigation }) {
  const colors = useColors();
  // Dummy live list: pick first few courses as "Live"
  const live = courses.slice(0, 3).map((c) => ({ ...c, viewers: Math.floor(Math.random() * 900) + 100 }));
  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <FlatList
        data={live}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.navigate('CourseDetails', { courseId: item.id })}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <Ionicons name="radio" size={14} color={colors.danger || theme.colors.danger} />
                <Text style={{ marginLeft: 6, color: colors.muted }}>{t('live_now') || 'Live now'} • {item.viewers} {t('viewers') || 'viewers'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.base },
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: theme.radius.lg, padding: 10 },
  thumb: { width: 80, height: 60, borderRadius: 8 },
  title: { fontWeight: '700' },
});

