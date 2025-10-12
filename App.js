import React, { useEffect, useState } from 'react';
import { Platform, I18nManager, ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';

// Redux
import { withStore } from './src/store';
import { loginSuccess, continueAsGuest } from './src/store/userSlice';
import { setDarkMode, setLocaleUI, setPrimaryColor } from './src/store/uiSlice';

// Utils
import theme from './src/theme';
import { t } from './src/i18n';

// Screens
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import LogoutScreen from './src/screens/auth/LogoutScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import SearchResultsScreen from './src/screens/SearchResultsScreen';
import MyCoursesScreen from './src/screens/MyCoursesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CourseDetailsScreen from './src/screens/CourseDetailsScreen';
import CoursePlayScreen from './src/screens/CoursePlayScreen';
import TeacherProfileScreen from './src/screens/TeacherProfileScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import AdminCoursesScreen from './src/screens/admin/AdminCoursesScreen';
import CourseFormScreen from './src/screens/admin/CourseFormScreen';
import AdminUsersScreen from './src/screens/admin/AdminUsersScreen';
import AdminCategoriesScreen from './src/screens/admin/AdminCategoriesScreen';
import AdminSettingsScreen from './src/screens/admin/AdminSettingsScreen';
import AdminLiveScreen from './src/screens/admin/AdminLiveScreen';
import AdminScheduleScreen from './src/screens/admin/AdminScheduleScreen';
import LiveNowScreen from './src/screens/LiveNowScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import TeachersScreen from './src/screens/TeachersScreen';

// Components
import AppHeader from './src/components/AppHeader';
import WelcomeHeaderRight from './src/components/WelcomeHeaderRight';

SplashScreen.preventAutoHideAsync();

const Stack = Platform.OS === 'web' ? createStackNavigator() : createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function CustomDrawerContent(props) {
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

// === STACKS ===
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={({ navigation }) => ({
          title: 'Welcome',
          headerRight: () => <WelcomeHeaderRight navigation={navigation} />,
          headerLeft: () => null,
        })}
      />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: t('login') }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: t('create_account') || 'Create Account' }} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: t('home') }} />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
      <Stack.Screen name="CoursePlay" component={CoursePlayScreen} />
      <Stack.Screen name="TeacherProfile" component={TeacherProfileScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} options={{ title: t('search') }} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
    </Stack.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminCourses" component={AdminCoursesScreen} />
      <Stack.Screen name="AdminCourseForm" component={CourseFormScreen} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
      <Stack.Screen name="AdminCategories" component={AdminCategoriesScreen} />
      <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
      <Stack.Screen name="AdminLive" component={AdminLiveScreen} />
      <Stack.Screen name="AdminSchedule" component={AdminScheduleScreen} />
    </Stack.Navigator>
  );
}

// === TABS ===
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
      <Tab.Screen name="MyCourses" component={MyCoursesScreen} options={{ tabBarLabel: t('my_courses') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('profile') }} />
      {isAdmin && <Tab.Screen name="Admin" component={AdminStack} options={{ tabBarLabel: 'Admin' }} />}
    </Tab.Navigator>
  );
}

// === DRAWER ===
function DrawerNavigator() {
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const isAdmin = useSelector((s) => s.user.isAdmin);

  return (
    <Drawer.Navigator
      initialRouteName={isAuthenticated ? 'HomeTabs' : 'WelcomeStack'}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: Platform.OS === 'web' ? 'front' : 'slide',
        drawerPosition: I18nManager.isRTL ? 'right' : 'left',
        overlayColor: 'rgba(0,0,0,0.3)',
      }}
    >
      <Drawer.Screen name="HomeTabs" component={MainTabs} options={{ title: t('home') }} />
      {!isAuthenticated && <Drawer.Screen name="WelcomeStack" component={AuthStack} options={{ title: 'Welcome' }} />}
      {isAdmin && <Drawer.Screen name="AdminPanel" component={AdminStack} options={{ title: t('admin') }} />}
      {isAuthenticated && <Drawer.Screen name="Logout" component={LogoutScreen} options={{ title: t('logout') }} />}
    </Drawer.Navigator>
  );
}

// === APP CONTENT ===
function AppContent() {
  const dispatch = useDispatch();
  const darkMode = useSelector((s) => s.ui.darkMode);
  const locale = useSelector((s) => s.ui.locale);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const dark = await AsyncStorage.getItem('@elearning_dark_mode');
        if (dark) dispatch(setDarkMode(JSON.parse(dark)));

        const lc = await AsyncStorage.getItem('@elearning_locale');
        if (lc) {
          dispatch(setLocaleUI(lc));
          require('./src/i18n').setLocale(lc);
        }

        const uc = await AsyncStorage.getItem('@elearning_user_primary_color');
        if (uc) dispatch(setPrimaryColor(uc));

        const raw = await AsyncStorage.getItem('@elearning_auth_state');
        if (raw) {
          const obj = JSON.parse(raw);
          if (obj?.user) dispatch(loginSuccess(obj.user));
          else if (obj?.isGuest) dispatch(continueAsGuest());
        }
      } catch {}
      setIsInitializing(false);
      SplashScreen.hideAsync();
    };
    initialize();
  }, [dispatch]);

  const navTheme = darkMode ? DarkTheme : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: theme.colors.background } };

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
