import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import { reviews } from '../../mock/data';

export default function ReviewSection({ course }) {
  const courseReviews = reviews.filter((r) => r.courseId === course.id);
  const avg = course.rating;
  return (
    <View>
      <View style={styles.ratingBox}>
        <Text style={styles.ratingValue}>{avg.toFixed(1)}/5</Text>
        <Text style={styles.ratingCount}>({course.reviews}+ reviews)</Text>
      </View>
      {courseReviews.map((r) => (
        <View key={r.id} style={styles.reviewCard}>
          <Image source={{ uri: r.user.avatar }} style={styles.reviewAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.reviewName}>{r.user.name}</Text>
            <View style={{ flexDirection: 'row', marginTop: 2 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons key={i} name={i < r.rating ? 'star' : 'star-outline'} size={14} color={theme.colors.star} />
              ))}
            </View>
            <Text style={styles.reviewText}>{r.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  ratingBox: { alignItems: 'center', paddingVertical: 12 },
  ratingValue: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  ratingCount: { color: theme.colors.muted },
  reviewCard: { flexDirection: 'row', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 12, backgroundColor: '#fff', marginTop: 10 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  reviewName: { fontWeight: '700', color: theme.colors.text },
  reviewText: { color: theme.colors.text, marginTop: 6 },
});

