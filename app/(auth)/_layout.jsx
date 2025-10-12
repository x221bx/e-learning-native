import React from 'react';
import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';

import AppHeader from '../../src/components/AppHeader';
import WelcomeHeaderRight from '../../src/components/WelcomeHeaderRight';
import { t } from '../../src/i18n';

export default function AuthLayout() {
  useSelector((s) => s.ui.locale); // trigger rerender for translations

  return (
    <Stack screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen
        name="Welcome"
        options={({ navigation }) => ({
          title: t('welcome'),
          headerRight: () => <WelcomeHeaderRight navigation={navigation} />,
          headerLeft: () => null,
        })}
      />
      <Stack.Screen name="Login" options={{ title: t('login') }} />
      <Stack.Screen name="Register" options={{ title: t('create_account') || 'Create Account' }} />
    </Stack>
  );
}

