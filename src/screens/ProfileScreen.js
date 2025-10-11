import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { t } from '../i18n';
import { courses } from '../mock/data';
import { CourseCardVertical } from '../components/CourseCard';
import { useSelector, useDispatch } from 'react-redux';
import { setAdmin } from '../store/userSlice';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function ProfileScreen({ navigation }) {
  const colors = useColors();
  const favIds = useSelector((s) => s.favorites.ids);
  const isAdmin = useSelector((s) => s.user.isAdmin);
  const user = null; // Auth removed
  const isGuest = false; // No guest mode
  const dispatch = useDispatch();
  const favCourses = courses.filter((c) => favIds.includes(c.id));

  const handleLogout = () => {};

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header] }>
        <Image 
          source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=5' }} 
          style={styles.avatar} 
        />
        <Text style={[styles.name, { color: colors.text }]}>{user?.name || (t('guest_user') || 'Guest User')}</Text>
        <Text style={[styles.title, { color: colors.muted }]}>{(user?.role && t(user.role)) || (t('guest') || 'Guest')}</Text>
        {/* Auth removed: no login prompt */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{favCourses.length}</Text>
            <Text style={styles.statLabel}>{t('saved') || 'Saved'}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{user?.enrolledCourses?.length || 0}</Text>
            <Text style={styles.statLabel}>{t('enrolled') || 'Enrolled'}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{user?.completedCourses?.length || 0}</Text>
            <Text style={styles.statLabel}>{t('completed') || 'Completed'}</Text>
          </View>
        </View>
      </View>

      {/* Auth removed: no logout button */}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('saved_courses')}</Text>
      {favCourses.length === 0 && (
        <Text style={{ color: colors.muted }}>{t('no_favorites')}</Text>
      )}
      {favCourses.map((c) => (
        <CourseCardVertical 
          key={c.id + '-saved'} 
          course={c} 
          onPress={() => navigation.navigate('Home', { 
            screen: 'CourseDetails', 
            params: { courseId: c.id } 
          })} 
          showBookmark 
        />
      ))}

      <View style={{ height: 20 }} />
      
      {user?.role === 'admin' && (
        <>
          <Text style={styles.sectionTitle}>{t('admin')}</Text>
          <Text style={{ color: theme.colors.muted, marginBottom: 6 }}>
            {t('admin_mode') || 'Admin mode'}: {isAdmin ? (t('on') || 'ON') : (t('off') || 'OFF')}
          </Text>
          <TouchableOpacity onPress={() => dispatch(setAdmin(!isAdmin))}>
            <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>
              {t('toggle_admin_mode') || 'Toggle Admin Mode'}
            </Text>
          </TouchableOpacity>
        </>
      )}
      
      <LanguageSwitcher />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 10 },
  avatar: { width: 84, height: 84, borderRadius: 42 },
  name: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginTop: 10 },
  title: { 
    color: theme.colors.muted, 
    marginTop: 4,
    textTransform: 'capitalize',
  },
  loginPrompt: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary + '15',
    borderRadius: theme.radius.md,
  },
  loginPromptText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  statsRow: { flexDirection: 'row', marginTop: 12 },
  stat: { alignItems: 'center', marginHorizontal: 16 },
  statNum: { fontWeight: '800', color: theme.colors.text },
  statLabel: { color: theme.colors.muted, fontSize: 12, marginTop: 2 },
  sectionTitle: { fontWeight: '700', color: theme.colors.text, marginVertical: 12 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.dangerLight || '#fee',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.radius.md,
    marginBottom: 20,
    gap: 8,
  },
  logoutText: {
    color: theme.colors.danger,
    fontWeight: '600',
    fontSize: 16,
  },
});
