import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import theme from '../theme';
import { useColors } from '../theme/hooks';

export default function Tabs({ items = [], value, onChange }) {
  const colors = useColors();
  return (
    <View style={styles.container}>
      <View style={[styles.tabsWrapper, { backgroundColor: colors.surface }]}>
        {items.map((t, index) => {
          const isActive = value === t;
          return (
            <TouchableOpacity 
              key={t} 
              onPress={() => onChange?.(t)}
              style={[styles.tab, isActive && [styles.activeTab, { backgroundColor: colors.card }]]}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, { color: colors.muted }, isActive && [styles.activeTabText, { color: colors.primary }]]}>
                {t}
              </Text>
              {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  tabsWrapper: { 
    flexDirection: 'row',
    borderRadius: theme.radius.lg,
    padding: 4,
  },
  tab: { 
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    position: 'relative',
  },
  activeTab: { ...theme.shadow.sm },
  tabText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  activeTabText: { 
    fontWeight: theme.fontWeight.bold,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    borderRadius: theme.radius.full,
  },
});
