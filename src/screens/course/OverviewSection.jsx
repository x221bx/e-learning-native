import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import { courses } from '../../mock/data';
import RatingStars from '../../components/RatingStars';
import { CourseCardHorizontal } from '../../components/CourseCard';
import { t } from '../../i18n';

export default function OverviewSection({ course, teacher, navigation }) {
  return (
    <View>
      <View style={styles.teacherRow}>
        <Image source={{ uri: teacher.avatar }} style={styles.teacherAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.teacherName}>{teacher.name}</Text>
          <Text style={styles.teacherRole}>{teacher.title}</Text>
        </View>
        <TouchableOpacity style={styles.followBtn}><Text style={styles.followText}>Follow</Text></TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>{t('description')}</Text>
      <Text style={styles.desc}>{course.description}</Text>

      <Text style={styles.sectionTitle}>{t('benefits')}</Text>
      {course.benefits?.map((b, i) => (
        <View key={b + i} style={styles.benefitRow}>
          <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
          <Text style={styles.benefitText}>{b}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>{t('similar_courses')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
        {courses.slice(0, 3).map((c) => (
          <CourseCardHorizontal key={c.id + '-sim'} course={c} onPress={() => navigation?.navigate?.('CourseDetails', { courseId: c.id })} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  teacherRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  teacherAvatar: { width: 46, height: 46, borderRadius: 23, marginRight: 10 },
  teacherName: { fontWeight: '700', color: theme.colors.text },
  teacherRole: { color: theme.colors.muted, marginTop: 2 },
  followBtn: { borderWidth: 1, borderColor: theme.colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  followText: { color: theme.colors.primary, fontWeight: '700' },
  sectionTitle: { fontWeight: '700', color: theme.colors.text, marginTop: 16, marginBottom: 6 },
  desc: { color: theme.colors.muted },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  benefitText: { marginLeft: 8, color: theme.colors.text },
});

