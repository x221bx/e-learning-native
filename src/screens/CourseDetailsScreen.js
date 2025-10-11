import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { courses, instructors } from '../mock/data';
import RatingStars from '../components/RatingStars';
import HeaderCover from './course/HeaderCover';
import BottomBar from './course/BottomBar';

import Tabs from '../components/Tabs';


import { CoursesAPI } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { joinCourse, unjoinCourse } from '../store/userSlice';
import { toggleFavorite } from '../store/favoritesSlice';
import styles from './CourseDetails.styles';
import { goToMessages } from '../utils/nav';
import OverviewSection from './course/OverviewSection';
import LessonsSection from './course/LessonsSection';
import ReviewSection from './course/ReviewSection';

export default function CourseDetailsScreen({ route, navigation }) {
  const colors = useColors();
  const id = route?.params?.courseId || 'c2';
  const fallbackCourse = useMemo(() => courses.find((c) => c.id === id) || courses[0], [id]);
  const [course, setCourse] = useState(fallbackCourse);
  const [teacher, setTeacher] = useState(
    instructors.find((t) => t.id === fallbackCourse.teacherId) || instructors[0]
  );
  const [tab, setTab] = useState('OVERVIEW');
  const favIds = useSelector((s) => s.favorites.ids);
  const isBookmarked = favIds.includes(course?.id);
  const onToggleBookmark = () => dispatch(toggleFavorite(course.id));
  const enrolledIds = useSelector((s) => s.user.enrolled);
  const dispatch = useDispatch();
  const isEnrolled = enrolledIds.includes(course?.id);
  const isAuthenticated = true; // Auth removed

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await CoursesAPI.get(id);
        if (!mounted) return;
        setCourse(res);
        setTeacher(
          res.teacher || instructors.find((t) => t.id === res.teacherId) || instructors[0]
        );
      } catch (e) {
        // keep fallback
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >        <HeaderCover styles={styles} course={course} navigation={navigation} isBookmarked={isBookmarked} setIsBookmarked={onToggleBookmark} />        <View style={styles.infoCard}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.author}>{teacher.name}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={16} color={theme.colors.star} />
              <Text style={styles.metaText}>{course.rating}</Text>
              <Text style={styles.metaSubtext}>({course.reviews})</Text>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <Ionicons name="play-circle" size={16} color={theme.colors.primary} />
              <Text style={styles.metaText}>{course.lessons} {require('../i18n').t('lessons') || 'lessons'}</Text>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color={theme.colors.accent} />
              <Text style={styles.metaText}>12h 30m</Text>
            </View>
          </View>          <View style={styles.tabsContainer}>
            <Tabs items={[require('../i18n').t('overview') || 'OVERVIEW', require('../i18n').t('lessons_tab') || 'LESSONS', require('../i18n').t('review') || 'REVIEW']} value={tab} onChange={setTab} />
          </View>
        </View>        <View style={styles.contentContainer}>
          {tab === 'OVERVIEW' && <OverviewSection course={course} teacher={teacher} navigation={navigation} />}
          {tab === 'LESSONS' && <LessonsSection course={course} navigation={navigation} />} 
          {tab === 'REVIEW' && <ReviewSection course={course} /> }
        </View>
      </ScrollView>

      <BottomBar
        styles={styles}
        course={course}
        teacher={teacher}
        isEnrolled={isEnrolled}
        onJoin={() => dispatch(joinCourse(course.id))}
        onUnjoin={() => dispatch(unjoinCourse(course.id))}
        onMessage={() => goToMessages(navigation)}
      />
    </View>
  );
}
