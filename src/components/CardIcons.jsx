import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/favoritesSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';

export default function CardIcons({ course, small = false }) {
    const dispatch = useDispatch();
    const favIds = useSelector((s) => s.favorites.ids || []);
    const wishlist = useSelector((s) => s.wishlist.items || []);
    const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
    const isFav = favIds.includes(course.id);
    const inWishlist = wishlist.includes(course.id);

    const cartItems = useSelector((s) => s.cart.items || []);
    const enrolledIds = useSelector((s) => s.user.enrolled || []);
    const inCart = cartItems.some((it) => it.id === course.id);
    const isEnrolled = enrolledIds.includes(course.id);

    const onBookmarkPress = () => {
        // toggle favorite on press
        dispatch(toggleFavorite(course.id));
    };

    const onWishlistPress = () => {
        if (inWishlist) dispatch(removeFromWishlist({ id: course.id }));
        else dispatch(addToWishlist({ id: course.id }));
    };

    const onCartPress = () => {
        if (isEnrolled) {
            // Already purchased/enrolled - don't allow adding to cart again
            return;
        }
        if (inCart) dispatch(removeFromCart(course.id));
        else dispatch(addToCart({ id: course.id, title: course.title, teacher: course.author, price: course.price || 19.99, qty: 1 }));
    };

    return (
        <View style={[styles.container, small ? styles.small : null]} pointerEvents="box-none">
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={onBookmarkPress}>
                <Ionicons name={isFav ? 'bookmark' : 'bookmark-outline'} size={small ? 16 : 18} color={isFav ? theme.colors.primary : '#fff'} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, { marginTop: 8 }]} activeOpacity={0.8} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={onWishlistPress}>
                <Ionicons name={inWishlist ? 'heart' : 'heart-outline'} size={small ? 16 : 18} color={inWishlist ? theme.colors.secondary : '#fff'} />
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.iconBtn, styles.cart, { marginTop: 8 }, isEnrolled && styles.disabled]}
                activeOpacity={isEnrolled ? 1 : 0.8}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={onCartPress}
            >
                <Ionicons
                    name={isEnrolled ? 'checkmark-circle' : (inCart ? 'cart' : 'cart-outline')}
                    size={small ? 16 : 18}
                    color={isEnrolled ? theme.colors.success : (inCart ? theme.colors.secondary : (small ? theme.colors.primary : '#fff'))}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: theme.spacing.sm,
    },
    small: {
        right: theme.spacing.md,
        top: theme.spacing.sm,
    },
    iconBtn: {
        backgroundColor: 'rgba(0,0,0,0.08)',
        padding: 8,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 42,
    },
    cart: {
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    disabled: {
        opacity: 0.6,
    },
});
