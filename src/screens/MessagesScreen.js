import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useColors } from '../theme/hooks';

const MESSAGES_DATA = [
  { id: 'm1', title: 'Welcome to E-Learning', preview: 'Happy to have you here.', type: 'message' },
  { id: 'm2', title: 'New course released', preview: 'Check out UI Design Pro.', type: 'message' },
  { id: 'm3', title: 'Teacher update available', preview: 'John Smith updated their profile.', type: 'message' },
];

const NOTIFICATIONS_DATA = [
  { id: 'n1', title: 'Course reminder', preview: 'Don\'t forget your Python class today!', type: 'notification' },
  { id: 'n2', title: 'New assignment', preview: 'UI Design homework is now available.', type: 'notification' },
  { id: 'n3', title: 'Live session starting', preview: 'React workshop begins in 30 minutes.', type: 'notification' },
];

export default function MessagesScreen({ route }) {
  const colors = useColors();
  const isNotifications = route?.params?.type === 'notifications';
  const data = isNotifications ? NOTIFICATIONS_DATA : MESSAGES_DATA;
  const iconName = isNotifications ? 'notifications' : 'chatbubble-ellipses';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.row, { backgroundColor: colors.card }]}>
            <View style={[styles.icon, { backgroundColor: colors.surface }]}>
              <Ionicons name={iconName} size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.preview, { color: colors.muted }]}>{item.preview}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12 },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  title: { color: theme.colors.text, fontWeight: '700' },
  preview: { color: theme.colors.muted, marginTop: 2, fontSize: 12 },
  sep: { height: 10 },
});
