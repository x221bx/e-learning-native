import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';

export default function Index() {
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const hasGuest = useSelector((s) => s.user.isGuest);

  if (!isAuthenticated && !hasGuest) {
    return <Redirect href="/(auth)/Welcome" />;
  }

  return <Redirect href="/(drawer)/(tabs)/Home" />;
}

