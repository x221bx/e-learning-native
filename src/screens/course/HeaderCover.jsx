import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HeaderCover({ styles, course, navigation, isBookmarked, setIsBookmarked }) {
  return (
    <View style={styles.coverContainer}>
      <Image source={{ uri: course.thumbnail }} style={styles.cover} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.coverGradient} />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.bookmarkButton} onPress={() => setIsBookmarked(!isBookmarked)} activeOpacity={0.8}>
        <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

