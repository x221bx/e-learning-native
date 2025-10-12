import { Redirect } from 'expo-router';

export default function AdminIndex() {
  return <Redirect href="/(drawer)/(tabs)/Admin/AdminDashboard" />;
}

