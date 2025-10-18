import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Platform, ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import * as SplashScreen from 'expo-splash-screen';
import { useDispatch, useSelector } from 'react-redux';

if (Platform.OS !== 'web') enableScreens(true);

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import TabsNavigator from './src/navigation/TabsNavigator';

import theme from './src/theme';
import { withStore } from './src/store';
import { loginSuccess, continueAsGuest } from './src/store/userSlice';
import { setDarkMode, setLocaleUI, setPrimaryColor } from './src/store/uiSlice';
function AppInner() {
  const dispatch = useDispatch();
  const darkMode = useSelector((s) => s.ui.darkMode);
  const locale = useSelector((s) => s.ui.locale);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        try {
          const dark = await AsyncStorage.getItem('@elearning_dark_mode');
          if (dark != null) dispatch(setDarkMode(JSON.parse(dark)));
          const lc = await AsyncStorage.getItem('@elearning_locale');
          if (lc) {
            dispatch(setLocaleUI(lc));
            try { require('./src/i18n').setLocale(lc); } catch { }
          }
        } catch { }
        try {
          const uc = await AsyncStorage.getItem('@elearning_user_primary_color');
          if (uc) dispatch(setPrimaryColor(uc));
        } catch { }
        try {
          const raw = await AsyncStorage.getItem('@elearning_auth_state');
          if (raw) {
            const obj = JSON.parse(raw);
            if (obj?.user) dispatch(loginSuccess(obj.user));
            else if (obj?.isGuest) dispatch(continueAsGuest());
          }
        } catch { }
      } catch (error) {
        // ignore
      } finally {
        setIsInitializing(false);
        SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, [dispatch]);

  const navTheme = darkMode ? DarkTheme : {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: theme.colors.background },
  };

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: darkMode ? '#111' : theme.colors.background }}>
      <NavigationContainer theme={navTheme} key={locale || 'en'}>
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        <TabsNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default withStore(AppInner);

function MainTabs() {
  const isAdmin = useSelector((s) => s.user?.isAdmin);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: { height: 58, paddingBottom: 6 },
        tabBarIcon: ({ color, size, focused }) => {
          const map = {
            Home: focused ? 'home' : 'home-outline',
            Search: focused ? 'search' : 'search-outline',
            Purchase: focused ? 'cart' : 'cart-outline',
            MyCourses: focused ? 'book' : 'book-outline',
            Profile: focused ? 'person' : 'person-outline',
            Admin: focused ? 'settings' : 'settings-outline',
          };
          const name = map[route.name] || 'ellipse-outline';
          return <Ionicons name={name} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: t('home') }} />
      <Tab.Screen name="Search" component={SearchStack} options={{ tabBarLabel: t('search') }} />
      <Tab.Screen name="Purchase" component={PurchaseScreen} options={{ headerShown: false, tabBarLabel: t('purchase') || 'Purchase' }} />
      <Tab.Screen name="MyCourses" component={MyCoursesScreen} options={{ headerShown: false, tabBarLabel: t('my_courses') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false, tabBarLabel: t('profile') }} />
      {isAdmin ? (
        <Tab.Screen name="Admin" component={AdminStack} options={{ headerShown: false, tabBarLabel: 'Admin' }} />
      ) : null}
    </Tab.Navigator>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const darkMode = useSelector((s) => s.ui.darkMode);
  const locale = useSelector((s) => s.ui.locale);
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const isGuest = useSelector((s) => s.user.isGuest);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load UI preferences (dark mode + locale)
        try {
          const dark = await AsyncStorage.getItem('@elearning_dark_mode');
          if (dark != null) dispatch(setDarkMode(JSON.parse(dark)));
          const lc = await AsyncStorage.getItem('@elearning_locale');
          if (lc) {
            dispatch(setLocaleUI(lc));
            try { require('./src/i18n').setLocale(lc); } catch { }
          }
        } catch { }
        try {
          const uc = await AsyncStorage.getItem('@elearning_user_primary_color');
          if (uc) dispatch(setPrimaryColor(uc));
        } catch { }
        // Load auth state
        try {
          const raw = await AsyncStorage.getItem('@elearning_auth_state');
          if (raw) {
            const obj = JSON.parse(raw);
            if (obj?.user) dispatch(loginSuccess(obj.user));
            else if (obj?.isGuest) dispatch(continueAsGuest());
          }
        } catch { }

        // Load enrolled courses for authenticated users
        try {
          const enrolledRaw = await AsyncStorage.getItem('@elearning_enrolled_courses');
          if (enrolledRaw) {
            const enrolled = JSON.parse(enrolledRaw);
            if (Array.isArray(enrolled)) {
              dispatch({ type: 'user/loadEnrolledCourses', payload: enrolled });
            }
          }
        } catch { }
      } catch (error) {
        // ignore
      } finally {
        setIsInitializing(false);
        // Hide splash screen when app is ready
        SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, [dispatch]);

  const navTheme = darkMode ? DarkTheme : {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: theme.colors.background },
  };

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: darkMode ? '#111' : theme.colors.background }}>
      <NavigationContainer theme={navTheme} key={locale || 'en'}>
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        <TabsNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

// (removed duplicate App wrapper)


