import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import AppHeader from '../components/AppHeader';
import WelcomeHeaderRight from '../components/WelcomeHeaderRight';

import HomeScreen from '../screens/HomeScreen';
// Search removed from bottom tabs
import SearchScreen from '../screens/SearchScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import MyCoursesScreen from '../screens/MyCoursesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CourseDetailsScreen from '../screens/CourseDetailsScreen';
import CoursePlayScreen from '../screens/CoursePlayScreen';
import TeacherProfileScreen from '../screens/TeacherProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
// Purchase removed from bottom tabs (kept import for possible direct navigation)
import PurchaseScreen from '../screens/PurchaseScreen';
import WishlistScreen from '../screens/WishlistScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import AdminCoursesScreen from '../screens/admin/AdminCoursesScreen';
import CourseFormScreen from '../screens/admin/CourseFormScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminCategoriesScreen from '../screens/admin/AdminCategoriesScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LogoutScreen from '../screens/auth/LogoutScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminLiveScreen from '../screens/admin/AdminLiveScreen';
import AdminScheduleScreen from '../screens/admin/AdminScheduleScreen';
import LiveNowScreen from '../screens/LiveNowScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import TeachersScreen from '../screens/TeachersScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';

import theme from '../theme';
import { t } from '../i18n';

import { createStackNavigator } from '@react-navigation/stack';
const Tab = createBottomTabNavigator();
const Stack = Platform.OS === 'web' ? createNativeStackNavigator() : createNativeStackNavigator();
const RootStack = createStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
            <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: t('home') }} />
            <Stack.Screen name="Search" component={SearchScreen} options={{ title: t('search') }} />
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ title: t('search') }} />
            <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ title: t('wishlist') || 'Wishlist' }} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: t('favorites') || 'Favorites' }} />
            <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} options={{ title: t('course') }} />
            <Stack.Screen name="CoursePlay" component={CoursePlayScreen} options={{ title: t('course') }} />
            <Stack.Screen name="TeacherProfile" component={TeacherProfileScreen} options={{ title: t('teacher_profile') }} />
            <Stack.Screen name="Messages" component={MessagesScreen} options={{ title: t('messages') }} />
        </Stack.Navigator>
    );
}

function SearchStack() {
    return (
        <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
            <Stack.Screen name="SearchMain" component={SearchScreen} options={{ title: t('search') }} />
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ title: t('search') }} />
            <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} options={{ title: t('course') }} />
            <Stack.Screen name="CoursePlay" component={CoursePlayScreen} options={{ title: t('course') }} />
        </Stack.Navigator>
    );
}

function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={({ navigation }) => ({ title: 'Welcome', headerRight: () => <WelcomeHeaderRight navigation={navigation} />, headerLeft: () => null })} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: t('login') || 'Login' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: t('create_account') || 'Create Account' }} />
        </Stack.Navigator>
    );
}

function AdminStack() {
    return (
        <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: t('admin') }} />
            <Stack.Screen name="AdminCourses" component={AdminCoursesScreen} options={{ title: t('admin') }} />
            <Stack.Screen name="AdminCourseForm" component={CourseFormScreen} options={{ title: t('course') }} />
            <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: t('admin') }} />
            <Stack.Screen name="AdminCategories" component={AdminCategoriesScreen} options={{ title: 'Categories' }} />
            <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} options={{ title: 'Settings' }} />
            <Stack.Screen name="AdminLive" component={AdminLiveScreen} options={{ title: t('live_now') || 'Live Now' }} />
            <Stack.Screen name="AdminSchedule" component={AdminScheduleScreen} options={{ title: t('schedule') || 'Schedule' }} />
        </Stack.Navigator>
    );
}

function LiveStack() {
    return (
        <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
            <Stack.Screen name="LiveNowMain" component={LiveNowScreen} options={{ title: t('live_now') || 'Live Now' }} />
        </Stack.Navigator>
    );
}

function ScheduleStack() {
    return (
        <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
            <Stack.Screen name="ScheduleMain" component={ScheduleScreen} options={{ title: t('schedule') || 'Schedule' }} />
        </Stack.Navigator>
    );
}

function TeachersStack() {
    return (
        <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
            <Stack.Screen name="TeachersMain" component={TeachersScreen} options={{ title: 'Teachers' }} />
        </Stack.Navigator>
    );
}

function MessagesStack() {
    return (
        <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
            <Stack.Screen name="MessagesMain" component={MessagesScreen} options={{ title: t('messages') || 'Messages' }} />
        </Stack.Navigator>
    );
}

function NotificationsStack() {
    return (
        <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
            <Stack.Screen name="NotificationsMain" component={MessagesScreen} options={{ title: t('notifications') || 'Notifications' }} initialParams={{ type: 'notifications' }} />
        </Stack.Navigator>
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
                        Teachers: focused ? 'people' : 'people-outline',
                        Live: focused ? 'play-circle' : 'play-circle-outline',
                        Schedule: focused ? 'calendar' : 'calendar-outline',
                        Messages: focused ? 'chatbubble' : 'chatbubble-outline',
                        Notifications: focused ? 'notifications' : 'notifications-outline',
                        MyCourses: focused ? 'library' : 'library-outline',
                        Profile: focused ? 'person' : 'person-outline',
                        Admin: focused ? 'settings' : 'settings-outline',
                    };
                    const name = map[route.name] || 'ellipse-outline';
                    return <Ionicons name={name} color={color} size={size} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: t('home') }} />
            <Tab.Screen name="Teachers" component={TeachersStack} options={{ tabBarLabel: t('teachers') || 'Teachers' }} />
            <Tab.Screen name="Live" component={LiveStack} options={{ tabBarLabel: t('live_now') || 'Live' }} />
            <Tab.Screen name="Schedule" component={ScheduleStack} options={{ tabBarLabel: t('schedule') || 'Schedule' }} />
            <Tab.Screen name="MyCourses" component={MyCoursesScreen} options={{ headerShown: false, tabBarLabel: t('my_courses') }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false, tabBarLabel: t('profile') }} />
            {isAdmin ? (
                <Tab.Screen name="Admin" component={AdminStack} options={{ headerShown: false, tabBarLabel: 'Admin' }} />
            ) : null}
        </Tab.Navigator>
    );
}

export default function TabsNavigator() {
    // Only authenticated users skip the welcome/onboarding flow
    const isAuthenticated = useSelector((s) => s.user?.isAuthenticated);
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isAuthenticated ? 'MainTabs' : 'Auth'}>
            <RootStack.Screen name="MainTabs" component={MainTabs} />
            {/* Expose Purchase as a root-level screen so navigation helpers can reliably navigate to it */}
            <RootStack.Screen name="Purchase" component={PurchaseScreen} options={{ headerShown: false }} />
            <RootStack.Screen name="Auth" component={AuthStack} />
        </RootStack.Navigator>
    );
}
