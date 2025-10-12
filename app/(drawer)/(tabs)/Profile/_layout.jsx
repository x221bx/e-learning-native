import React from 'react';
import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';

import AppHeader from '../../../../src/components/AppHeader';
import { t } from '../../../../src/i18n';

export default function ProfileLayout() {
  useSelector((s) => s.ui.locale);

  return (
    <Stack screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen name="index" options={{ title: t('profile') }} />
    </Stack>
  );
}

