import React, { useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useColors } from '../theme/hooks';
import { instructors } from '../mock/data';
import TeacherCard from '../components/TeacherCard';
import SearchBar from '../components/SearchBar';
import theme from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../i18n';

export default function TeachersScreen({ navigation }) {
  const colors = useColors();
  const [q, setQ] = useState('');
  const [view, setView] = useState('grid'); // grid | list
  const subjects = Array.from(new Set(instructors.flatMap((i) => i.specialties || [])));
  const [activeSub, setActiveSub] = useState(null);
  const { width } = Dimensions.get('window');
  const numColumns = width > 600 ? 3 : 2;
  const paddingHorizontal = theme.spacing.base;
  const gap = theme.spacing.base;
  const itemWidth = (width - 2 * paddingHorizontal - gap * (numColumns - 1)) / numColumns;
  const list = useMemo(() => {
    const s = (q || '').toLowerCase();
    return instructors.filter((t) => (
      (!s || t.name?.toLowerCase().includes(s) || t.title?.toLowerCase().includes(s) || (t.bio || '').toLowerCase().includes(s))
    ) && (!activeSub || (t.specialties || []).includes(activeSub)));
  }, [q, activeSub]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingHorizontal: theme.spacing.base, paddingTop: theme.spacing.base }}>
        <SearchBar value={q} onChangeText={setQ} onSubmit={() => { }} />
        <View style={{ flexDirection: 'row', marginTop: theme.spacing.md, alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'center' }}>
            <Text style={{ fontWeight: '700', color: colors.text }}>{list.length} {t('teachers') || 'Teachers'}</Text>
            <View style={{ width: 12 }} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {subjects.slice(0, 6).map((s) => (
                <TouchableOpacity key={s} onPress={() => setActiveSub((v) => v === s ? null : s)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: activeSub === s ? colors.primary : colors.card, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ color: activeSub === s ? '#fff' : colors.muted, fontWeight: '700' }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity onPress={() => setView('grid')} style={{ padding: 8 }}>
              <Ionicons name="grid-outline" size={20} color={view === 'grid' ? colors.primary : colors.muted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setView('list')} style={{ padding: 8 }}>
              <Ionicons name="list-outline" size={20} color={view === 'list' ? colors.primary : colors.muted} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {view === 'grid' ? (
        <FlatList
          key={view}
          style={{ paddingHorizontal: paddingHorizontal }}
          data={list}
          keyExtractor={(t) => t.id}
          numColumns={numColumns}
          columnWrapperStyle={{ gap: gap }}
          renderItem={({ item }) => (
            <View style={{ width: itemWidth, marginBottom: gap }}>
              <TeacherCard teacher={item} variant="grid" onPress={() => navigation.navigate('TeacherProfile', { teacherId: item.id })} />
            </View>
          )}
        />
      ) : (
        <FlatList
          key={view}
          style={{ padding: theme.spacing.base }}
          data={list}
          keyExtractor={(t) => t.id}
          numColumns={1}
          renderItem={({ item }) => (
            <TeacherCard teacher={item} variant="list" onPress={() => navigation.navigate('TeacherProfile', { teacherId: item.id })} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

