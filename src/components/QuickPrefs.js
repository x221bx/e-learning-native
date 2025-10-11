import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode, setLocaleUI, setPrimaryColor } from '../store/uiSlice';
import { setLocale, getLocale } from '../i18n';
import { useColors } from '../theme/hooks';

const COLOR_KEY = '@elearning_user_primary_color';

export function QuickPrefsHeaderRight() {
  const dispatch = useDispatch();
  const colors = useColors();
  const locale = getLocale();
  const dark = useSelector((s) => s.ui.darkMode);

  const palette = useMemo(() => ['#6C63FF', '#FF6584', '#00D9C0', '#10B981', '#3B82F6', '#F59E0B'], []);

  const cycleColor = async () => {
    // pick next color different from current
    const idx = Math.max(0, palette.findIndex((c) => c.toLowerCase() === (colors.primary || '').toLowerCase()));
    const next = palette[(idx + 1) % palette.length];
    dispatch(setPrimaryColor(next));
    try { await AsyncStorage.setItem(COLOR_KEY, next); } catch {}
  };

  const toggleLocale = (lc) => {
    const target = locale === 'ar' ? 'en' : 'ar';
    setLocale(target);
    dispatch(setLocaleUI(target));
  };

  const toggleDark = () => {
    dispatch(setDarkMode(!dark));
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingRight: 12 }}>
      <TouchableOpacity onPress={cycleColor}>
        <Ionicons name="color-palette-outline" size={22} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleDark}>
        <Ionicons name={dark ? 'moon' : 'moon-outline'} size={22} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleLocale}>
        <Ionicons name="language-outline" size={22} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

export default QuickPrefsHeaderRight;
