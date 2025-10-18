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

  // Web-only safeguard: ensure document / body / root allow vertical scrolling
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const prev = {
        htmlOverflow: document.documentElement.style.overflow,
        bodyOverflow: document.body.style.overflow,
        bodyHeight: document.body.style.height,
      };
      document.documentElement.style.minHeight = '100vh';
      document.documentElement.style.height = 'auto';
      document.documentElement.style.overflow = 'auto';
      document.body.style.minHeight = '100vh';
      document.body.style.height = 'auto';
      document.body.style.overflow = 'auto';
      const root = document.getElementById('root');
      if (root) {
        root.style.minHeight = '100vh';
        root.style.height = 'auto';
        root.style.overflow = 'auto';
      }

      return () => {
        // restore previous inline styles
        document.documentElement.style.overflow = prev.htmlOverflow || '';
        document.body.style.overflow = prev.bodyOverflow || '';
        document.body.style.height = prev.bodyHeight || '';
      };
    }
    return undefined;
  }, []);

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


