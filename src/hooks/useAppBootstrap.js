import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import theme from '../theme';
import { continueAsGuest, loginSuccess } from '../store/userSlice';
import { setDarkMode, setLocaleUI, setPrimaryColor } from '../store/uiSlice';
import { setLocale as setI18nLocale } from '../i18n';

SplashScreen.preventAutoHideAsync().catch(() => {});

const STATUS_KEYS = {
  darkMode: '@elearning_dark_mode',
  locale: '@elearning_locale',
  primaryColor: '@elearning_user_primary_color',
  auth: '@elearning_auth_state',
};

export function useAppBootstrap() {
  const dispatch = useDispatch();
  const darkMode = useSelector((s) => s.ui.darkMode);
  const locale = useSelector((s) => s.ui.locale || 'en');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const storedDark = await AsyncStorage.getItem(STATUS_KEYS.darkMode);
        if (storedDark !== null) {
          try {
            dispatch(setDarkMode(JSON.parse(storedDark)));
          } catch {
            dispatch(setDarkMode(false));
          }
        }

        const storedLocale = await AsyncStorage.getItem(STATUS_KEYS.locale);
        if (storedLocale) {
          dispatch(setLocaleUI(storedLocale));
        }

        const storedPrimary = await AsyncStorage.getItem(STATUS_KEYS.primaryColor);
        if (storedPrimary) {
          dispatch(setPrimaryColor(storedPrimary));
        }

        const authRaw = await AsyncStorage.getItem(STATUS_KEYS.auth);
        if (authRaw) {
          try {
            const authState = JSON.parse(authRaw);
            if (authState?.user) {
              dispatch(loginSuccess(authState.user));
            } else if (authState?.isGuest) {
              dispatch(continueAsGuest());
            }
          } catch {
            // Ignore corrupt auth state
          }
        }
      } catch {
        // Ignore bootstrap errors to avoid blocking the app
      } finally {
        if (mounted) {
          setIsReady(true);
        }
        SplashScreen.hideAsync().catch(() => {});
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    setI18nLocale(locale);
  }, [locale]);

  const navigationTheme = useMemo(() => {
    if (darkMode) return DarkTheme;
    return {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: theme.colors.background,
      },
    };
  }, [darkMode]);

  return {
    isReady,
    localeKey: locale || 'en',
    navigationTheme,
    statusBarStyle: darkMode ? 'light' : 'dark',
  };
}

