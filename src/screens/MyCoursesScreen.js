import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { courses } from '../mock/data';
import ProgressBar from '../components/ProgressBar';
import BannerPromo from '../components/BannerPromo';
import { useSelector, useDispatch } from 'react-redux';
import { setUnread } from '../store/uiSlice';
import Tabs from '../components/Tabs';

export default function MyCoursesScreen() {
  const [tab, setTab] = useState('ALL');
  const colors = useColors();
  const dispatch = useDispatch();
  const enrolledIds = useSelector((s) => s.user.enrolled);
  const enrolled = courses
    .filter((c) => enrolledIds.includes(c.id))
    .map((c, i) => ({ ...c, progress: [30, 70, 100, 50][i % 4] }));

  // Clear unread notifications when viewing courses
  useEffect(() => {
    dispatch(setUnread(false));
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (tab === 'COMPLETED') return enrolled.filter((c) => c.progress >= 100);
    if (tab === 'ON GOING') return enrolled.filter((c) => c.progress > 0 && c.progress < 100);
    return enrolled;
  }, [enrolled, tab]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background, flexGrow: 1 }]}>
      <BannerPromo
        titleTop="Courses that boost your career!"
        ctaLabel="Check Now"
        image={{ uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=60' }}
        bgColor="#F6C73B"
      />

      <Tabs items={['ALL', 'ON GOING', 'COMPLETED']} value={tab} onChange={setTab} />

      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No enrolled courses yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
            Purchase courses from the store to start learning
          </Text>
        </View>
      ) : (
        filtered.map((c) => (
          <View key={c.id} style={[styles.enrollItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Image source={{ uri: c.thumbnail }} style={styles.enrollImg} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.enrollTitle, { color: colors.text }]}>{c.title}</Text>
              <Text style={[styles.enrollMeta, { color: colors.muted }]}>3 hrs 25 mins</Text>
              <Text style={[styles.enrollMeta, { color: colors.muted }]}>{c.progress}% Complete</Text>
              <ProgressBar progress={c.progress} />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  tabs: { flexDirection: 'row', marginBottom: 10 },
  tab: { marginRight: 16, paddingVertical: 8, color: theme.colors.muted, borderBottomWidth: 2, borderBottomColor: 'transparent', fontWeight: '700' },
  tabActive: { color: theme.colors.primary, borderBottomColor: theme.colors.primary },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  enrollItem: { flexDirection: 'row', padding: 12, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, backgroundColor: '#fff', marginBottom: 10 },
  enrollImg: { width: 70, height: 70, borderRadius: 10 },
  enrollTitle: { fontWeight: '700', color: theme.colors.text },
  enrollMeta: { color: theme.colors.muted, fontSize: 12, marginTop: 4 },

});
