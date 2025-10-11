import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerActions } from '@react-navigation/native';
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

  const user = null; // Auth removed
  const favIds = useSelector((s) => s.favorites.ids);
  const wishlistItems = useSelector((s) => s.wishlist.items);
  const isAuthenticated = true; // Always treat as authenticated (no auth layer)
  const dispatch = useDispatch();
  const darkMode = useSelector((s) => s.ui.darkMode);
  const hasUnread = useSelector((s) => s.ui.hasUnread);

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

  const onCourse = (c) => navigation.navigate('CourseDetails', { courseId: c.id });
  const onTeacher = (tch) => navigation.navigate('TeacherProfile', { teacherId: tch.id });

  const name = 'Learner';
  const avatarUri = 'https://i.pravatar.cc/100?img=5';

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }] }>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} bounces>
        {/* Header with Gradient */}
        <LinearGradient
          colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>{t('hello_name', { name })} 👋</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('what_to_learn')}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={[styles.iconButton, { marginRight: 12 }]}
                onPress={() => openDrawer(navigation)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.8}
              >
                <Ionicons name="menu" size={22} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => { dispatch(setUnread(false)); goToMessages(navigation); }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.8}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={22} color="#fff" />
                {(badgeCount > 0 || hasUnread) && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badgeCount || '•'}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={[styles.iconButton, { marginLeft: 12 }]}
                onPress={() => dispatch(setDarkMode(!darkMode))}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.8}
              > 
                <Ionicons name={darkMode ? 'sunny' : 'moon'} size={22} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => goToProfile(navigation)} activeOpacity={0.8}>
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Banner Promo */}
        <View style={styles.bannerContainer}>
          <BannerPromo
            titleTop="PROJECT MANAGEMENT"
            titleMain="20% OFF"
            ctaLabel={t('view_more')}
            image={{ uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=60' }}
            onPress={() => navigation.navigate('Search')}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <SectionHeader title={t('categories')} onPress={() => {}} />
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

        {/* Recommended */}
        <View style={styles.section}>
          <CourseSection title={t('recommended_for_you')} data={popular.slice(0, 3)} onPressItem={onCourse} />
        </View>

        {/* Course that inspires */}
        <View style={styles.section}>
          <SectionHeader title={t('course_inspires')} onPress={() => {}} />
          <View style={styles.verticalList}>
            {popular.map((c) => (
              <CourseCardVertical key={c.id + '-v'} course={c} onPress={() => onCourse(c)} showBookmark />
            ))}
          </View>
        </View>

        {/* Teachers */}
        <View style={styles.section}>
          <TeacherSection data={instructors} onMore={() => {}} onTeacherPress={onTeacher} />
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
    borderBottomLeftRadius: theme.radius.xxl,
    borderBottomRightRadius: theme.radius.xxl,
    ...theme.shadow.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    color: '#fff',
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.extrabold,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  badgeText: {
    color: '#fff',
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
  },
  notificationDot: {
    minWidth: 10,
    height: 10,
    padding: 0,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  bannerContainer: {
    paddingHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  verticalList: {
    marginTop: theme.spacing.sm,
  },
});
