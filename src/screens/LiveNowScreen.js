import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Platform, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../theme/hooks';
import theme from '../theme';
import { t } from '../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIVE_KEY = '@elearning_live_now';

export default function LiveNowScreen({ navigation }) {
  const colors = useColors();
  const [live, setLive] = useState([]);

  useEffect(() => {
    const loadLive = async () => {
      try {
        const raw = await AsyncStorage.getItem(LIVE_KEY);
        const items = raw ? JSON.parse(raw) : [];
        setLive(items);
      } catch (error) {
        console.warn('Failed to load live sessions:', error);
      }
    };
    loadLive();
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={live}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={async () => {
            if (item.url) {
              // Open the live stream URL
              try {
                const supported = await Linking.canOpenURL(item.url);
                if (supported) {
                  await Linking.openURL(item.url);
                } else {
                  Alert.alert('Error', 'Cannot open this URL');
                }
              } catch (error) {
                Alert.alert('Error', 'Failed to open live stream');
              }
            } else {
              // Navigate to course details if it's a course
              navigation.navigate('CourseDetails', { courseId: item.id });
            }
          }}>
            <View style={styles.mediaWrap}>
              {item.imageUri ? (
                <Image
                  source={{ uri: item.imageUri }}
                  style={styles.thumb}
                  resizeMode="cover"
                  onError={(e) => {
                    console.warn('Image failed to load:', item.imageUri, e.nativeEvent);
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', item.imageUri);
                  }}
                />
              ) : item.url ? (
                <View style={[styles.thumb, { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
                  <Ionicons name="play-circle" size={32} color="#fff" />
                </View>
              ) : (
                <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
              )}
              <View style={styles.liveBadge}>
                <Ionicons name="radio" size={12} color="#fff" />
                <Text style={styles.liveText}>{t('live_now') || 'Live now'}</Text>
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
              <Text style={[styles.meta, { color: colors.muted }]} numberOfLines={1}>{item.author || item.url || '—'}</Text>
              <Text style={[styles.viewers, { color: colors.primary }]}>{item.viewers || 'Live Stream'}</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingVertical: theme.spacing.base }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: theme.spacing.base },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: theme.radius.lg, padding: theme.spacing.base, ...theme.shadow.card },
  mediaWrap: { position: 'relative' },
  thumb: { width: 96, height: 72, borderRadius: theme.radius.md },
  liveBadge: { position: 'absolute', left: 6, top: 6, backgroundColor: theme.colors.danger, borderRadius: theme.radius.full, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', ...(Platform.OS === 'web' ? { boxShadow: '0 2px 6px rgba(0,0,0,0.15)' } : {}) },
  liveText: { color: '#fff', fontWeight: '800', fontSize: 10, marginLeft: 6 },
  title: { fontWeight: '800', fontSize: theme.fontSize.md },
  meta: { marginTop: 4, fontSize: theme.fontSize.sm },
  viewers: { marginTop: 6, fontWeight: '700' },
});
