import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import theme from '../../../src/theme';
import { t } from '../../../src/i18n';

const ICONS = {
  Home: ['home-outline', 'home'],
  Search: ['search-outline', 'search'],
  MyCourses: ['book-outline', 'book'],
  Profile: ['person-outline', 'person'],
  Admin: ['settings-outline', 'settings'],
};

export default function TabsLayout() {
  const isAdmin = useSelector((s) => s.user.isAdmin);
  useSelector((s) => s.ui.locale);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: { height: 58, paddingBottom: 6 },
        tabBarIcon: ({ color, size, focused }) => {
          const [outline, filled] = ICONS[route.name] || ['ellipse-outline', 'ellipse'];
          const name = focused ? filled : outline;
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" options={{ title: t('home'), tabBarLabel: t('home') }} />
      <Tabs.Screen name="Search" options={{ title: t('search'), tabBarLabel: t('search') }} />
      <Tabs.Screen name="MyCourses" options={{ title: t('my_courses'), tabBarLabel: t('my_courses') }} />
      <Tabs.Screen name="Profile" options={{ title: t('profile'), tabBarLabel: t('profile') }} />
      <Tabs.Screen
        name="Admin"
        options={{
          title: t('admin'),
          tabBarLabel: t('admin'),
          href: isAdmin ? undefined : null,
        }}
      />
    </Tabs>
  );
}

