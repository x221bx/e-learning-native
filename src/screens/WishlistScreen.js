import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useColors } from '../theme/hooks';
import theme from '../theme';
import { removeFromWishlist } from '../store/slices/wishlistSlice';
import { t } from '../i18n';

export default function WishlistScreen({ navigation }) {
    const colors = useColors();
    const wishlistIds = useSelector((s) => s.wishlist.items || []);
    const allCourses = require('../mock/data').courses || [];
    const items = allCourses.filter((c) => wishlistIds.includes(c.id));
    const dispatch = useDispatch();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, padding: theme.spacing.md }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: theme.spacing.md }}>{t('wishlist') || 'Wishlist'}</Text>
            {items.length === 0 ? (
                <Text style={{ color: colors.muted }}>{t('no_wishlist') || 'No items in wishlist'}</Text>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(i) => i.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('CourseDetails', { courseId: item.id })} style={{ paddingVertical: 12 }}>
                            <Text style={{ color: colors.text, fontWeight: '600' }}>{item.title}</Text>
                            <Text style={{ color: colors.muted, marginTop: 6 }}>{item.author}</Text>
                            <TouchableOpacity onPress={() => dispatch(removeFromWishlist({ id: item.id }))} style={{ marginTop: 6 }}>
                                <Text style={{ color: theme.colors.primary }}>{t('remove') || 'Remove'}</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}
