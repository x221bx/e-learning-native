import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Platform, ActivityIndicator, View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import QuickPrefsHeaderRight from './src/components/QuickPrefs';
import WelcomeHeaderRight from './src/components/WelcomeHeaderRight';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import * as SplashScreen from 'expo-splash-screen';
import { useDispatch, useSelector } from 'react-redux';

if (Platform.OS !== 'web') {
  enableScreens(true);
}

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import SearchResultsScreen from './src/screens/SearchResultsScreen';
import MyCoursesScreen from './src/screens/MyCoursesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CourseDetailsScreen from './src/screens/CourseDetailsScreen';
import CoursePlayScreen from './src/screens/CoursePlayScreen';
import TeacherProfileScreen from './src/screens/TeacherProfileScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import AdminCoursesScreen from './src/screens/admin/AdminCoursesScreen';
import CourseFormScreen from './src/screens/admin/CourseFormScreen';
import AdminUsersScreen from './src/screens/admin/AdminUsersScreen';
import AdminCategoriesScreen from './src/screens/admin/AdminCategoriesScreen';
import AdminSettingsScreen from './src/screens/admin/AdminSettingsScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import LogoutScreen from './src/screens/auth/LogoutScreen';

// Auth
import { loginSuccess, continueAsGuest, logout } from './src/store/userSlice';

import theme from './src/theme';
import { t } from './src/i18n';
import { withStore } from './src/store';
// Auth removed: no user loading
import { setDarkMode, setLocaleUI, setPrimaryColor } from './src/store/uiSlice';
import { openDrawer } from './src/utils/nav';

const Tab = createBottomTabNavigator();
const Stack = Platform.OS === 'web' ? createStackNavigator() : createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const colors = theme.colors;
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const isAdmin = useSelector((s) => s.user.isAdmin);
  const user = useSelector((s) => s.user.user);
  const name = (user?.name && String(user.name).trim()) || 'Learner';

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontWeight: '800', fontSize: 16 }}>{t('hello_name', { name })} 👋</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// Inline Auth Screens
function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const onLogin = async () => {
    const user = {
      id: Date.now(),
      name: name || 'Learner',
      email: email || 'user@example.com',
      role: 'user',
      avatar: 'https://i.pravatar.cc/150?img=3',
    };
    dispatch(loginSuccess(user));
    try { await AsyncStorage.setItem('@elearning_auth_state', JSON.stringify({ user })); } catch {}
    navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 10 }}>{t('login')}</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 10 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 10 }} />
      <TouchableOpacity onPress={onLogin} activeOpacity={0.85} style={{ marginTop: 16, backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>{t('login')}</Text>
      </TouchableOpacity>
    </View>
  );
}

function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onRegister = async () => {
    const user = {
      id: Date.now(),
      name: name || 'Learner',
      email: email || 'user@example.com',
      role: 'user',
      avatar: 'https://i.pravatar.cc/150?img=4',
    };
    dispatch(loginSuccess(user));
    try { await AsyncStorage.setItem('@elearning_auth_state', JSON.stringify({ user })); } catch {}
    navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 10 }}>{t('create_account') || 'Create Account'}</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 10 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 10 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 10 }} />
      <TouchableOpacity onPress={onRegister} activeOpacity={0.85} style={{ marginTop: 16, backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>{t('create_account') || 'Create Account'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function LogoutScreen({ navigation }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const run = async () => {
      dispatch(logout());
      try { await AsyncStorage.removeItem('@elearning_auth_state'); } catch {}
    };
    run();
  }, [dispatch]);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerShown: true, headerStyle: { backgroundColor: theme.colors.primary }, headerTintColor: '#fff', headerTitleStyle: { color: '#fff', fontWeight: '700' }, headerRight: () => <QuickPrefsHeaderRight />,
        headerLeft: () => (
          <TouchableOpacity onPress={() => openDrawer(navigation)} style={{ marginLeft: 12 }}>
            <Ionicons name="menu" size={22} color={'#fff'} />
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={({ navigation }) => ({
          title: 'Welcome',
          headerRight: () => <WelcomeHeaderRight navigation={navigation} />,
          headerLeft: () => null,
        })}
      />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={({ navigation }) => ({ headerShown: true, headerStyle: { backgroundColor: theme.colors.primary }, headerTintColor: '#fff', headerTitleStyle: { color: '#fff', fontWeight: '700' }, headerRight: () => <QuickPrefsHeaderRight />, headerLeft: () => (
      <TouchableOpacity onPress={() => openDrawer(navigation)} style={{ marginLeft: 12 }}>
        <Ionicons name="menu" size={22} color={'#fff'} />
      </TouchableOpacity>
    ) })}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CoursePlay" component={CoursePlayScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TeacherProfile" component={TeacherProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Messages" component={MessagesScreen} options={{ title: t('messages') }} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={({ navigation }) => ({ headerShown: true, headerStyle: { backgroundColor: theme.colors.primary }, headerTintColor: '#fff', headerTitleStyle: { color: '#fff', fontWeight: '700' }, headerRight: () => <QuickPrefsHeaderRight />, headerLeft: () => (
      <TouchableOpacity onPress={() => openDrawer(navigation)} style={{ marginLeft: 12 }}>
        <Ionicons name="menu" size={22} color={'#fff'} />
      </TouchableOpacity>
    ) })}>
      <Stack.Screen name="SearchMain" component={SearchScreen}  />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ title: t('search') }} />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CoursePlay" component={CoursePlayScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator screenOptions={({ navigation }) => ({ headerShown: false })}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin' }} />
      <Stack.Screen name="AdminCourses" component={AdminCoursesScreen} options={{ title: t('admin') }} />
      <Stack.Screen name="AdminCourseForm" component={CourseFormScreen} options={{ title: t('course') }} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Admin Users' }} />
      <Stack.Screen name="AdminCategories" component={AdminCategoriesScreen} options={{ title: 'Categories' }} />
      <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}

