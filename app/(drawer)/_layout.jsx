import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { I18nManager, Platform } from 'react-native';
import { useSelector } from 'react-redux';

import CustomDrawerContent from '../../src/navigation/CustomDrawerContent';
import theme from '../../src/theme';
import { t } from '../../src/i18n';

export default function DrawerLayout() {
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const isAdmin = useSelector((s) => s.user.isAdmin);
  useSelector((s) => s.ui.locale);

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: Platform.OS === 'web' ? 'front' : 'slide',
        drawerPosition: I18nManager.isRTL ? 'right' : 'left',
        overlayColor: 'rgba(0,0,0,0.3)',
        sceneContainerStyle: { backgroundColor: theme.colors.background },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="(tabs)" options={{ title: t('home'), drawerLabel: t('home') }} />
      {!isAuthenticated && (
        <Drawer.Screen
          name="authRedirect"
          options={{
            title: t('welcome'),
            drawerLabel: t('welcome'),
            href: '/(auth)/Welcome',
          }}
        />
      )}
      {isAuthenticated && (
        <Drawer.Screen
          name="logout"
          options={{
            title: t('logout'),
            drawerLabel: t('logout'),
            href: '/(drawer)/logout',
          }}
        />
      )}
      {isAdmin && (
        <Drawer.Screen
          name="adminShortcut"
          options={{
            title: t('admin'),
            drawerLabel: t('admin'),
            href: '/(drawer)/(tabs)/Admin',
          }}
        />
      )}
    </Drawer>
  );
}

