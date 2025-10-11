import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import { useColors } from '../../theme/hooks';
import AdminLayout, { AdminCard, AdminButton } from '../../components/admin/AdminLayout';

const USERS_KEY = '@elearning_users';
const INVITE_KEY = '@elearning_invite_code';

export default function AdminUsersScreen() {
  const colors = useColors();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem(USERS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setUsers(list);
      const code = (await AsyncStorage.getItem(INVITE_KEY)) || '';
      setInviteCode(code);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const teachers = users.filter((u) => u.role === 'teacher');
  const pending = teachers.filter((u) => !u.isApproved);

  const setApproval = async (id, approved) => {
    try {
      const updated = users.map((u) => (u.id === id ? { ...u, isApproved: approved } : u));
      setUsers(updated);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updated));
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to update user');
    }
  };

  const generateInvite = async () => {
    // Simple 6-char code
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    setInviteCode(code);
    await AsyncStorage.setItem(INVITE_KEY, code);
    Alert.alert('Invite Code', `New code: ${code}`);
  };

  const saveInvite = async () => {
    await AsyncStorage.setItem(INVITE_KEY, (inviteCode || '').trim());
    Alert.alert('Saved', 'Invite code updated');
  };

  const renderRow = (item) => (
    <View key={item.id} style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.sub}>{item.email} • {item.isApproved ? 'Approved' : 'Pending'}</Text>
      </View>
      {item.isApproved ? (
        <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={() => setApproval(item.id, false)}>
          <Ionicons name="close" size={16} color="#fff" /><Text style={styles.btnText}>Revoke</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => setApproval(item.id, true)}>
          <Ionicons name="checkmark" size={16} color="#fff" /><Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <AdminLayout title="Users" subtitle="Approve teachers and manage invitations" scrollable={false}>
      <AdminCard title="Teacher Invite Code">
        <View style={styles.inviteRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter or generate code"
            value={inviteCode}
            onChangeText={setInviteCode}
            autoCapitalize="characters"
          />
          <AdminButton label="Save" icon="save" onPress={saveInvite} />
          <AdminButton label="Generate" icon="refresh" variant="outline" onPress={generateInvite} />
        </View>
      </AdminCard>

      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Teachers ({pending.length})</Text>
        {pending.length === 0 ? (
          <Text style={styles.empty}>No pending teachers</Text>
        ) : (
          pending.map(renderRow)
        )}

        <Text style={[styles.sectionTitle, { marginTop: 16, color: colors.text }]}>All Teachers ({teachers.length})</Text>
        {teachers.length === 0 ? (
          <Text style={styles.empty}>No teachers</Text>
        ) : (
          teachers.map(renderRow)
        )}
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
  sectionTitle: { fontWeight: '800', color: theme.colors.text, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, padding: 12, borderRadius: 12, marginBottom: 8, gap: 8 },
  name: { color: theme.colors.text, fontWeight: '700' },
  sub: { color: theme.colors.muted, fontSize: 12, marginTop: 2 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  btnPrimary: { backgroundColor: theme.colors.primary },
  btnDanger: { backgroundColor: theme.colors.danger },
  btnOutline: { borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: 'transparent' },
  btnText: { color: '#fff', fontWeight: '700' },
  empty: { color: theme.colors.muted, fontStyle: 'italic' },
  inviteBox: { backgroundColor: theme.colors.card, padding: 12, borderRadius: 12, marginBottom: 12 },
  inviteRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border },
});
