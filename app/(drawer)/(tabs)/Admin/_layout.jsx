import React from 'react';
import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';

import AppHeader from '../../../../src/components/AppHeader';
import { t } from '../../../../src/i18n';

export default function AdminLayout() {
  useSelector((s) => s.ui.locale);

  return (
    <Stack screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen name="index" options={{ title: t('admin') }} />
      <Stack.Screen name="AdminDashboard" options={{ title: t('dashboard') || 'Dashboard' }} />
      <Stack.Screen name="AdminCourses" options={{ title: t('courses') || 'Courses' }} />
      <Stack.Screen name="AdminCourseForm" options={{ title: t('add_course') || 'Course' }} />
      <Stack.Screen name="AdminUsers" options={{ title: t('users') || 'Users' }} />
      <Stack.Screen name="AdminCategories" options={{ title: t('categories') || 'Categories' }} />
      <Stack.Screen name="AdminSettings" options={{ title: t('settings') || 'Settings' }} />
      <Stack.Screen name="AdminLive" options={{ title: t('live_now') || 'Live' }} />
      <Stack.Screen name="AdminSchedule" options={{ title: t('schedule') || 'Schedule' }} />
    </Stack>
  );
}

