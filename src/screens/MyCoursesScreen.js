import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import { useColors, withOpacity, mix } from '../theme/hooks';
import { courses } from '../mock/data';
import ProgressBar from '../components/ProgressBar';
import BannerPromo from '../components/BannerPromo';
import { useSelector } from 'react-redux';
import Tabs from '../components/Tabs';
import ScreenContainer from '../components/layout/ScreenContainer';
import { t } from '../i18n';

function CourseProgressCard({ course }) {
  const colors = useColors();
  return (
    <View style={[styles.enrollItem, { backgroundColor: colors.card, borderColor: withOpacity(colors.primary, 0.1) }]}> 
      <Image source={{ uri: course.thumbnail }} style={styles.enrollImg} />
      <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
        <Text style={[styles.enrollTitle, { color: colors.text }]} numberOfLines={2}>{course.title}</Text>
        <Text style={[styles.enrollMeta, { color: colors.muted }]}>3 hrs 25 mins</Text>
        <Text style={[styles.enrollMeta, { color: colors.muted }]}>{course.progress}% {t('completed') || 'Complete'}</Text>
        <ProgressBar progress={course.progress} />
      </View>
    </View>
  );
}

export default function MyCoursesScreen() {
  const [tab, setTab] = useState('ALL');
  const colors = useColors();
  const enrolledIds = useSelector((s) => s.user.enrolled);
  const enrolled = courses
    .filter((c) => enrolledIds.includes(c.id))
    .map((c, i) => ({ ...c, progress: [30, 70, 100, 50][i % 4] }));

  const filtered = useMemo(() => {
    if (tab === 'COMPLETED') return enrolled.filter((c) => c.progress >= 100);
    if (tab === 'ON GOING') return enrolled.filter((c) => c.progress > 0 && c.progress < 100);
    return enrolled;
  }, [enrolled, tab]);

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <LinearGradient
        colors={[mix(colors.primary, -0.15), mix(colors.primary, 0.25)]}
        style={styles.summaryCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.summaryTitle}>{t('learning_journey') || 'Your learning journey'}</Text>
        <Text style={styles.summarySubtitle}>
          {t('learning_journey_subtitle') || 'Track progress, resume courses and celebrate your milestones.'}
        </Text>
        <View style={styles.summaryStats}>
          <View style={styles.summaryStatBox}>
            <Text style={styles.summaryStatValue}>{enrolled.length}</Text>
            <Text style={styles.summaryStatLabel}>{t('enrolled') || 'Enrolled'}</Text>
          </View>
          <View style={styles.summaryStatBox}>
            <Text style={styles.summaryStatValue}>{filtered.filter((c) => c.progress >= 100).length}</Text>
            <Text style={styles.summaryStatLabel}>{t('completed') || 'Completed'}</Text>
          </View>
          <View style={styles.summaryStatBox}>
            <Text style={styles.summaryStatValue}>{filtered.filter((c) => c.progress > 0 && c.progress < 100).length}</Text>
            <Text style={styles.summaryStatLabel}>{t('on_going') || 'On going'}</Text>
          </View>
        </View>
      </LinearGradient>

      <BannerPromo
        titleTop="Courses that boost your career!"
        ctaLabel={t('view_more') || 'Check Now'}
        image={{ uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=60' }}
        bgColor="#F6C73B"
      />

      <Tabs items={['ALL', 'ON GOING', 'COMPLETED']} value={tab} onChange={setTab} />

      {filtered.length === 0 ? (
        <Text style={{ color: colors.muted }}>{t('no_enrolled_courses') || 'No enrolled courses yet'}</Text>
      ) : (
        <View style={{ gap: theme.spacing.sm }}>
          {filtered.map((c) => (
            <CourseProgressCard key={c.id} course={c} />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
  },
  summaryCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    gap: theme.spacing.base,
  },
  summaryTitle: {
    color: '#fff',
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
  },
  summarySubtitle: {
    color: withOpacity('#ffffff', 0.85),
    fontSize: theme.fontSize.md,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.base,
  },
  summaryStatBox: {
    alignItems: 'center',
    flex: 1,
  },
  summaryStatValue: {
    color: '#fff',
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.extrabold,
  },
  summaryStatLabel: {
    color: withOpacity('#ffffff', 0.75),
    marginTop: 4,
  },
  tabs: { flexDirection: 'row', marginBottom: 10 },
  tab: { marginRight: 16, paddingVertical: 8, color: theme.colors.muted, borderBottomWidth: 2, borderBottomColor: 'transparent', fontWeight: '700' },
  tabActive: { color: theme.colors.primary, borderBottomColor: theme.colors.primary },
  enrollItem: {
    flexDirection: 'row',
    padding: theme.spacing.base,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  enrollImg: { width: 72, height: 72, borderRadius: theme.radius.md },
  enrollTitle: { fontWeight: '700' },
  enrollMeta: { fontSize: 12, marginTop: 4 },

});
