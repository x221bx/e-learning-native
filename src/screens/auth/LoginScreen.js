import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import theme from '../../theme';
import { t } from '../../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/userSlice';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    const e = (email || '').trim();
    const p = (password || '').trim();
    if (!e) next.email = t('email_required') || 'Email is required';
    if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) next.email = t('email_invalid') || 'Invalid email';
    if (!p) next.password = t('password_required') || 'Password is required';
    if (p && p.length < 6) next.password = t('password_min') || 'Min 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onLogin = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const em = (email || '').trim();
    const name = em.split('@')[0] || 'Learner';
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
      name: prev.name || name,
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
    setSubmitting(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.centerContainer} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.formCard}>
        <Text style={[styles.title, styles.centerText]}>
          {t('welcome_back') || 'Welcome back!'}
        </Text>
        <Text style={[styles.subtitle, styles.centerText]}>
          {t('login_to_continue') || 'Login to continue learning'}
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>{t('email') || 'Email'}</Text>
          <TextInput
            placeholder={t('email_placeholder') || 'you@example.com'}
            placeholderTextColor={theme.colors.textLight}
            value={email}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={(v) => { setEmail(v); if (errors.email) setErrors({ ...errors, email: null }); }}
            style={[styles.input, errors.email && styles.inputError]}
          />
          {errors.email ? <Text style={styles.err}>{errors.email}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('password') || 'Password'}</Text>
          <TextInput
            placeholder={t('password_placeholder') || '••••••'}
            placeholderTextColor={theme.colors.textLight}
            value={password}
            onChangeText={(v) => { setPassword(v); if (errors.password) setErrors({ ...errors, password: null }); }}
            secureTextEntry={!showPass}
            autoCapitalize="none"
            textContentType="password"
            style={[styles.input, errors.password && styles.inputError]}
          />
          {errors.password ? <Text style={styles.err}>{errors.password}</Text> : null}
          <Text
            onPress={() => setShowPass(!showPass)}
            style={{ color: theme.colors.primary, marginTop: 6, alignSelf: 'flex-end', fontWeight: '700' }}
          >
            {showPass ? (t('hide_password') || 'Hide password') : (t('show_password') || 'Show password')}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onLogin}
          style={[styles.btn, submitting && { opacity: 0.7 }]}
          activeOpacity={0.85}
          disabled={submitting}
        >
          <Text style={styles.btnText}>
            {submitting ? (t('loading') || 'Loading...') : (t('login') || 'Login')}
          </Text>
        </TouchableOpacity>

        <View style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ color: theme.colors.muted }}>
            {(t('no_account') || "Don't have an account?") + ' '}
            <Text
              style={{ color: theme.colors.primary, fontWeight: '700' }}
              onPress={() => navigation.navigate('Register')}
            >
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
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
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
