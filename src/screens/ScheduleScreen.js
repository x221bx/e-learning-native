import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColors } from '../theme/hooks';
import theme from '../theme';
import { t } from '../i18n';

const STORAGE_KEY = '@elearning_schedule';

export default function ScheduleScreen() {
  const colors = useColors();
  const [items, setItems] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        setItems(list);
      } catch {}
    })();
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {items.length === 0 ? (
        <Text style={{ color: colors.muted }}>{t('no_events') || 'No events scheduled'}</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i, idx) => i.id || String(idx)}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <Ionicons name="calendar" size={14} color={colors.primary} />
                <Text style={{ marginLeft: 6, color: colors.muted }}>{item.date} • {item.time}</Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.base },
  card: { borderWidth: 1, borderRadius: theme.radius.lg, padding: 12 },
  title: { fontWeight: '700' },
});

