import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// Drawer removed: no DrawerActions needed
import { openDrawer, goToMessages, goToProfile } from '../utils/nav';
import theme from '../theme';
import { useColors } from '../theme/hooks';
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
import { useSelector, useDispatch } from 'react-redux';
import { setDarkMode, setUnread } from '../store/uiSlice';
import { loadWishlist } from '../store/slices/wishlistSlice';

export default function HomeScreen({ navigation }) {
  const colors = useColors();
  const [popular, setPopular] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState([]);

  const user = useSelector((s) => s.user.user);
  const favIds = useSelector((s) => s.favorites.ids);
  const wishlistItems = useSelector((s) => s.wishlist.items);
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const dispatch = useDispatch();
  const darkMode = useSelector((s) => s.ui.darkMode);
  const hasUnread = useSelector((s) => s.ui.hasUnread);
  const enrolledIds = useSelector((s) => s.user.enrolled || []);

  useEffect(() => {
    // Load guest wishlist by default
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

  // derive unique lists: recommended & featured should not duplicate popular items
  const popularIds = new Set(popular.map((c) => c.id));
  const recommended = popular.filter((c, i) => i < 6).filter((c) => !popularIds.has(c.id)); // will be empty by default; we'll fallback below
  const recommendedFallback = popular.slice(0, 3);
  const finalRecommended = recommended.length ? recommended : recommendedFallback;

  // featured: take from a curated list or from popular but exclude duplicates
  useEffect(() => {
    // For demo/mock data we'll pick every 5th popular item as featured, excluding first page duplicates
    const picks = (popular || []).filter((c, i) => (i % 5 === 2)).slice(0, 4);
    const uniquePicks = picks.filter((p) => !popularIds.has(p.id));
    setFeatured(uniquePicks.length ? uniquePicks : (popular.slice(3, 7) || []));
  }, [popular]);

  const onCourse = (c) => navigation.navigate('CourseDetails', { courseId: c.id });
  const onTeacher = (tch) => navigation.navigate('TeacherProfile', { teacherId: tch.id });

  const name = (user?.name && String(user.name).trim()) || 'Learner';
  const avatarUri = user?.avatar || 'https://i.pravatar.cc/100?img=5';

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background, ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}) }]}>
      <ScrollView
        style={{ flex: 1, ...(Platform.OS === 'web' ? { minHeight: '100vh', overflow: 'auto' } : {}) }}
        contentContainerStyle={[styles.container, { flexGrow: 1, paddingBottom: theme.spacing.xxl }]}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* Hero Section - Combined Welcome and Banner */}
        <LinearGradient
          colors={[colors.primary, colors.primary + '80']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeTitle}>{t('welcome_back') || 'Welcome back'}</Text>
              <Text style={styles.welcomeSubtitle}>{name}!</Text>
              <Text style={styles.welcomeMessage}>{t('continue_learning') || 'Continue your learning journey'}</Text>
            </View>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          </View>

          {/* Quick Actions */}
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('MyCourses')}>
              <View style={{ position: 'relative' }}>
                <Ionicons name="library-outline" size={24} color="#fff" />
                {enrolledIds.length > 0 && (
                  <View style={styles.miniBadge}>
                    <Text style={styles.miniBadgeText}>{enrolledIds.length}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.statLabel}>{t('my_courses') || 'My Courses'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('Wishlist')}>
              <View style={{ position: 'relative' }}>
                <Ionicons name="heart-outline" size={24} color="#fff" />
                {wishlistItems.length > 0 && (
                  <View style={styles.miniBadge}>
                    <Text style={styles.miniBadgeText}>{wishlistItems.length}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.statLabel}>{t('wishlist') || 'Wishlist'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('Favorites')}>
              <View style={{ position: 'relative' }}>
                <Ionicons name="bookmark-outline" size={24} color="#fff" />
                {favIds.length > 0 && (
                  <View style={styles.miniBadge}>
                    <Text style={styles.miniBadgeText}>{favIds.length}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.statLabel}>{t('favorites') || 'Favorites'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('Schedule')}>
              <Ionicons name="calendar-outline" size={24} color="#fff" />
              <Text style={styles.statLabel}>{t('schedule') || 'Schedule'}</Text>
            </TouchableOpacity>
          </View>

          {/* Promo Banner inside hero */}
          <View style={styles.heroBanner}>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitleTop}>PROJECT MANAGEMENT</Text>
              <Text style={styles.promoTitleMain}>20% OFF</Text>
              <TouchableOpacity style={styles.promoButton} onPress={() => navigation.navigate('Search')}>
                <Text style={styles.promoButtonText}>{t('view_more') || 'View More'}</Text>
              </TouchableOpacity>
            </View>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=60' }} style={styles.promoImage} />
          </View>
        </LinearGradient>

        {/* Categories */}
        <View style={styles.section}>
          <SectionHeader title={t('categories')} onPress={() => navigation.navigate('Search')} />
          <CategoryGrid items={categories} onPressCategory={(c) => navigation.navigate('SearchResults', { category: c.id })} />
        </View>

        {/* Popular Courses */}
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

        {/* Featured / Inspiring courses (distinct subset) */}
        {featured && featured.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title={t('course_inspires')} onPress={() => navigation.navigate('Search')} />
            <View style={styles.horizontalList}>
              {featured.map((c) => (
                <CourseCardVertical key={c.id + '-feat'} course={c} onPress={() => onCourse(c)} showBookmark />
              ))}
            </View>
          </View>
        ) : null}

        {/* Teachers */}
        <View style={styles.section}>
          <TeacherSection data={instructors} onMore={() => navigation.navigate('Teachers')} onTeacherPress={onTeacher} />
        </View>

        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingBottom: theme.spacing.xl,
  },

  heroSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    marginHorizontal: theme.spacing.xl,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: theme.fontSize.sm,
    color: '#fff',
    opacity: 0.8,
    fontWeight: '500',
  },
  welcomeSubtitle: {
    fontSize: theme.fontSize.xl,
    color: '#fff',
    fontWeight: '800',
    marginTop: 4,
  },
  welcomeMessage: {
    fontSize: theme.fontSize.base,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginHorizontal: 4,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statNumber: {
    fontSize: theme.fontSize.xl,
    fontWeight: '800',
    marginTop: theme.spacing.xs,
    color: '#fff',
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    marginTop: 2,
    color: '#fff',
    opacity: 0.9,
  },
  miniBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  miniBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },

  heroBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  promoContent: {
    flex: 1,
  },
  promoTitleTop: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  promoTitleMain: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text,
    fontWeight: '800',
    marginTop: 4,
  },
  promoButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: theme.fontSize.sm,
  },
  promoImage: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.md,
  },
  section: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  verticalList: {
    marginTop: theme.spacing.sm,
  },
  horizontalList: {
    marginTop: theme.spacing.sm,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
});
