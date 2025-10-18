import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../theme/hooks';
import theme from '../theme';
import QuickPrefsHeaderRight from './QuickPrefs';
import { goToSearch, goToPurchase, goToFavorites, goToWishlist, goToLogin, goToMessages, goToNotifications } from '../utils/nav';
import { useSelector } from 'react-redux';
import { selectCartDistinctCount } from '../store/slices/cartSlice';
import { DrawerActions } from '@react-navigation/native';

export default function AppHeader({ navigation, route, options, back }) {
  const colors = useColors();
  const insets = useSafeAreaInsets?.() || { top: Platform.OS === 'ios' ? 44 : 0 };
  const isAuthenticated = useSelector((s) => s.user?.isAuthenticated);
  const cartCount = useSelector(selectCartDistinctCount);
  const favCount = useSelector((s) => (s.favorites.ids || []).length);
  const wishlistCount = useSelector((s) => (s.wishlist.items || []).length);
  const title =
    (typeof options?.headerTitle === 'string' && options.headerTitle) ||
    (typeof options?.title === 'string' && options.title) ||
    route?.name || '';

  // No menu button - using tabs navigation

  const Right = options?.headerRight
    ? options.headerRight({ tintColor: '#fff', canGoBack: !!back })
    : (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => {
          try {
            if (isAuthenticated) {
              goToPurchase(navigation);
            } else {
              goToLogin(navigation);
            }
          } catch { }
        }} accessibilityRole="button" accessibilityLabel="Cart" style={{ marginRight: theme.spacing.base }}>
          <View>
            <Ionicons name="cart-outline" size={20} color={'#fff'} />
            {cartCount > 0 ? (
              <View style={{ position: 'absolute', top: -6, right: -8, minWidth: 14, height: 14, borderRadius: 7, backgroundColor: '#FF3B30', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
                <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>{cartCount}</Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => goToNotifications(navigation)} accessibilityRole="button" accessibilityLabel="Notifications" style={{ marginRight: theme.spacing.base }}>
          <Ionicons name="notifications-outline" size={20} color={'#fff'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => goToMessages(navigation)} accessibilityRole="button" accessibilityLabel="Messages" style={{ marginRight: theme.spacing.base }}>
          <Ionicons name="chatbubble-outline" size={20} color={'#fff'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => goToSearch(navigation)} accessibilityRole="button" accessibilityLabel="Search" style={{ marginRight: theme.spacing.base }}>
          <Ionicons name="search" size={22} color={'#fff'} />
        </TouchableOpacity>
        <QuickPrefsHeaderRight tint="light" />
      </View>
    );

  return (
    <View style={{ backgroundColor: colors.primary, paddingTop: insets.top }}>
      <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {back ? (
            <TouchableOpacity onPress={() => { try { navigation?.goBack?.(); } catch { } }} style={{ marginRight: theme.spacing.base }} accessibilityRole="button" accessibilityLabel="Go back">
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ) : null}
          <Text style={{ color: '#fff', fontSize: theme.fontSize.lg, fontWeight: '800' }} numberOfLines={1}>{title}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {Right}
        </View>
      </View>
    </View>
  );
}
