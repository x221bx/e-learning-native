import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useColors } from '../theme/hooks';
import theme from '../theme';
import { t } from '../i18n';

export default function FavoritesScreen({ navigation }) {
    const colors = useColors();
    const favIds = useSelector((s) => s.favorites.ids || []);
    const allCourses = require('../mock/data').courses || [];
    const items = allCourses.filter((c) => favIds.includes(c.id));

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, padding: theme.spacing.md }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: theme.spacing.md }}>{t('favorites') || 'Favorites'}</Text>
            {items.length === 0 ? (
                <Text style={{ color: colors.muted }}>{t('no_favorites') || 'No favorites yet'}</Text>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(i) => i.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('CourseDetails', { courseId: item.id })} style={{ paddingVertical: 12 }}>
                            <Text style={{ color: colors.text, fontWeight: '600' }}>{item.title}</Text>
                            <Text style={{ color: colors.muted, marginTop: 6 }}>{item.author}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}
