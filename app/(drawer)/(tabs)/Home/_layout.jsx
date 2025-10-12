import React from 'react';
import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';

import AppHeader from '../../../../src/components/AppHeader';
import { t } from '../../../../src/i18n';

export default function HomeLayout() {
  useSelector((s) => s.ui.locale);

  return (
    <Stack screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen name="index" options={{ title: t('home') }} />
      <Stack.Screen name="CourseDetails" options={{ title: t('course') }} />
      <Stack.Screen name="CoursePlay" options={{ title: t('course') }} />
      <Stack.Screen name="TeacherProfile" options={{ title: t('teachers') || 'Teacher' }} />
      <Stack.Screen name="LiveNow" options={{ title: t('live_now') || 'Live Now' }} />
      <Stack.Screen name="Schedule" options={{ title: t('schedule') || 'Schedule' }} />
      <Stack.Screen name="Teachers" options={{ title: t('teachers') || 'Teachers' }} />
      <Stack.Screen name="Messages" options={{ title: t('messages') || 'Messages' }} />
    </Stack>
  );
}

