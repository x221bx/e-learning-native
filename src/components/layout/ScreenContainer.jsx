import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import theme from '../../theme';
import { useColors, withOpacity, mix } from '../../theme/hooks';

/**
 * ScreenContainer centralises the app background, padding, safe area handling
 * and gradient treatment so individual screens can stay focused on content.
 */
export default function ScreenContainer({
  children,
  scrollable = true,
  gradient = true,
  withPadding = true,
  footerSpacing = true,
  showScrollIndicator = false,
  contentContainerStyle,
  style,
  outerStyle,
  edges = ['top', 'left', 'right'],
  scrollProps = {},
  viewProps = {},
}) {
  const colors = useColors();

  const contentStyles = [
    styles.contentBase,
    withPadding && styles.contentPadding,
    footerSpacing && styles.footerSpacing,
    contentContainerStyle,
  ];

  const gradientColors = [
    withOpacity(mix(colors.primary, 0.1), 0.18),
    withOpacity(mix(colors.primary, 0.3), 0.08),
    colors.background,
    colors.backgroundLight || colors.background,
  ];

  return (
    <SafeAreaView style={[styles.safeArea, outerStyle]} edges={edges}>
      <View style={styles.fill}>
        {gradient ? (
          <LinearGradient colors={gradientColors} style={StyleSheet.absoluteFillObject} />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.background }]} />
        )}
        {scrollable ? (
          <ScrollView
            {...scrollProps}
            style={[styles.scroll, style]}
            contentContainerStyle={contentStyles}
            showsVerticalScrollIndicator={showScrollIndicator}
          >
            {children}
          </ScrollView>
        ) : (
          <View {...viewProps} style={[styles.static, style, ...contentStyles]}>
            {children}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  fill: { flex: 1, position: 'relative' },
  scroll: { flex: 1 },
  static: { flex: 1 },
  contentBase: {
    flexGrow: 1,
    paddingTop: theme.spacing.lg,
    width: '100%',
  },
  contentPadding: {
    paddingHorizontal: theme.spacing.xl,
  },
  footerSpacing: {
    paddingBottom: theme.spacing.xxl,
  },
});
