import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { t } from '../i18n';
import { courses } from '../mock/data';
import { CourseCardVertical } from '../components/CourseCard';
import { useSelector, useDispatch } from 'react-redux';
import { setAdmin, logout, updateProfile } from '../store/userSlice';
import LanguageSwitcher from '../components/LanguageSwitcher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setPrimaryColor, setDarkMode, setLocaleUI } from '../store/uiSlice';
import { setLocale, getLocale } from '../i18n';

export default function ProfileScreen({ navigation }) {
  const colors = useColors();
  const favIds = useSelector((s) => s.favorites.ids);
  const isAdmin = useSelector((s) => s.user.isAdmin);
  const user = useSelector((s) => s.user.user);
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const isGuest = useSelector((s) => s.user.isGuest);
  const dispatch = useDispatch();
  const favCourses = courses.filter((c) => favIds.includes(c.id));

  const handleLogout = async () => {
    try {
      dispatch(logout());
      try { await AsyncStorage.removeItem('@elearning_auth_state'); } catch {}
    } catch {}
  };

  // Load saved user color on mount (if any)
  useEffect(() => {
    (async () => {
      try {
        const c = await AsyncStorage.getItem('@elearning_user_primary_color');
        if (c) dispatch(setPrimaryColor(c));
      } catch {}
    })();
  }, [dispatch]);

  // Initialize editable fields from user
  useEffect(() => {
    try {
      setFormName(user?.name || '');
      setFormPhone(user?.profile?.phone || '');
      setFormBirthDate(user?.profile?.birthDate || '');
      setFormTeacherCourse(user?.profile?.teacherCourse || '');
      setAvatarUri(user?.avatar || '');
    } catch {}
  }, [user]);

  // Local color input for manual change
  const [colorInput, setColorInput] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formBirthDate, setFormBirthDate] = useState('');
  const [formTeacherCourse, setFormTeacherCourse] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const fileInputRef = useRef(null);
  const applyColor = async () => {
    const c = (colorInput || '').trim();
    if (!c) return;
    dispatch(setPrimaryColor(c));
    try { await AsyncStorage.setItem('@elearning_user_primary_color', c); } catch {}
  };

  const toggleLocale = () => {
    const current = getLocale();
    const next = current === 'ar' ? 'en' : 'ar';
    setLocale(next);
    dispatch(setLocaleUI(next));
  };

  const pickAvatar = async () => {
    if (Platform.OS === 'web') {
      try { fileInputRef.current && fileInputRef.current.click(); } catch {}
      return;
    }
    try {
      const ImagePicker = await import('expo-image-picker');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1,1], quality: 0.8 });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setAvatarUri(res.assets[0].uri);
      }
    } catch {}
  };

  const saveProfile = async () => {
    const updates = {
      name: (formName || '').trim(),
      avatar: avatarUri || user?.avatar,
      profile: {
        ...(user?.profile || {}),
        phone: (formPhone || '').trim() || null,
        birthDate: (formBirthDate || '').trim() || null,
        teacherCourse: user?.role === 'teacher' ? (formTeacherCourse || null) : (user?.profile?.teacherCourse || null),
      },
    };
    try { dispatch(updateProfile(updates)); } catch {}
    try {
      // Persist auth state
      const auth = { user: { ...(user || {}), ...updates, profile: { ...(user?.profile || {}), ...(updates.profile || {}) } } };
      await AsyncStorage.setItem('@elearning_auth_state', JSON.stringify(auth));
      // Persist profiles map by email
      const key = String(auth.user.email || '').toLowerCase();
      const raw = await AsyncStorage.getItem('@elearning_profiles');
      const map = raw ? JSON.parse(raw) : {};
      map[key] = auth.user;
      await AsyncStorage.setItem('@elearning_profiles', JSON.stringify(map));
    } catch {}
    setEditMode(false);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ marginBottom: 8 }}>
        <TouchableOpacity
          onPress={() => {
            try {
              if (navigation?.canGoBack && navigation.canGoBack()) navigation.goBack();
              else navigation.navigate('Home');
            } catch {}
          }}
          activeOpacity={0.8}
          style={{ padding: 6, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={[styles.header] }>
        <Image 
          source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=5' }} 
          style={styles.avatar} 
        />
        <Text style={[styles.name, { color: colors.text }]}>{user?.name || (t('guest_user') || 'Guest User')}</Text>
        <Text style={[styles.title, { color: colors.muted }]}>{(user?.role && t(user.role)) || (t('guest') || 'Guest')}</Text>
        {/* Auth removed: no login prompt */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{favCourses.length}</Text>
            <Text style={styles.statLabel}>{t('saved') || 'Saved'}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{user?.enrolledCourses?.length || 0}</Text>
            <Text style={styles.statLabel}>{t('enrolled') || 'Enrolled'}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{user?.completedCourses?.length || 0}</Text>
            <Text style={styles.statLabel}>{t('completed') || 'Completed'}</Text>
          </View>
        </View>
      </View>

      {/* Profile Details */}
      <View style={{ padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.card }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[styles.sectionTitle, { marginVertical: 0, color: colors.text }]}>{t('profile') || 'Profile'}</Text>
          <TouchableOpacity onPress={() => setEditMode((v) => !v)}>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>{editMode ? (t('cancel') || 'Cancel') : (t('edit') || 'Edit')}</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Image source={{ uri: avatarUri || user?.avatar }} style={{ width: 64, height: 64, borderRadius: 32 }} />
          {Platform.OS === 'web' ? (
            React.createElement('input', {
              type: 'file', accept: 'image/*',
              ref: (el) => (fileInputRef.current = el),
              onChange: (e) => { try { const f = e.target?.files?.[0]; if (f) { const reader = new FileReader(); reader.onload = () => { const dataUrl = reader.result; if (typeof dataUrl === 'string') setAvatarUri(dataUrl); }; reader.readAsDataURL(f); } } catch {} },
              style: { display: 'none' },
            })
          ) : null}
          {editMode ? (
            <TouchableOpacity onPress={pickAvatar} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: colors.primary }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{t('change_photo') || 'Change Photo'}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Name */}
        <View style={{ marginTop: 12 }}>
          <Text style={{ color: colors.muted, marginBottom: 6 }}>{t('name') || 'Name'}</Text>
          {editMode ? (
            <TextInput value={formName} onChangeText={setFormName} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, color: colors.text, backgroundColor: colors.card }} />
          ) : (
            <Text style={{ color: colors.text }}>{user?.name || '-'}</Text>
          )}
        </View>

        {/* Email (read-only) */}
        <View style={{ marginTop: 12 }}>
          <Text style={{ color: colors.muted, marginBottom: 6 }}>{t('email') || 'Email'}</Text>
          <Text style={{ color: colors.text }}>{user?.email || '-'}</Text>
        </View>

        {/* Phone */}
        <View style={{ marginTop: 12 }}>
          <Text style={{ color: colors.muted, marginBottom: 6 }}>{t('phone') || 'Phone'}</Text>
          {editMode ? (
            <TextInput value={formPhone} onChangeText={setFormPhone} keyboardType="phone-pad" style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, color: colors.text, backgroundColor: colors.card }} />
          ) : (
            <Text style={{ color: colors.text }}>{user?.profile?.phone || '-'}</Text>
          )}
        </View>

        {/* Birth Date */}
        <View style={{ marginTop: 12 }}>
          <Text style={{ color: colors.muted, marginBottom: 6 }}>{t('birth_date') || 'Birth Date'}</Text>
          {editMode ? (
            Platform.OS === 'web' ? (
              React.createElement('input', {
                type: 'date', value: formBirthDate || '',
                onChange: (e) => setFormBirthDate(e.target?.value || ''),
                style: { padding: 8, border: `1px solid ${colors.border}`, borderRadius: 8, background: colors.card, color: colors.text },
              })
            ) : (
              <TouchableOpacity onPress={() => { /* Could implement native picker if available */ }} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 12, backgroundColor: colors.card }}>
                <Text style={{ color: colors.text }}>{formBirthDate || (t('select_date') || 'Select date')}</Text>
              </TouchableOpacity>
            )
          ) : (
            <Text style={{ color: colors.text }}>{user?.profile?.birthDate || '-'}</Text>
          )}
        </View>

        {/* Teacher course */}
        {user?.role === 'teacher' ? (
          <View style={{ marginTop: 12 }}>
            <Text style={{ color: colors.muted, marginBottom: 6 }}>{t('select_course') || 'Select Course'}</Text>
            {editMode ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {['frontend','ui-ux','backend','mobile','data-science','devops','ai-ml'].map((opt) => (
                  <TouchableOpacity key={opt} onPress={() => setFormTeacherCourse(opt)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: formTeacherCourse === opt ? colors.primary : colors.border, backgroundColor: formTeacherCourse === opt ? colors.primary : colors.card }}>
                    <Text style={{ color: formTeacherCourse === opt ? '#fff' : colors.muted, fontWeight: '700' }}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={{ color: colors.text }}>{user?.profile?.teacherCourse || '-'}</Text>
            )}
          </View>
        ) : null}

        {/* Save button */}
        {editMode ? (
          <View style={{ marginTop: 12, flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={saveProfile} style={{ backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{t('save') || 'Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditMode(false)} style={{ borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.card }}>
              <Text style={{ color: colors.text }}>{t('cancel') || 'Cancel'}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* Auth actions */}
      {isAuthenticated ? (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={[styles.logoutButton, { backgroundColor: theme.colors.surface }]} activeOpacity={0.85}>
          <Ionicons name="log-in-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.logoutText, { color: theme.colors.primary }]}>{t('login') || 'Login'}</Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('saved_courses')}</Text>
      {favCourses.length === 0 && (
        <Text style={{ color: colors.muted }}>{t('no_favorites')}</Text>
      )}
      {favCourses.map((c) => (
        <CourseCardVertical 
          key={c.id + '-saved'} 
          course={c} 
          onPress={() => navigation.navigate('Home', { 
            screen: 'CourseDetails', 
            params: { courseId: c.id } 
          })} 
          showBookmark 
        />
      ))}

      <View style={{ height: 20 }} />
      
      {user?.role === 'admin' && (
        <>
          <Text style={styles.sectionTitle}>{t('admin')}</Text>
          <Text style={{ color: theme.colors.muted, marginBottom: 6 }}>
            {t('admin_mode') || 'Admin mode'}: {isAdmin ? (t('on') || 'ON') : (t('off') || 'OFF')}
          </Text>
          <TouchableOpacity onPress={() => dispatch(setAdmin(!isAdmin))}>
            <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>
              {t('toggle_admin_mode') || 'Toggle Admin Mode'}
            </Text>
          </TouchableOpacity>
        </>
      )}
      
      <LanguageSwitcher />

      {/* User theme controls */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('appearance') || 'Appearance'}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TextInput
          placeholder="#6C63FF"
          placeholderTextColor={colors.muted}
          value={colorInput}
          onChangeText={setColorInput}
          style={{ flex: 1, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, color: colors.text, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 }}
        />
        <TouchableOpacity onPress={applyColor} style={{ backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>{t('apply') || 'Apply'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => dispatch(setDarkMode(!useSelector((s)=>s.ui.darkMode)))} style={{ marginTop: 8 }}>
        <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('toggle_dark_mode') || 'Toggle Dark Mode'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleLocale} style={{ marginTop: 8 }}>
        <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('toggle_language') || 'Toggle Language'}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 10 },
  avatar: { width: 84, height: 84, borderRadius: 42 },
  name: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginTop: 10 },
  title: { 
    color: theme.colors.muted, 
    marginTop: 4,
    textTransform: 'capitalize',
  },
  loginPrompt: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary + '15',
    borderRadius: theme.radius.md,
  },
  loginPromptText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  statsRow: { flexDirection: 'row', marginTop: 12 },
  stat: { alignItems: 'center', marginHorizontal: 16 },
  statNum: { fontWeight: '800', color: theme.colors.text },
  statLabel: { color: theme.colors.muted, fontSize: 12, marginTop: 2 },
  sectionTitle: { fontWeight: '700', color: theme.colors.text, marginVertical: 12 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.dangerLight || '#fee',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.radius.md,
    marginBottom: 20,
    gap: 8,
  },
  logoutText: {
    color: theme.colors.danger,
    fontWeight: '600',
    fontSize: 16,
  },
});


