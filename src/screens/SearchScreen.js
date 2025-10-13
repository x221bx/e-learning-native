import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import { useColors, withOpacity, mix } from '../theme/hooks';
import { categories, courses } from '../mock/data';
import SectionHeader from '../components/SectionHeader';
import ChipGroup from '../components/ChipGroup';
import CategoryGrid from '../components/CategoryGrid';
import CourseSection from '../components/CourseSection';
import SearchBar from '../components/SearchBar';
import ScreenContainer from '../components/layout/ScreenContainer';

import { t } from '../i18n';
const hotTopics = ['Java', 'SQL', 'Javascript', 'Python', 'Digital marketing', 'Photoshop', 'Watercolor'];

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const colors = useColors();
  const [active, setActive] = useState('');

  const startSearch = () => {
    navigation.navigate('SearchResults', { query: query || active });
  };

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <LinearGradient
        colors={[mix(colors.primary, -0.1), mix(colors.primary, 0.25)]}
        style={[styles.hero, { borderColor: withOpacity(colors.primary, 0.2) }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.heroTitle}>{t('search_courses') || 'Search courses & mentors'}</Text>
        <Text style={styles.heroSubtitle} numberOfLines={2}>
          {t('search_subtitle') || 'Use keywords, categories or mentors to find the perfect lesson for you.'}
        </Text>
      </LinearGradient>

      <View style={styles.section}>
        <SearchBar value={query} onChangeText={setQuery} onSubmit={startSearch} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('hot_topics')}</Text>
        <ChipGroup items={hotTopics} value={active} onChange={(topic) => { setActive(topic); setQuery(''); }} />
      </View>

      <View style={styles.section}>
        <SectionHeader title={t('categories')} onPress={() => {}} />
        <CategoryGrid items={categories} />
      </View>

      <View style={styles.section}>
        <CourseSection
          title={t('recommended_for_you')}
          data={courses}
          onPressItem={(item) => navigation.navigate('CourseDetails', { courseId: item.id })}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
  },
  hero: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
  },
  heroTitle: {
    color: '#fff',
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    color: withOpacity('#ffffff', 0.85),
    fontSize: theme.fontSize.md,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.extrabold,
  },
});
