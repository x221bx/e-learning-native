import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AdminLayout, { AdminCard, AdminButton, AdminStat } from '../../components/admin/AdminLayout';
import { useColors } from '../../theme/hooks';
import theme from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CoursesAPI } from '../../services/api';
import { t } from '../../i18n';

const USERS_KEY = '@elearning_users';
const AUTH_KEY = '@elearning_auth_state';
const LIVE_KEY = '@elearning_live_now';
const SCHEDULE_KEY = '@elearning_schedule';

export default function AdminDashboardScreen({ navigation }) {
  const colors = useColors();
  const [stats, setStats] = useState({ totalCourses: 0, published: 0, drafts: 0, totalUsers: 0, teachers: 0, liveSessions: 0, scheduleEvents: 0 });

  const loadStats = useCallback(async () => {
    try {
      const res = await CoursesAPI.list({ offset: 0, limit: 1000, onlyPublished: false });
      const list = res?.items || [];
      const totalCourses = list.length;
      const published = list.filter((c) => c.published).length;
      const drafts = totalCourses - published;
      let totalUsers = 0;
      let teachers = 0;
      try {
        const raw = await AsyncStorage.getItem(USERS_KEY);
        let users = raw ? JSON.parse(raw) : [];
        // If no users list exists yet, seed from current auth state so dashboard shows counts
        if (!Array.isArray(users) || users.length === 0) {
          try {
            const authRaw = await AsyncStorage.getItem(AUTH_KEY);
            const auth = authRaw ? JSON.parse(authRaw) : null;
            const current = auth?.user;
            if (current?.email) {
              users = [{ id: current.id || Date.now(), name: current.name || 'User', email: current.email, role: current.role || 'student', isApproved: current.role === 'teacher' ? false : true }];
            }
          } catch { }
        }
        // Ensure we have all users by also checking if there are more users in auth that aren't in the list
        try {
          const authRaw = await AsyncStorage.getItem(AUTH_KEY);
          const auth = authRaw ? JSON.parse(authRaw) : null;
          const current = auth?.user;
          if (current?.email) {
            const exists = users.some((u) => (u.email || '').toLowerCase() === String(current.email).toLowerCase());
            if (!exists) {
              users.push({ id: current.id || Date.now(), name: current.name || 'User', email: current.email, role: current.role || 'student', isApproved: current.role === 'teacher' ? false : true });
            }
          }
        } catch { }
        totalUsers = Array.isArray(users) ? users.length : 0;
        teachers = Array.isArray(users) ? users.filter((u) => u.role === 'teacher').length : 0;
      } catch { }

      // Load live sessions and schedule events
      let liveSessions = 0;
      let scheduleEvents = 0;
      try {
        const liveRaw = await AsyncStorage.getItem(LIVE_KEY);
        const liveItems = liveRaw ? JSON.parse(liveRaw) : [];
        liveSessions = Array.isArray(liveItems) ? liveItems.length : 0;
      } catch { }
      try {
        const scheduleRaw = await AsyncStorage.getItem(SCHEDULE_KEY);
        const scheduleItems = scheduleRaw ? JSON.parse(scheduleRaw) : [];
        scheduleEvents = Array.isArray(scheduleItems) ? scheduleItems.length : 0;
      } catch { }

      setStats({ totalCourses, published, drafts, totalUsers, teachers, liveSessions, scheduleEvents });
    } catch {
      setStats((s) => ({ ...s }));
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  return (
    <AdminLayout
      title={Platform.OS === 'web' ? (t('admin_panel') || 'Admin Panel') : 'Dashboard'}
      subtitle={Platform.OS === 'web' ? (t('overview_quick_actions') || 'Overview and quick actions') : null}
      actions={[
        { label: Platform.OS === 'web' ? (t('new_course') || 'New Course') : null, icon: 'add', onPress: () => navigation.navigate('AdminCourseForm') },
        { label: Platform.OS === 'web' ? (t('settings') || 'Settings') : null, icon: 'settings', variant: 'outline', onPress: () => navigation.navigate('AdminSettings') },
        { label: Platform.OS === 'web' ? (t('refresh') || 'Refresh') : null, icon: 'refresh', variant: 'outline', onPress: loadStats },
      ]}
    >
      <View style={styles.grid}>
        <AdminStat label={t('courses')} value={stats.totalCourses} icon="library" />
        <AdminStat label={t('published')} value={stats.published} icon="checkmark-circle" color={colors.success} />
        <AdminStat label={t('drafts')} value={stats.drafts} icon="document" color={colors.warning} />
        <AdminStat label={t('users')} value={stats.totalUsers} icon="people" />
        <AdminStat label={t('teachers')} value={stats.teachers} icon="person" />
        <AdminStat label={t('live_now')} value={stats.liveSessions} icon="play-circle" color={theme.colors.secondary} />
        <AdminStat label={t('schedule')} value={stats.scheduleEvents} icon="calendar" color={theme.colors.accent} />
      </View>

      <AdminCard title={t('quick_links') || 'Quick Links'} style={{ marginTop: theme.spacing.base }}>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <AdminButton label={t('manage_courses') || 'Manage Courses'} icon="book" onPress={() => navigation.navigate('AdminCourses')} />
          <AdminButton label={t('manage_live') || 'Manage Live'} icon="play-circle" variant="outline" onPress={() => navigation.navigate('AdminLive')} />
          <AdminButton label={t('manage_schedule') || 'Manage Schedule'} icon="calendar" variant="outline" onPress={() => navigation.navigate('AdminSchedule')} />
          <AdminButton label={t('users')} icon="people" variant="outline" onPress={() => navigation.navigate('AdminUsers')} />
          <AdminButton label={t('categories')} icon="pricetags" variant="outline" onPress={() => navigation.navigate('AdminCategories')} />
        </View>
      </AdminCard>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
});


