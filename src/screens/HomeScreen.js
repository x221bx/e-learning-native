import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';

import ScreenContainer from '../components/layout/ScreenContainer';
import theme from '../theme';
import { useColors, withOpacity } from '../theme/hooks';
import { categories, instructors } from '../mock/data';
import SectionHeader from '../components/SectionHeader';
import { CourseCardVertical } from '../components/CourseCard';
import CategoryGrid from '../components/CategoryGrid';
import CourseSection from '../components/CourseSection';
import TeacherSection from '../components/TeacherSection';
import BannerPromo from '../components/BannerPromo';
import { t } from '../i18n';
import { CoursesAPI } from '../services/api';
import config from '../config';
import { loadWishlist } from '../store/slices/wishlistSlice';
import { goToMessages, goToProfile, openDrawer } from '../utils/nav';

function QuickActionCard({ icon, label, accentColor, onPress, badge }) {
  const colors = useColors();
  const accent = accentColor || colors.primary;
  return (
    <TouchableOpacity
      style={styles.quickAction}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <LinearGradient
        colors={[withOpacity(accent, 0.28), withOpacity(accent, 0.08)]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.quickActionInner}>
        <View style={[styles.quickIconWrap, { backgroundColor: withOpacity(accent, 0.22) }]}> 
          <Ionicons name={icon} size={22} color="#fff" />
        </View>
        <Text style={[styles.quickLabel, { color: colors.text }]} numberOfLines={2}>
          {label}
        </Text>
        {typeof badge === 'number' && badge > 0 ? (
          <View style={[styles.quickBadge, { backgroundColor: colors.danger }]}>
            <Text style={styles.quickBadgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

function HeroCard({ name, avatarUri, onOpenDrawer, onContinue, onProfile, onMessages }) {
  const colors = useColors();
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.hero}
    >
      <View style={styles.heroTopRow}>
        <TouchableOpacity
          onPress={onOpenDrawer}
          style={[styles.heroIconButton, { backgroundColor: withOpacity('#ffffff', 0.16) }]}
          accessibilityLabel={t('open_menu') || 'Open navigation'}
          accessibilityRole="button"
        >
          <Ionicons name="menu" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onMessages}
          style={[styles.heroIconButton, { backgroundColor: withOpacity('#ffffff', 0.16) }]}
          accessibilityLabel={t('messages') || 'Messages'}
          accessibilityRole="button"
        >
          <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.heroBody}>
        <Image
          source={{ uri: avatarUri || 'https://i.pravatar.cc/150?img=5' }}
          style={styles.heroAvatar}
        />
        <View style={{ flex: 1, marginLeft: theme.spacing.base }}>
          <Text style={styles.heroGreeting}>{t('hello_name', { name }) || `Hello ${name}`}</Text>
          <Text style={styles.heroHeadline}>{t('keep_learning') || 'Keep learning today'}</Text>
          <Text style={styles.heroCopy} numberOfLines={2}>
            {t('home_hero_copy') || 'Pick up a saved course or explore something entirely new.'}
          </Text>
        </View>
      </View>
      <View style={styles.heroActions}>
        <TouchableOpacity
          onPress={onContinue}
          style={[styles.heroAction, { backgroundColor: withOpacity('#ffffff', 0.18) }]}
          accessibilityRole="button"
        >
          <Ionicons name="play-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.heroActionText}>{t('continue_learning') || 'Continue learning'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onProfile}
          style={[styles.heroAction, { backgroundColor: withOpacity('#ffffff', 0.12) }]}
          accessibilityRole="button"
        >
          <Ionicons name="person-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.heroActionText}>{t('view_profile') || 'View profile'}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

export default function HomeScreen({ navigation }) {
  const colors = useColors();
  const [popular, setPopular] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const user = useSelector((s) => s.user.user);
  const favIds = useSelector((s) => s.favorites.ids);
  const wishlistItems = useSelector((s) => s.wishlist.items);
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const hasUnread = useSelector((s) => s.ui.hasUnread);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadWishlist());
  }, [dispatch]);

  const badgeCount = wishlistItems.length || favIds.length;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await CoursesAPI.list({ offset, limit: config.PAGE_SIZE });
      const items = res.items || [];
      setPopular((prev) => [...prev, ...items]);
      setOffset((prev) => prev + items.length);
      setHasMore(Boolean(res.hasMore));
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [offset, loading, hasMore]);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCourse = (c) => navigation.navigate('CourseDetails', { courseId: c.id });
  const onTeacher = (tch) => navigation.navigate('TeacherProfile', { teacherId: tch.id });

  const name = (user?.name && String(user.name).trim()) || 'Learner';
  const avatarUri = user?.avatar || 'https://i.pravatar.cc/100?img=5';

  const quickActions = [
    {
      key: 'courses',
      icon: 'book',
      label: t('my_courses') || 'My courses',
      accentColor: colors.primary,
      onPress: () => navigation.navigate('MyCourses'),
    },
    {
      key: 'wishlist',
      icon: 'heart',
      label: t('saved') || 'Wishlist',
      accentColor: colors.secondary,
      badge: badgeCount,
      onPress: () => navigation.navigate('Profile'),
    },
    {
      key: 'profile',
      icon: 'person',
      label: t('profile') || 'Profile',
      accentColor: colors.accent,
      onPress: () => goToProfile(navigation),
    },
  ];

  if (isAuthenticated) {
    quickActions.unshift({
      key: 'messages',
      icon: 'chatbubble',
      label: t('messages') || 'Messages',
      accentColor: colors.info,
      badge: hasUnread ? 1 : 0,
      onPress: () => goToMessages(navigation),
    });
  }

  return (
    <ScreenContainer
      contentContainerStyle={styles.content}
      scrollProps={{ bounces: true }}
    >
      <HeroCard
        name={name}
        avatarUri={avatarUri}
        onOpenDrawer={() => openDrawer(navigation)}
        onContinue={() => navigation.navigate('MyCourses')}
        onProfile={() => goToProfile(navigation)}
        onMessages={() => goToMessages(navigation)}
      />

      <View style={styles.quickRow}>
        {quickActions.map((action) => (
          <QuickActionCard key={action.key} {...action} />
        ))}
      </View>

      <View style={styles.section}>
        <BannerPromo
          titleTop="PROJECT MANAGEMENT"
          titleMain="20% OFF"
          ctaLabel={t('view_more')}
          image={{ uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=60' }}
          onPress={() => navigation.navigate('Search')}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title={t('categories')} onPress={() => {}} />
        <CategoryGrid
          items={categories}
          onPressCategory={(c) => navigation.navigate('SearchResults', { category: c.id })}
        />
      </View>

      <View style={styles.section}>
        <CourseSection
          title={t('popular_courses')}
          data={popular}
          onPressItem={onCourse}
          onEndReached={loadMore}
          hasMore={hasMore}
          loading={loading}
        />
      </View>

      <View style={styles.section}>
        <CourseSection
          title={t('recommended_for_you')}
          data={popular.slice(0, 3)}
          onPressItem={onCourse}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title={t('course_inspires')} onPress={() => {}} />
        <View style={styles.verticalList}>
          {popular.map((c) => (
            <CourseCardVertical
              key={`${c.id}-vertical`}
              course={c}
              onPress={() => onCourse(c)}
              showBookmark
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TeacherSection data={instructors} onMore={() => {}} onTeacherPress={onTeacher} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xl,
  },
  hero: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    ...theme.shadow.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.base,
  },
  heroBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: withOpacity('#ffffff', 0.5),
  },
  heroGreeting: {
    color: withOpacity('#ffffff', 0.85),
    fontSize: theme.fontSize.sm,
    marginBottom: 4,
  },
  heroHeadline: {
    color: '#fff',
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.extrabold,
  },
  heroCopy: {
    color: withOpacity('#ffffff', 0.85),
    marginTop: 6,
    maxWidth: '90%',
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  heroAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.lg,
  },
  heroActionText: {
    color: '#fff',
    fontWeight: theme.fontWeight.bold,
  },
  heroIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  quickAction: {
    flex: 1,
    minWidth: 140,
    maxWidth: '48%',
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  quickActionInner: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.lg,
  },
  quickIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickLabel: {
    fontWeight: theme.fontWeight.semibold,
    fontSize: theme.fontSize.md,
  },
  quickBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: theme.spacing.sm,
  },
  quickBadgeText: {
    color: '#fff',
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.sm,
  },
  section: {
    gap: theme.spacing.sm,
  },
  verticalList: {
    gap: theme.spacing.sm,
  },
});
