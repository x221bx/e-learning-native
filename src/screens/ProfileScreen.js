import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, TextInput, Platform, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { t } from '../i18n';
import { courses } from '../mock/data';
import { CourseCardVertical } from '../components/CourseCard';
import { useSelector, useDispatch } from 'react-redux';
import { goToLogin } from '../utils/nav';
import { setAdmin, logout, updateProfile } from '../store/userSlice';
import LanguageSwitcher from '../components/LanguageSwitcher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setPrimaryColor, setDarkMode, setLocaleUI } from '../store/uiSlice';
import { setLocale, getLocale } from '../i18n';
import { CoursesAPI } from '../services/api';
import { useCallback } from 'react';

export default function ProfileScreen({ navigation }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
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
      try { await AsyncStorage.removeItem('@elearning_auth_state'); } catch { }
    } catch { }
  };

  // Load saved user color on mount (if any)
  useEffect(() => {
    (async () => {
      try {
        const c = await AsyncStorage.getItem('@elearning_user_primary_color');
        if (c) dispatch(setPrimaryColor(c));
      } catch { }
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
    } catch { }
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
    try { await AsyncStorage.setItem('@elearning_user_primary_color', c); } catch { }
  };

  const toggleLocale = () => {
    const current = getLocale();
    const next = current === 'ar' ? 'en' : 'ar';
    setLocale(next);
    dispatch(setLocaleUI(next));
  };

  const pickAvatar = async () => {
    if (Platform.OS === 'web') {
      try { fileInputRef.current && fileInputRef.current.click(); } catch { }
      return;
    }
    try {
      const ImagePicker = await import('expo-image-picker');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setAvatarUri(res.assets[0].uri);
      }
    } catch { }
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
    try { dispatch(updateProfile(updates)); } catch { }
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
    } catch { }
    setEditMode(false);
  };

  // Subcomponent: list courses authored by current user with search, pagination and per-row loading
  function MyCoursesList({ user, navigation }) {
    const colors = useColors();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [offset, setOffset] = useState(0);
    const limit = 20;
    const [hasMore, setHasMore] = useState(true);
    const [query, setQuery] = useState('');
    const [loadingMap, setLoadingMap] = useState({}); // id -> bool
    const searchRef = useRef(null);

    const resetAndLoad = useCallback(() => {
      setItems([]);
      setOffset(0);
      setHasMore(true);
      load(true);
    }, [query, user]);

    const load = useCallback(async (reset = false) => {
      if (loading) return;
      setLoading(true);
      try {
        const res = await CoursesAPI.list({ offset: reset ? 0 : offset, limit, q: query || undefined, onlyPublished: false });
        const chunk = res.items || [];
        // Filter to courses authored by this user
        const my = chunk.filter((c) => (String(c.author || '').toLowerCase() === String(user?.name || '').toLowerCase()) || (c.teacherId && String(c.teacherId) === String(user?.id)));
        setItems((prev) => (reset ? my : [...prev, ...my]));
        setOffset((prev) => (reset ? chunk.length : prev + chunk.length));
        setHasMore(Boolean(res.hasMore));
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, [offset, limit, query, user, loading]);

    useEffect(() => { load(true); /* initial load */ }, []);

    // debounce search
    useEffect(() => {
      if (searchRef.current) clearTimeout(searchRef.current);
      searchRef.current = setTimeout(() => {
        setItems([]);
        setOffset(0);
        setHasMore(true);
        load(true);
      }, 400);
      return () => { if (searchRef.current) clearTimeout(searchRef.current); };
    }, [query]);

    const onRefresh = () => {
      setRefreshing(true);
      setItems([]);
      setOffset(0);
      setHasMore(true);
      load(true);
    };

    const onEndReached = () => {
      if (!hasMore || loading) return;
      load(false);
    };

    const onTogglePublish = (course) => {
      Alert.alert(
        course.published ? (t('unpublish') || 'Unpublish') : (t('publish') || 'Publish'),
        course.published ? (t('confirm_unpublish') || 'Are you sure you want to unpublish this course?') : (t('confirm_publish') || 'Publish this course?'),
        [
          { text: (t('cancel') || 'Cancel'), style: 'cancel' },
          {
            text: (t('ok') || 'OK'), onPress: async () => {
              setLoadingMap((m) => ({ ...m, [course.id]: true }));
              try {
                const updated = await CoursesAPI.setPublished(course.id, !course.published);
                setItems((prev) => prev.map((x) => (x.id === course.id ? updated : x)));
              } catch (e) {
                // ignore
              } finally {
                setLoadingMap((m) => ({ ...m, [course.id]: false }));
              }
            }
          }
        ]
      );
    };

    const renderItem = ({ item: c }) => (
      <View style={[styles.myCourseRow, { borderBottomColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>{c.title}</Text>
          <Text style={[styles.badge, c.published ? styles.badgePublished : styles.badgeUnpublished]}>{c.published ? t('published') : t('unpublished')}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.link, { color: colors.primary }]} onPress={() => navigation.navigate('AdminCourseForm', { id: c.id })}>{t('edit')}</Text>
          {loadingMap[c.id] ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 12 }} />
          ) : (
            <Text style={[styles.link, { color: colors.primary }]} onPress={() => onTogglePublish(c)}>{c.published ? t('unpublish') : t('publish')}</Text>
          )}
        </View>
      </View>
    );

    return (
      <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8, backgroundColor: colors.card }}>
        <View style={{ marginBottom: 8 }}>
          <TextInput
            placeholder={t('search_placeholder') || 'Search my courses...'}
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, color: colors.text, backgroundColor: colors.surface }}
          />
        </View>
        {items.length === 0 && !loading ? (
          <Text style={{ color: colors.muted }}>{t('no_courses') || 'No courses found'}</Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(c) => c.id}
            renderItem={renderItem}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 8 }} /> : null}
            ListEmptyComponent={<Text style={{ color: colors.muted, padding: 12 }}>{t('no_courses')}</Text>}
          />
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => {
            try {
              if (navigation?.canGoBack && navigation.canGoBack()) navigation.goBack();
              else navigation.navigate('Home');
            } catch { }
          }} style={styles.backBtn} />
          <Text style={styles.headerTitle}>{t('profile') || 'Profile'}</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>

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
                onChange: (e) => { try { const f = e.target?.files?.[0]; if (f) { const reader = new FileReader(); reader.onload = () => { const dataUrl = reader.result; if (typeof dataUrl === 'string') setAvatarUri(dataUrl); }; reader.readAsDataURL(f); } } catch { } },
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
                  {['frontend', 'ui-ux', 'backend', 'mobile', 'data-science', 'devops', 'ai-ml'].map((opt) => (
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
          <TouchableOpacity onPress={() => goToLogin(navigation)} style={[styles.logoutButton, { backgroundColor: theme.colors.surface }]} activeOpacity={0.85}>
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

        {/* My Courses (for teachers/admins) */}
        {user && (user.role === 'admin' || user.role === 'teacher') && (
          <View>
            <Text style={styles.sectionTitle}>{t('my_courses') || 'My Courses'}</Text>
            <MyCoursesList user={user} navigation={navigation} />
          </View>
        )}

        {user?.role === 'admin' && (
          <>
            <Text style={styles.sectionTitle}>{t('admin')}</Text>
            <Text style={{ color: theme.colors.muted, marginBottom: 6 }}>
              {t('admin_mode') || 'Admin mode'}: {isAdmin ? (t('on') || 'ON') : (t('off') || 'OFF')}
            </Text>
            <TouchableOpacity onPress={() => dispatch(setAdmin(!isAdmin))} style={{ padding: 8 }}>
              <Ionicons name={isAdmin ? 'shield-checkmark' : 'shield-outline'} size={20} color={theme.colors.primary} />
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
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <TouchableOpacity onPress={() => dispatch(setDarkMode(!useSelector((s) => s.ui.darkMode)))} style={{ padding: 10, borderRadius: 8, backgroundColor: colors.card }}>
            <Ionicons name="moon-outline" size={18} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleLocale} style={{ padding: 10, borderRadius: 8, backgroundColor: colors.card }}>
            <Ionicons name="language-outline" size={18} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Schedule')} style={{ padding: 10, borderRadius: 8, backgroundColor: colors.card }}>
            <Ionicons name="calendar-outline" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: {
    backgroundColor: theme.colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: theme.fontSize.lg,
    fontWeight: '800',
  },
  profileSection: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadow.sm,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginRight: theme.spacing.md },
  profileInfo: {
    flex: 1,
  },
  name: { fontSize: 20, fontWeight: '800', color: theme.colors.text },
  title: {
    color: theme.colors.muted,
    marginTop: 4,
    textTransform: 'capitalize',
    fontSize: theme.fontSize.base,
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


