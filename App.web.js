import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform, ActivityIndicator, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import QuickPrefsHeaderRight from './src/components/QuickPrefs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import * as SplashScreen from 'expo-splash-screen';
import { useDispatch, useSelector } from 'react-redux';

if (Platform.OS !== 'web') {
  enableScreens(true);
}

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
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import AdminCoursesScreen from './src/screens/admin/AdminCoursesScreen';
import CourseFormScreen from './src/screens/admin/CourseFormScreen';
import AdminUsersScreen from './src/screens/admin/AdminUsersScreen';
import AdminCategoriesScreen from './src/screens/admin/AdminCategoriesScreen';
import AdminSettingsScreen from './src/screens/admin/AdminSettingsScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import LogoutScreen from './src/screens/auth/LogoutScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';

import theme from './src/theme';
import { t } from './src/i18n';
import { openDrawer } from './src/utils/nav';
import { withStore } from './src/store';
import { setDarkMode, setLocaleUI } from './src/store/uiSlice';

const Tab = createBottomTabNavigator();
const Stack = Platform.OS === 'web' ? createStackNavigator() : createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true, headerStyle: { backgroundColor: theme.colors.primary }, headerTintColor: '#fff', headerTitleStyle: { color: '#fff', fontWeight: '700' }, headerRight: () => <QuickPrefsHeaderRight />,
        headerLeft: () => (
          <TouchableOpacity onPress={() => openDrawer(navigation)} style={{ marginLeft: 12 }}>
            <Ionicons name="menu" size={22} color={'#fff'} />
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen}  />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen}  />
      <Stack.Screen name="CoursePlay" component={CoursePlayScreen} options={{ title: t('course') }} />
      <Stack.Screen name="TeacherProfile" component={TeacherProfileScreen} options={{ title: t('teacher_profile') }} />
      <Stack.Screen name="Messages" component={MessagesScreen} options={{ title: t('messages') }} />
    </Stack.Navigator>
  );
}

function SearchStack() {
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
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ title: t('search') }} />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen}  />
      <Stack.Screen name="CoursePlay" component={CoursePlayScreen} options={{ title: t('course') }} />
    </Stack.Navigator>
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
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'Welcome' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: t('login') || 'Login' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: t('create_account') || 'Create Account' }} />
    </Stack.Navigator>
  );
}

function AdminStack() {
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
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin' }} />
      <Stack.Screen name="AdminCourses" component={AdminCoursesScreen} options={{ title: t('admin') }} />
      <Stack.Screen name="AdminCourseForm" component={CourseFormScreen} options={{ title: t('course') }} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Admin Users' }} />
      <Stack.Screen name="AdminCategories" component={AdminCategoriesScreen} options={{ title: 'Categories' }} />
      <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
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
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  const isAuthenticated = useSelector((s) => s.user?.isAuthenticated);
  return (
    <Drawer.Navigator
      initialRouteName={isAuthenticated ? 'HomeTabs' : 'WelcomeStack'}
      useLegacyImplementation={false}
      screenOptions={{
        headerShown: false,
        drawerType: Platform.OS === 'web' ? 'front' : 'slide',
        swipeEnabled: Platform.OS !== 'web',
        lazy: false,
      }}
    >
      {!isAuthenticated ? (
        <Drawer.Screen name="WelcomeStack" component={AuthStack} options={{ title: 'Welcome' }} />
      ) : null}
      <Drawer.Screen name="HomeTabs" component={MainTabs} options={{ title: t('home') }} />
      <Drawer.Screen name="Messages" component={MessagesScreen} options={{ title: t('messages') }} />
      <Drawer.Screen name="Admin" component={AdminStack} options={{ title: 'Admin' }} />
      {isAuthenticated ? (
        <Drawer.Screen name="Logout" component={LogoutScreen} options={{ title: t('logout') || 'Logout' }} />
      ) : null}
    </Drawer.Navigator>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const darkMode = useSelector((s) => s.ui.darkMode);
  const locale = useSelector((s) => s.ui.locale);
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
      } catch (error) {
        // ignore
      } finally {
        setIsInitializing(false);
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


