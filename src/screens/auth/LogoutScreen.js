import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import theme from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutScreen({ navigation }) {
  useEffect(() => {
    (async () => {
      try { await AsyncStorage.removeItem('@elearning_auth_state'); } catch {}
      navigation.goBack();
    })();
  }, [navigation]);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

