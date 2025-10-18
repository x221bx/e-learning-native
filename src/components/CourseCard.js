import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import RatingStars from './RatingStars';
import { useSelector } from 'react-redux';
import CardIcons from './CardIcons';

export function CourseCardHorizontal({ course, onPress }) {
  const colors = useColors();
  const enrolledIds = useSelector((s) => s.user.enrolled);
  const isEnrolled = enrolledIds.includes(course.id);
  return (
    <TouchableOpacity
      style={[styles.hCard, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: course.thumbnail }} style={styles.hImage} resizeMode="cover" />
        {course.bestSeller && (
          <LinearGradient
            colors={[theme.colors.secondary, '#FF8BA7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.badge, { zIndex: 5 }]}
          >
            <Ionicons name="trophy-outline" size={14} color="#fff" style={{ marginEnd: 6 }} />
            <Text style={styles.badgeText}>{require('../i18n').t('best_seller') || 'Best-seller'}</Text>
          </LinearGradient>
        )}
        <View style={styles.overlay} pointerEvents="none" />
      </View>
      <View style={styles.hCardContent}>
        <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>{course.title}</Text>
        <Text style={[styles.author, { color: colors.muted }]} numberOfLines={1}>{course.author}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.price}>${course.price}</Text>
          <RatingStars rating={course.rating} reviews={course.reviews} size={12} />
        </View>
      </View>
      <View style={{ paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm }}>
        <CardIcons course={course} />
      </View>
    </TouchableOpacity>
  );
}

export function CourseCardVertical({ course, onPress, showBookmark }) {
  const colors = useColors();
  const enrolledIds = useSelector((s) => s.user.enrolled);
  const isEnrolled = enrolledIds.includes(course.id);
  return (
    <TouchableOpacity
      style={[styles.vCard, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.vImageContainer}>
        <Image source={{ uri: course.thumbnail }} style={styles.vImage} resizeMode="cover" />
      </View>
      <View style={styles.vCardContent}>
        <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>{course.title}</Text>
        <Text style={[styles.author, { color: colors.muted }]} numberOfLines={1}>{course.author}</Text>
        <View style={styles.vMetaRow}>
          <View style={styles.lessonBadge}>
            <Ionicons name="play-circle-outline" size={14} color={theme.colors.primary} />
            <Text style={styles.lessonText}>{course.lessons} {require('../i18n').t('lessons') || 'lessons'}</Text>
          </View>
          <Text style={styles.price}>${course.price}</Text>
        </View>
        <View style={styles.ratingRow}>
          <RatingStars rating={course.rating} size={12} />
          <Text style={styles.reviewCount}>({course.reviews})</Text>
        </View>
      </View>
      <View style={{ alignSelf: 'stretch', paddingStart: 0, paddingTop: theme.spacing.xs }}>
        <CardIcons course={course} small />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Horizontal Card Styles
  hCard: {
    width: 240,
    marginEnd: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...theme.shadow.card,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  hImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  hCardContent: {
    padding: theme.spacing.md,
  },
  badge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    ...theme.shadow.sm,
  },
  badgeText: {
    color: '#fff',
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
  },
  favBtn: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 6,
    borderRadius: theme.radius.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },

  // Vertical Card Styles
  vCard: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadow.card,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  vImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    marginEnd: theme.spacing.md,
  },
  vImage: {
    width: '100%',
    height: '100%',
  },
  bookmark: {
    position: 'absolute',
    right: theme.spacing.sm,
    top: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 6,
    borderRadius: theme.radius.sm,
    ...theme.shadow.sm,
  },
  cartBtnSmall: {
    position: 'absolute',
    left: theme.spacing.sm,
    top: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 6,
    borderRadius: theme.radius.sm,
    ...theme.shadow.sm,
  },
  vCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // Common Styles
  title: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    lineHeight: 22,
  },
  author: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium,
  },
  price: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.extrabold,
  },
  vMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  lessonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  lessonText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginStart: 4,
    fontWeight: theme.fontWeight.medium,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  reviewCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted,
    marginStart: 4,
    fontWeight: theme.fontWeight.medium,
  },
});

export default { CourseCardHorizontal, CourseCardVertical };

