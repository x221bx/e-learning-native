import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import theme from '../../theme';
import { t } from '../../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/userSlice';

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState('student');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const [birthDateObj, setBirthDateObj] = useState(null);
  const [NativeDatePicker, setNativeDatePicker] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // إضافة بسيطة عشان الكود يشتغل (newadd ما حطّهاش، بس UI المدرّس بيستخدمها)
  const courseOptions = ['frontend', 'ui-ux', 'backend', 'mobile', 'data-science', 'devops', 'ai-ml'];

  const validate = () => {
    const next = {};
    const nm = name.trim();
    const em = email.trim();
    const bd = birthDate.trim();
    const ph = phone.trim();
    if (!nm) next.name = t('name_required') || 'Name is required';
    if (!em) next.email = t('email_required') || 'Email is required';
    if (role === 'admin' && em && !/^[^@]+@admin\.com$/i.test(em)) {
      next.email = t('admin_email_required') || 'Admin email must end with @admin.com';
    }
    if ((password || '').length < 6) next.password = t('password_min') || 'Min 6 characters';
    if (role !== 'teacher') {
      if (!confirmPassword) next.confirmPassword = t('confirm_password_required') || 'Confirm your password';
      else if (confirmPassword !== password) next.confirmPassword = t('passwords_mismatch') || 'Passwords do not match';
    }
    if (role === 'student') {
      if (!bd) next.birthDate = t('birthdate_required') || 'Birth date is required';
      else if (!/^\d{4}-\d{2}-\d{2}$/.test(bd)) next.birthDate = t('birthdate_format') || 'Use YYYY-MM-DD';
      if (!ph) next.phone = t('phone_required') || 'Phone is required';
      else if (!/^\+?[0-9]{8,15}$/.test(ph)) next.phone = t('phone_invalid') || 'Invalid phone number';
    } else if (role === 'admin') {
      if (!ph) next.phone = t('phone_required') || 'Phone is required';
      else if (!/^\+?[0-9]{8,15}$/.test(ph)) next.phone = t('phone_invalid') || 'Invalid phone number';
    }
    if (role === 'teacher' && !selectedCourse) {
      next.selectedCourse = t('select_course_required') || 'Select a course';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const pickAvatar = async () => {
    if (Platform.OS === 'web') {
      try { fileInputRef.current && fileInputRef.current.click(); } catch {}
      return;
    }
    try {
      const ImagePicker = await import('expo-image-picker');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setErrors((e) => ({ ...e, avatar: t('permission_denied') || 'Permission denied' }));
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setAvatarUri(res.assets[0].uri);
        if (errors.avatar) setErrors({ ...errors, avatar: null });
      }
    } catch (e) {
      setErrors((prv) => ({ ...prv, avatar: t('image_picker_unavailable') || 'Image picker not available' }));
    }
  };

  const openBirthPicker = async () => {
    if (Platform.OS === 'web') {
      try { dateInputRef.current && dateInputRef.current.click(); } catch {}
      return;
    }
    try {
      if (!NativeDatePicker) {
        const mod = await import('@react-native-community/datetimepicker');
        setNativeDatePicker(() => (mod.default || mod.DateTimePicker));
      }
      setShowDatePicker(true);
    } catch {
      // fallback: do nothing; keep manual
    }
  };

  const formatDate = (d) => {
    try {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    } catch { return ''; }
  };

  const onRegister = async () => {
    if (!validate()) return;
    const profile = {
      phone: (phone || '').trim() || null,
      birthDate: (birthDate || '').trim() || null,
      teacherCourse: role === 'teacher' ? (selectedCourse || null) : null,
    };
    const user = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role: role,
      avatar: avatarUri || 'https://i.pravatar.cc/150?img=4',
      profile,
    };
    try { dispatch(loginSuccess(user)); } catch {}
    try { await AsyncStorage.setItem('@elearning_auth_state', JSON.stringify({ user })); } catch {}
    try {
      const key = (user.email || '').toLowerCase();
      const raw = await AsyncStorage.getItem('@elearning_profiles');
      const map = raw ? JSON.parse(raw) : {};
      map[key] = user;
      await AsyncStorage.setItem('@elearning_profiles', JSON.stringify(map));
    } catch {}
    try {
      navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
    } catch {}
  };

  return (
    <ScrollView contentContainerStyle={styles.centerContainer} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.formCard}>
        <Text style={[styles.title, styles.centerText]}>{t('create_account') || 'Create account'}</Text>

        {/* Name */}
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

        {/* Email */}
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

        {/* Password */}
        <View style={styles.field}>
          <Text style={styles.label}>{t('password') || 'Password'}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={t('password_placeholder') || '••••••'}
              placeholderTextColor={theme.colors.textLight}
              value={password}
              onChangeText={(v) => { setPassword(v); if (errors.password) setErrors({ ...errors, password: null }); }}
              secureTextEntry={!showPassword}
              style={[styles.input, { paddingRight: 42 }, errors.password && styles.inputError]}
            />
            <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.eyeBtn}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.colors.muted} />
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.err}>{errors.password}</Text> : null}
        </View>

        {/* Confirm Password (مش مطلوب للمدرّس) */}
        {role !== 'teacher' && (
          <View style={styles.field}>
            <Text style={styles.label}>{t('confirm_password') || 'Confirm Password'}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t('confirm_password') || 'Confirm Password'}
                placeholderTextColor={theme.colors.textLight}
                value={confirmPassword}
                onChangeText={(v) => { setConfirmPassword(v); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null }); }}
                secureTextEntry={!showConfirm}
                style={[styles.input, { paddingRight: 42 }, errors.confirmPassword && styles.inputError]}
              />
              <TouchableOpacity onPress={() => setShowConfirm((s) => !s)} style={styles.eyeBtn}>
                <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} color={theme.colors.muted} />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? <Text style={styles.err}>{errors.confirmPassword}</Text> : null}
          </View>
        )}

        {/* Birth Date (للطلاب) */}
        {role === 'student' && (
          <View style={styles.field}>
            <Text style={styles.label}>{t('birth_date') || 'Birth Date'}</Text>
            {Platform.OS === 'web' ? (
              React.createElement('input', {
                type: 'date',
                ref: (el) => (dateInputRef.current = el),
                value: birthDate || '',
                onChange: (e) => {
                  const v = e.target?.value || '';
                  setBirthDate(v);
                  if (errors.birthDate) setErrors({ ...errors, birthDate: null });
                },
                style: { padding: 12, border: `1px solid ${theme.colors.border}`, borderRadius: 10, background: theme.colors.card, color: theme.colors.text, width: '100%' },
              })
            ) : (
              <TouchableOpacity onPress={openBirthPicker} style={[styles.input, errors.birthDate && styles.inputError]}>
                <Text style={{ color: birthDate ? theme.colors.text : theme.colors.textLight }}>
                  {birthDate || (t('select_date') || 'Select date')}
                </Text>
              </TouchableOpacity>
            )}
            {NativeDatePicker && showDatePicker ? (
              <NativeDatePicker
                value={birthDateObj || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setBirthDate(formatDate(selectedDate));
                    setBirthDateObj(selectedDate);
                    if (errors.birthDate) setErrors({ ...errors, birthDate: null });
                  }
                }}
              />
            ) : null}
            {errors.birthDate ? <Text style={styles.err}>{errors.birthDate}</Text> : null}
          </View>
        )}

        {/* Phone (طالب/أدمِن) */}
        {(role === 'student' || role === 'admin') && (
          <View style={styles.field}>
            <Text style={styles.label}>{t('phone') || 'Phone'}</Text>
            <TextInput
              placeholder={t('phone_placeholder') || '+20123456789'}
              placeholderTextColor={theme.colors.textLight}
              value={phone}
              keyboardType="phone-pad"
              onChangeText={(v) => { setPhone(v); if (errors.phone) setErrors({ ...errors, phone: null }); }}
              style={[styles.input, errors.phone && styles.inputError]}
            />
            {errors.phone ? <Text style={styles.err}>{errors.phone}</Text> : null}
          </View>
        )}

        {/* Teacher Course */}
        {role === 'teacher' && (
          <View style={styles.field}>
            <Text style={styles.label}>{t('select_course') || 'Select Course'}</Text>
            <View style={styles.roleRow}>
              {courseOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setSelectedCourse(opt)}
                  style={[styles.roleChip, selectedCourse === opt && styles.roleChipActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.roleChipText, { color: selectedCourse === opt ? '#fff' : theme.colors.muted }]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.selectedCourse ? <Text style={styles.err}>{errors.selectedCourse}</Text> : null}
          </View>
        )}

        {/* Avatar */}
        <View style={styles.field}>
          <Text style={styles.label}>{t('avatar') || 'Avatar'}</Text>
          {avatarUri ? <Image source={{ uri: avatarUri }} style={styles.avatarPreview} /> : null}
          {Platform.OS === 'web' &&
            React.createElement('input', {
              type: 'file',
              accept: 'image/*',
              ref: (el) => (fileInputRef.current = el),
              onChange: (e) => {
                try {
                  const f = e.target?.files?.[0];
                  if (f) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const dataUrl = reader.result;
                      if (typeof dataUrl === 'string') {
                        setAvatarUri(dataUrl);
                        if (errors.avatar) setErrors({ ...errors, avatar: null });
                      }
                    };
                    reader.readAsDataURL(f);
                  }
                } catch {}
              },
              style: { display: 'none' },
            })}
          <View style={styles.rowActions}>
            <TouchableOpacity onPress={pickAvatar} style={[styles.chipBtn, { backgroundColor: theme.colors.primary }]}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{t('choose_image') || 'Choose Image'}</Text>
            </TouchableOpacity>
            {avatarUri && (
              <TouchableOpacity
                onPress={() => setAvatarUri('')}
                style={[styles.chipBtn, { borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}
              >
                <Text style={{ color: theme.colors.text }}>{t('remove') || 'Remove'}</Text>
              </TouchableOpacity>
            )}
          </View>
          {errors.avatar ? <Text style={styles.err}>{errors.avatar}</Text> : null}
        </View>

        {/* Role */}
        <View style={styles.field}>
          <Text style={styles.label}>{t('role') || 'Role'}</Text>
          <View style={styles.roleRow}>
            {['student', 'teacher', 'admin'].map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setRole(r)}
                style={[styles.roleChip, role === r && styles.roleChipActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.roleChipText, { color: role === r ? '#fff' : theme.colors.muted }]}>{t(r) || r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity onPress={onRegister} style={styles.btn} activeOpacity={0.85}>
          <Text style={styles.btnText}>{t('create_account') || 'Create Account'}</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ color: theme.colors.muted }}>
            {(t('have_account') || 'Already have an account?') + ' '}
            <Text style={{ color: theme.colors.primary, fontWeight: '700' }} onPress={() => navigation.navigate('Login')}>
              {t('login') || 'Login'}
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  formCard: {
    width: '100%',
    maxWidth: 480,
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
  inputContainer: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: 12, top: 12, height: 24, width: 24, alignItems: 'center', justifyContent: 'center' },
  err: { color: theme.colors.danger, fontSize: 12, marginTop: 6 },
  btn: { backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  roleRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  roleChip: { borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, backgroundColor: theme.colors.card },
  roleChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  roleChipText: { fontWeight: '700' },
  avatarPreview: { width: 84, height: 84, borderRadius: 42, marginBottom: 8 },
  rowActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  chipBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
});
