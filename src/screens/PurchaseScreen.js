import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { t } from '../i18n';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQty, clearCart, selectCartTotal } from '../store/slices/cartSlice';
import { enrollInCourse } from '../store/userSlice';
import { goToSearch, goToFavorites, goToWishlist, goToLogin } from '../utils/nav';
import { selectCartDistinctCount } from '../store/slices/cartSlice';

export default function PurchaseScreen({ navigation, route }) {
    const colors = useColors();
    const items = useSelector((s) => s.cart.items);
    const subtotal = useMemo(() => items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0), [items]);
    const taxes = useMemo(() => +(subtotal * 0.15).toFixed(2), [subtotal]);
    const total = useMemo(() => +(subtotal + taxes).toFixed(2), [subtotal, taxes]);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((s) => s.user?.isAuthenticated);
    const user = useSelector((s) => s.user?.user);
    const cartCount = useSelector(selectCartDistinctCount);
    const favCount = useSelector((s) => (s.favorites.ids || []).length);
    const wishlistCount = useSelector((s) => (s.wishlist.items || []).length);

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            goToLogin(navigation);
            return;
        }

        if (items.length === 0) {
            Alert.alert('Empty Cart', 'Your cart is empty. Add some courses first.');
            return;
        }

        // Direct checkout for demo purposes - no payment confirmation needed
        try {
            // Enroll user in all purchased courses
            for (const item of items) {
                dispatch(enrollInCourse(item.id));
            }

            // Persist enrolled courses to AsyncStorage
            try {
                const currentEnrolled = user?.enrolled || [];
                const newEnrolled = [...new Set([...currentEnrolled, ...items.map(item => item.id)])];
                await AsyncStorage.setItem('@elearning_enrolled_courses', JSON.stringify(newEnrolled));
            } catch (error) {
                console.warn('Failed to persist enrolled courses:', error);
            }

            // Clear cart after successful purchase
            dispatch(clearCart());

            Alert.alert(
                'Purchase Successful!',
                `You have been enrolled in ${items.length} course${items.length > 1 ? 's' : ''}.`,
                [
                    {
                        text: 'View My Courses',
                        onPress: () => navigation.navigate('MyCourses')
                    },
                    { text: 'OK' }
                ]
            );

            // Auto-navigate to My Courses after a short delay
            setTimeout(() => {
                navigation.navigate('MyCourses');
            }, 2000);
        } catch (error) {
            Alert.alert('Error', 'Failed to process purchase. Please try again.');
        }
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background, flexGrow: 1 }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>{t('purchase') || 'Purchase'}</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => goToFavorites(navigation)} style={styles.iconBtn}>
                        <View>
                            <Ionicons name="bookmark-outline" size={20} color={colors.text} />
                            {favCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{favCount}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => goToWishlist(navigation)} style={styles.iconBtn}>
                        <View>
                            <Ionicons name="heart-outline" size={20} color={colors.text} />
                            {wishlistCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{wishlistCount}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        if (isAuthenticated) {
                            // Already on purchase screen
                        } else {
                            goToLogin(navigation);
                        }
                    }} style={styles.iconBtn}>
                        <View>
                            <Ionicons name="cart-outline" size={20} color={colors.text} />
                            {cartCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{cartCount}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => goToSearch(navigation)} style={styles.iconBtn}>
                        <Ionicons name="search" size={22} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>
            {items.length === 0 ? (
                <Text style={{ color: colors.muted }}>{t('cart_empty') || 'Your cart is empty.'}</Text>
            ) : (
                <>
                    {items.map((it) => (
                        <View key={String(it.id)} style={[styles.row, { borderColor: colors.border, backgroundColor: colors.card }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: colors.text, fontWeight: '700' }}>{it.title}</Text>
                                <Text style={{ color: colors.muted }}>{it.teacher}</Text>
                            </View>
                            <Text style={{ color: colors.text }}>${((it.price || 0) * (it.qty || 1)).toFixed(2)} ({it.qty || 1}x)</Text>
                            <TouchableOpacity onPress={() => dispatch(removeFromCart(it.id))} style={{ marginLeft: 8 }}>
                                <Text style={{ color: theme.colors.danger, fontWeight: '700' }}>×</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <View style={{ height: 12 }} />
                    <View style={[styles.summaryRow]}>
                        <Text style={{ color: colors.muted }}>{t('subtotal') || 'Subtotal'}</Text>
                        <Text style={{ color: colors.text }}>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.summaryRow]}>
                        <Text style={{ color: colors.muted }}>{t('taxes') || 'Taxes'}</Text>
                        <Text style={{ color: colors.text }}>${taxes.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.summaryRow]}>
                        <Text style={{ color: colors.text, fontWeight: '800' }}>{t('total') || 'Total'}</Text>
                        <Text style={{ color: colors.text, fontWeight: '800' }}>${total.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity onPress={handleCheckout} style={[styles.btn, { backgroundColor: colors.primary }]} activeOpacity={0.85}>
                        <Text style={{ color: '#fff', fontWeight: '800' }}>{t('checkout') || 'Checkout'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => dispatch(clearCart())} style={[styles.btn, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: colors.border }]} activeOpacity={0.85}>
                        <Text style={{ color: colors.text, fontWeight: '700' }}>{t('delete') || 'Delete'}</Text>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backBtn: { marginRight: 12 },
    title: { fontSize: 20, fontWeight: '800', flex: 1 },
    headerRight: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: { marginLeft: 12 },
    badge: { position: 'absolute', top: -6, right: -8, minWidth: 14, height: 14, borderRadius: 7, backgroundColor: '#FF3B30', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
    badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
    row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    btn: { marginTop: 12, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
});



