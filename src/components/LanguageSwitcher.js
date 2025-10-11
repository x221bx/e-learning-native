import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { setLocale, getLocale, t } from '../i18n';
import theme from '../theme';
import { useDispatch } from 'react-redux';
import { setLocaleUI } from '../store/uiSlice';

export default function LanguageSwitcher() {
  const [locale, setLoc] = useState(getLocale());
  const dispatch = useDispatch();
  const switchTo = (lc) => {
    setLocale(lc);
    setLoc(lc);
    dispatch(setLocaleUI(lc));
    // لمتصفح الويب لم نعد نحتاج لإعادة التحميل لأن الشجرة ستُعاد تركيبها عبر Navigation key
  };
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{t('language') || 'Language:'}</Text>
      <TouchableOpacity onPress={() => switchTo('en')} style={[styles.btn, locale === 'en' && styles.active]}>
        <Text style={[styles.btnText, locale === 'en' && styles.activeText]}>EN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => switchTo('ar')} style={[styles.btn, locale === 'ar' && styles.active]}>
        <Text style={[styles.btnText, locale === 'ar' && styles.activeText]}>AR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  label: { color: theme.colors.muted, marginRight: 8 },
  btn: { borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 8 },
  btnText: { color: theme.colors.text },
  active: { backgroundColor: theme.colors.primary },
  activeText: { color: '#fff' },
});
