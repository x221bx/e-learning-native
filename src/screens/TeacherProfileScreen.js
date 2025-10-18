import React from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { instructors, courses } from '../mock/data';
import { CourseCardHorizontal } from '../components/CourseCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TeacherProfileScreen({ route, navigation }) {
  const id = route?.params?.teacherId || 't1';
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const teacher = instructors.find((t) => t.id === id) || instructors[0];
  const teacherCourses = courses.filter((c) => c.teacherId === teacher.id);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => navigation.goBack()} style={styles.backBtn} />
          <Text style={styles.headerTitle}>{teacher.name}</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <ImageBackground source={{ uri: teacher.banner }} style={styles.banner}>
          <View style={styles.overlay} />
          <View style={styles.profileRow}>
            <Image source={{ uri: teacher.avatar }} style={styles.avatar} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>{teacher.name}</Text>
              <Text style={styles.role}>Teacher</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={{ padding: 20 }}>
          <Text style={[styles.section, { color: colors.text }]}>UI/UX Design</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
            {teacherCourses.map((c) => (
              <CourseCardHorizontal key={c.id} course={c} onPress={() => navigation.navigate('CourseDetails', { courseId: c.id })} />
            ))}
          </ScrollView>

          <Text style={[styles.section, { color: colors.text }]}>Graphic Design</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
            {courses.map((c) => (
              <CourseCardHorizontal key={c.id + '-g'} course={c} onPress={() => navigation.navigate('CourseDetails', { courseId: c.id })} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: theme.fontSize.lg,
    fontWeight: '800',
  },
  banner: { height: 170, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  profileRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: '#fff' },
  name: { color: '#fff', fontWeight: '800', fontSize: 16 },
  role: { color: '#fff', opacity: 0.9, marginTop: 4 },
  section: { fontWeight: '700', color: theme.colors.text, marginTop: 16 },
});
