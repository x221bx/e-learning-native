import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import theme from '../../theme';
import { useColors } from '../../theme/hooks';
import { CoursesAPI } from '../../services/api';
import AdminLayout, { AdminButton, AdminCard } from '../../components/admin/AdminLayout';

export default function CourseFormScreen({ route, navigation }) {
  const colors = useColors();
  const id = route?.params?.id;
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('0');
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const c = await CoursesAPI.get(id);
        setTitle(c.title || '');
        setAuthor(c.author || '');
        setPrice(String(c.price || 0));
        setThumbnail(c.thumbnail || '');
      } catch (e) {}
    })();
  }, [id]);

  const submit = async () => {
    setLoading(true);
    try {
      const payload = { title, author, price: Number(price), thumbnail };
      if (id) await CoursesAPI.update(id, payload);
      else await CoursesAPI.create(payload);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={id ? 'Edit Course' : 'New Course'} subtitle="Fill in course details">
      <AdminCard>
        <Text style={[styles.label, { color: colors.muted }]}>Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} placeholder="Course title" placeholderTextColor={colors.textLight} />

        <Text style={[styles.label, { color: colors.muted }]}>Author</Text>
        <TextInput value={author} onChangeText={setAuthor} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} placeholder="Author" placeholderTextColor={colors.textLight} />

        <Text style={[styles.label, { color: colors.muted }]}>Price</Text>
        <TextInput value={price} onChangeText={setPrice} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} keyboardType="numeric" placeholderTextColor={colors.textLight} />

        <Text style={[styles.label, { color: colors.muted }]}>Thumbnail URL</Text>
        <TextInput value={thumbnail} onChangeText={setThumbnail} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} placeholder="https://..." placeholderTextColor={colors.textLight} />

        <View style={{ marginTop: 12, flexDirection: 'row', gap: 8 }}>
          <AdminButton label={loading ? 'Saving...' : (id ? 'Update' : 'Create')} icon="save" onPress={submit} />
          <AdminButton label="Cancel" variant="outline" icon="close" onPress={() => navigation.goBack()} />
        </View>
      </AdminCard>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { marginTop: 12, color: theme.colors.muted },
  input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 6 },
});
