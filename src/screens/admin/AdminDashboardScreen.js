import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import AdminLayout, { AdminCard, AdminButton, AdminStat } from '../../components/admin/AdminLayout';
import { useColors } from '../../theme/hooks';
import theme from '../../theme';
import { useSelector } from 'react-redux';

export default function AdminDashboardScreen({ navigation }) {
  const colors = useColors();
  const courses = useSelector((s) => s.courses?.list || []);
  const users = useSelector((s) => s.user?.all || []);

  const stats = useMemo(() => {
    const totalCourses = courses.length || 0;
    const published = courses.filter((c) => c.published).length;
    const drafts = totalCourses - published;
    const totalUsers = users.length || 0;
    const teachers = users.filter((u) => u.role === 'teacher').length;
    return { totalCourses, published, drafts, totalUsers, teachers };
  }, [courses, users]);

  return (
    <AdminLayout
      title="Admin Panel"
      subtitle="Overview and quick actions"
      actions={[
        { label: 'New Course', icon: 'add', onPress: () => navigation.navigate('AdminCourseForm') },
        { label: 'Settings', icon: 'settings', variant: 'outline', onPress: () => navigation.navigate('AdminSettings') },
      ]}
    >
      <View style={styles.grid}>
        <AdminStat label="Courses" value={stats.totalCourses} icon="book" />
        <AdminStat label="Published" value={stats.published} icon="cloud-done" color={colors.success} />
        <AdminStat label="Drafts" value={stats.drafts} icon="cloud-offline" color={colors.warning} />
        <AdminStat label="Users" value={stats.totalUsers} icon="people" />
        <AdminStat label="Teachers" value={stats.teachers} icon="school" />
      </View>

      <AdminCard title="Quick Links" style={{ marginTop: theme.spacing.base }}>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <AdminButton label="Manage Courses" icon="book" onPress={() => navigation.navigate('AdminCourses')} />
          <AdminButton label="Users" icon="people" variant="outline" onPress={() => navigation.navigate('AdminUsers')} />
          <AdminButton label="Categories" icon="pricetags" variant="outline" onPress={() => navigation.navigate('AdminCategories')} />
        </View>
      </AdminCard>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});

