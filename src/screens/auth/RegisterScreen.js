import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerSuccess } from '../../store/userSlice';
import theme from '../../theme';
import { t } from '../../i18n';
import AuthLayout from '../../components/AuthLayout';

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = t('name_required') || 'Name is required';
    if (!email.trim()) next.email = t('email_required') || 'Email is required';
    if ((password || '').length < 6) next.password = t('password_min') || 'Min 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onRegister = async () => {
    if (!validate()) return;
    const user = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role: 'user',
      avatar: 'https://i.pravatar.cc/150?img=4',
    };
    dispatch(registerSuccess(user));
    try { await AsyncStorage.setItem('@elearning_auth_state', JSON.stringify({ user })); } catch {}
    navigation.goBack();
  };

  return (
    <AuthLayout
      title={t('create_account') || 'Create account'}
      subtitle={t('join_now') || 'Join now and start learning'}
      footer={(
        <View style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ color: theme.colors.muted }}>
            {(t('have_account') || 'Already have an account?') + ' '}
            <Text style={{ color: theme.colors.primary, fontWeight: '700' }} onPress={() => navigation.replace('Login')}>
              {t('login') || 'Login'}
            </Text>
          </Text>
        </View>
      )}
    >
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
      <View style={styles.field}> 
        <Text style={styles.label}>{t('password') || 'Password'}</Text>
        <TextInput
          placeholder={t('password_placeholder') || '••••••'}
          placeholderTextColor={theme.colors.textLight}
          value={password}
          onChangeText={(v) => { setPassword(v); if (errors.password) setErrors({ ...errors, password: null }); }}
          secureTextEntry
          style={[styles.input, errors.password && styles.inputError]}
        />
        {errors.password ? <Text style={styles.err}>{errors.password}</Text> : null}
      </View>
      <TouchableOpacity onPress={onRegister} style={styles.btn} activeOpacity={0.85}>
        <Text style={styles.btnText}>{t('create_account') || 'Create Account'}</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 12 },
  label: { color: theme.colors.muted, marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 10, backgroundColor: theme.colors.card, color: theme.colors.text },
  inputError: { borderColor: theme.colors.danger },
  err: { color: theme.colors.danger, fontSize: 12, marginTop: 6 },
  btn: { backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});

