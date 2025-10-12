import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import theme from '../../theme';
import { t } from '../../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/userSlice';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    const e = (email || '').trim();
    const n = (name || '').trim();

    if (!e) next.email = t('email_required') || 'Email is required';
    if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) next.email = t('email_invalid') || 'Invalid email';

     if (!n) next.name = (t('name_optional_but_recommended') || 'Name is recommended');

    setErrors(next);
    return Object.keys(next).filter(k => next[k]).length === 0 || (Object.keys(next).length === 1 && next.name);
  };

  const onLogin = async () => {
    if (!validate()) return;
    setSubmitting(true);

    const em = (email || '').trim();
    const displayName = (name || em.split('@')[0] || 'Learner').trim();

    let map = {};
    try {
      const rawMap = await AsyncStorage.getItem('@elearning_profiles');
      map = rawMap ? JSON.parse(rawMap) : {};
    } catch {}

    const key = em.toLowerCase();
    const prev = map[key] || {};
    const user = {
      ...prev,
      id: prev.id || Date.now(),
      name: prev.name || displayName,
      email: em,
      role: prev.role || (em.endsWith('@admin.com') ? 'admin' : 'user'),
      avatar: prev.avatar || 'https://i.pravatar.cc/150?img=3',
      profile: prev.profile || {},
    };

    try {
      map[key] = user;
      await AsyncStorage.setItem('@elearning_profiles', JSON.stringify(map));
    } catch {}

    try { dispatch(loginSuccess(user)); } catch {}
    try { await AsyncStorage.setItem('@elearning_auth_state', JSON.stringify({ user })); } catch {}

    try {
      navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
    } catch {} 
    finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.centerContainer} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.formCard}>
        <Text style={[styles.title, styles.centerText]}>{t('welcome_back') || 'Welcome back!'}</Text>
        <Text style={[styles.subtitle, styles.centerText]}>{t('login_to_continue') || 'Login to continue learning'}</Text>

         <View style={styles.field}>
          <Text style={styles.label}>{t('name') || 'Name'}</Text>
          <TextInput
            placeholder={t('name_placeholder') || 'Your name'}
            placeholderTextColor={theme.colors.textLight}
            value={name}
            onChangeText={(v) => { setName(v); if (errors.name) setErrors({ ...errors, name: null }); }}
            style={[styles.input, errors.name && styles.inputError]}
          />
          {errors.name ? <Text style={styles.err}>{errors.name}</Text> : null}
        </View>

         <View style={styles.field}>
          <Text style={styles.label}>{t('email') || 'Email'}</Text>
          <TextInput
            placeholder={t('email_placeholder') || 'you@example.com'}
            placeholderTextColor={theme.colors.textLight}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(v) => { setEmail(v); if (errors.email) setErrors({ ...errors, email: null }); }}
            style={[styles.input, errors.email && styles.inputError]}
          />
          {errors.email ? <Text style={styles.err}>{errors.email}</Text> : null}
        </View>

         <TouchableOpacity onPress={onLogin} style={[styles.btn, submitting && { opacity: 0.7 }]} activeOpacity={0.85} disabled={submitting}>
          <Text style={styles.btnText}>{submitting ? (t('loading') || 'Loading...') : (t('login') || 'Login')}</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ color: theme.colors.muted }}>
            {(t('no_account') || "Don't have an account?") + ' '}
            <Text style={{ color: theme.colors.primary, fontWeight: '700' }} onPress={() => navigation.navigate('Register')}>
              {t('create_account') || 'Create account'}
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  formCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  centerText: { textAlign: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: theme.colors.text, marginBottom: 6 },
  subtitle: { color: theme.colors.muted, marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { color: theme.colors.muted, marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
  },
  inputError: { borderColor: theme.colors.danger },
  err: { color: theme.colors.danger, fontSize: 12, marginTop: 6 },
  btn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700' },
});