// MessagesScreen is provided from src/screens/MessagesScreen

function DrawerNavigator() {
  const isAuthenticated = useSelector((s) => s.user?.isAuthenticated);
  const isAdmin = useSelector((s) => s.user?.isAdmin);
  return (
    <Drawer.Navigator
      initialRouteName={isAuthenticated ? 'HomeTabs' : 'WelcomeStack'}
      useLegacyImplementation={false}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: Platform.OS === 'web' ? 'front' : 'slide',
        swipeEnabled: Platform.OS !== 'web',
        lazy: false,
      }}
    >
      <Drawer.Screen name="HomeTabs" component={MainTabs} options={{ title: t('home') }} />
      <Drawer.Screen name="Messages" component={MessagesScreen} options={{ title: t('messages') }} />
      {!isAuthenticated ? (
        <Drawer.Screen name="WelcomeStack" component={AuthStack} options={{ title: 'Welcome' }} />
      ) : null}
      {isAdmin ? (
        <Drawer.Screen name="AdminPanel" component={AdminStack} options={{ title: t('admin') }} />
      ) : null}
      {isAuthenticated ? (
        <Drawer.Screen name="Logout" component={LogoutScreen} options={{ title: t('logout') }} />
      ) : null}
    </Drawer.Navigator>
  );
}

function MainTabs() {
  const isAdmin = useSelector((s) => s.user?.isAdmin);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: { height: 58, paddingBottom: 6 },
        tabBarIcon: ({ color, size, focused }) => {
          const map = {
            Home: focused ? 'home' : 'home-outline',
            Search: focused ? 'search' : 'search-outline',
            MyCourses: focused ? 'book' : 'book-outline',
            Profile: focused ? 'person' : 'person-outline',
            Admin: focused ? 'settings' : 'settings-outline',
          };
          const name = map[route.name] || 'ellipse-outline';
          return <Ionicons name={name} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: t('home') }} />
      <Tab.Screen name="Search" component={SearchStack} options={{ tabBarLabel: t('search') }} />
      <Tab.Screen name="MyCourses" component={MyCoursesScreen} options={{ headerShown: false, tabBarLabel: t('my_courses') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false, tabBarLabel: t('profile') }} />
      {isAdmin ? (
        <Tab.Screen name="Admin" component={AdminStack} options={{ headerShown: false, tabBarLabel: 'Admin' }} />
      ) : null}
    </Tab.Navigator>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const darkMode = useSelector((s) => s.ui.darkMode);
  const locale = useSelector((s) => s.ui.locale);
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const isGuest = useSelector((s) => s.user.isGuest);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load UI preferences (dark mode + locale)
        try {
          const dark = await AsyncStorage.getItem('@elearning_dark_mode');
          if (dark != null) dispatch(setDarkMode(JSON.parse(dark)));
          const lc = await AsyncStorage.getItem('@elearning_locale');
          if (lc) {
            dispatch(setLocaleUI(lc));
            try { require('./src/i18n').setLocale(lc); } catch {}
          }
        } catch {}
        try {
          const uc = await AsyncStorage.getItem('@elearning_user_primary_color');
          if (uc) dispatch(setPrimaryColor(uc));
        } catch {}
        // Load auth state
        try {
          const raw = await AsyncStorage.getItem('@elearning_auth_state');
          if (raw) {
            const obj = JSON.parse(raw);
            if (obj?.user) dispatch(loginSuccess(obj.user));
            else if (obj?.isGuest) dispatch(continueAsGuest());
          }
        } catch {}
      } catch (error) {
        // ignore
      } finally {
        setIsInitializing(false);
        // Hide splash screen when app is ready
        SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, [dispatch]);

  const navTheme = darkMode ? DarkTheme : {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: theme.colors.background },
  };

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: darkMode ? '#111' : theme.colors.background }}>
      <NavigationContainer theme={navTheme} key={locale || 'en'}>
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        <DrawerNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function App() {
  return <AppContent />;
}

export default withStore(App);



