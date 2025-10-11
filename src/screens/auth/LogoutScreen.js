import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../store/userSlice';
import theme from '../../theme';

export default function LogoutScreen({ navigation }) {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      dispatch(logout());
      try { await AsyncStorage.removeItem('@elearning_auth_state'); } catch {}
      navigation.goBack();
    })();
  }, [dispatch, navigation]);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

