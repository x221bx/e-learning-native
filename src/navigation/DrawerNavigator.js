import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../theme/hooks';
import theme from '../theme';
import { useSelector } from 'react-redux';
import { goToMessages, goToNotifications, goToSearch, goToFavorites, goToWishlist, goToPurchase, goToLogin } from '../utils/nav';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import TeachersScreen from '../screens/TeachersScreen';
import LiveNowScreen from '../screens/LiveNowScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import MyCoursesScreen from '../screens/MyCoursesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import WishlistScreen from '../screens/WishlistScreen';
import PurchaseScreen from '../screens/PurchaseScreen';

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation }) {
    const colors = useColors();
    const isAuthenticated = useSelector((s) => s.user?.isAuthenticated);

    const menuItems = [
        { name: 'Home', icon: 'home-outline', screen: 'Home' },
        { name: 'Teachers', icon: 'people-outline', screen: 'Teachers' },
        { name: 'Live Now', icon: 'play-circle-outline', screen: 'Live' },
        { name: 'Schedule', icon: 'calendar-outline', screen: 'Schedule' },
        { name: 'My Courses', icon: 'library-outline', screen: 'MyCourses' },
        { name: 'Messages', icon: 'chatbubble-outline', action: () => goToMessages(navigation) },
        { name: 'Notifications', icon: 'notifications-outline', action: () => goToNotifications(navigation) },
        { name: 'Search', icon: 'search-outline', action: () => goToSearch(navigation) },
        { name: 'Favorites', icon: 'bookmark-outline', action: () => goToFavorites(navigation) },
        { name: 'Wishlist', icon: 'heart-outline', action: () => goToWishlist(navigation) },
        { name: 'Cart', icon: 'cart-outline', action: () => isAuthenticated ? goToPurchase(navigation) : goToLogin(navigation) },
        { name: 'Profile', icon: 'person-outline', screen: 'Profile' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <Text style={styles.headerTitle}>E-Learning</Text>
            </View>
            <View style={styles.menu}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.menuItem, { borderBottomColor: colors.border }]}
                        onPress={() => {
                            if (item.action) {
                                item.action();
                            } else if (item.screen) {
                                navigation.navigate(item.screen);
                            }
                            navigation.closeDrawer();
                        }}
                    >
                        <Ionicons name={item.icon} size={20} color={colors.text} />
                        <Text style={[styles.menuText, { color: colors.text }]}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

export default function DrawerNavigator() {
    const isAuthenticated = useSelector((s) => s.user?.isAuthenticated);

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName={isAuthenticated ? 'Home' : 'Auth'}
        >
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Teachers" component={TeachersScreen} />
            <Drawer.Screen name="Live" component={LiveNowScreen} />
            <Drawer.Screen name="Schedule" component={ScheduleScreen} />
            <Drawer.Screen name="MyCourses" component={MyCoursesScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
            <Drawer.Screen name="Messages" component={MessagesScreen} />
            <Drawer.Screen name="Notifications" component={MessagesScreen} initialParams={{ type: 'notifications' }} />
            <Drawer.Screen name="Search" component={SearchScreen} />
            <Drawer.Screen name="Favorites" component={FavoritesScreen} />
            <Drawer.Screen name="Wishlist" component={WishlistScreen} />
            <Drawer.Screen name="Purchase" component={PurchaseScreen} />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: theme.spacing.xl,
        paddingTop: theme.spacing.xxl,
    },
    headerTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: '800',
        color: '#fff',
    },
    menu: {
        flex: 1,
        paddingTop: theme.spacing.lg,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.lg,
        borderBottomWidth: 1,
    },
    menuText: {
        fontSize: theme.fontSize.base,
        marginLeft: theme.spacing.md,
        fontWeight: '500',
    },
});
