export function openDrawer(navigation) {
  try {
    // No drawer in the app anymore. As a fallback, try to navigate to a 'Profile' or 'Menu' route
    if (navigation?.navigate) {
      // If there is a Menu or Profile screen, prefer Menu then Profile
      const tryMenu = () => navigation.navigate('Menu');
      const tryProfile = () => navigation.navigate('Profile');
      try {
        tryMenu();
        return true;
      } catch (e) {
        tryProfile();
        return true;
      }
    }
  } catch { }
  return false;
}

export function goToMessages(navigation) {
  navigation?.navigate?.('Messages');
}

export function goToNotifications(navigation) {
  navigation?.navigate?.('Notifications');
}

export function goToLogin(navigation) {
  try {
    // Prefer navigating to the Auth stack (Auth -> Login)
    if (navigation?.navigate) {
      try { navigation.navigate('Auth', { screen: 'Login' }); return; } catch { }
      try { navigation.navigate('Login'); return; } catch { }
    }
    const p = navigation?.getParent?.();
    if (p?.navigate) {
      try { p.navigate('Auth', { screen: 'Login' }); return; } catch { }
      try { p.navigate('Login'); return; } catch { }
    }
    const gp = navigation?.getParent?.()?.getParent?.();
    if (gp?.navigate) {
      try { gp.navigate('Auth', { screen: 'Login' }); return; } catch { }
      try { gp.navigate('Login'); return; } catch { }
    }
  } catch { }
}

export function goToProfile(navigation) {
  navigation?.navigate?.('Profile');
}

export function goToCourseDetails(navigation, courseId) {
  navigation?.navigate?.('CourseDetails', { courseId });
}

export function goToSearch(navigation) {
  try {
    if (navigation?.navigate?.('Search')) return;
  } catch { }
  try { const p = navigation?.getParent?.(); if (p?.navigate?.('Search')) return; } catch { }
  try { const gp = navigation?.getParent?.()?.getParent?.(); gp?.navigate?.('Search'); } catch { }
}

export function goToPurchase(navigation, params) {
  try {
    // Try to get the root navigator first
    const root = navigation?.getParent?.()?.getParent?.();
    if (root?.navigate) {
      root.navigate('Purchase', params);
      return;
    }
  } catch { }
  try {
    // Try parent navigator
    const p = navigation?.getParent?.();
    if (p?.navigate) {
      p.navigate('Purchase', params);
      return;
    }
  } catch { }
  try {
    // Try current navigator
    if (navigation?.navigate) {
      navigation.navigate('Purchase', params);
      return;
    }
  } catch { }
  // Fallback to MyCourses
  try {
    navigation.navigate('MyCourses', params);
  } catch { }
}

export function goToFavorites(navigation) {
  try {
    if (navigation?.navigate) {
      try { navigation.navigate('MainTabs', { screen: 'Home', params: { screen: 'Favorites' } }); return; } catch { }
      try { navigation.navigate('Favorites'); return; } catch { }
    }
  } catch { }
  try { const p = navigation?.getParent?.(); if (p?.navigate) { try { p.navigate('MainTabs', { screen: 'Home', params: { screen: 'Favorites' } }); return; } catch { } try { p.navigate('Favorites'); return; } catch { } } } catch { }
  try { const gp = navigation?.getParent?.()?.getParent?.(); if (gp?.navigate) gp.navigate('Favorites'); } catch { }
}

export function goToWishlist(navigation) {
  try {
    if (navigation?.navigate) {
      try { navigation.navigate('MainTabs', { screen: 'Home', params: { screen: 'Wishlist' } }); return; } catch { }
      try { navigation.navigate('Wishlist'); return; } catch { }
    }
  } catch { }
  try { const p = navigation?.getParent?.(); if (p?.navigate) { try { p.navigate('MainTabs', { screen: 'Home', params: { screen: 'Wishlist' } }); return; } catch { } try { p.navigate('Wishlist'); return; } catch { } } } catch { }
  try { const gp = navigation?.getParent?.()?.getParent?.(); if (gp?.navigate) gp.navigate('Wishlist'); } catch { }
}
