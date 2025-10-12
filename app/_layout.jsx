import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import store from '../src/store';
import theme from '../src/theme';
import { useAppBootstrap } from '../src/hooks/useAppBootstrap';

function BootstrapBoundary() {
  const { isReady, navigationTheme, statusBarStyle, localeKey } = useAppBootstrap();

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style={statusBarStyle} />
        <Slot key={localeKey} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <BootstrapBoundary />
    </Provider>
  );
}

