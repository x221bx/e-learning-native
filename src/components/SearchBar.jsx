import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { t } from '../i18n';

export default function SearchBar({ value, onChangeText, onSubmit, buttonLabel = 'Filter' }) {
  const colors = useColors();
  return (
    <View style={styles.container}>
      <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.primary} />
        <TextInput 
          value={value} 
          onChangeText={onChangeText} 
          placeholder={t('search_course_placeholder')} 
          placeholderTextColor={colors.textLight}
          style={[styles.input, { color: colors.text }]} 
          onSubmitEditing={onSubmit}
        />
        {value ? (
          <TouchableOpacity onPress={() => onChangeText('')} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </TouchableOpacity>
        ) : null}
      </View>
      <TouchableOpacity 
        style={[styles.filterButton, { backgroundColor: colors.primary }]} 
        onPress={onSubmit}
        activeOpacity={0.8}
      >
        <Ionicons name="options-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  searchBox: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.sm,
  },
  input: { 
    marginLeft: theme.spacing.sm,
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  filterButton: { 
    backgroundColor: theme.colors.primary,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.lg,
    ...theme.shadow.card,
  },
});
