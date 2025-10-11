import { useSelector } from 'react-redux';
import { colorsLight, colorsDark } from './palette';

export function useColors() {
  const isDark = useSelector((s) => s.ui?.darkMode);
  const primaryOverride = useSelector((s) => s.ui?.primaryColor);
  const base = isDark ? colorsDark : colorsLight;
  if (!primaryOverride) return base;
  return { ...base, primary: primaryOverride, primaryDark: primaryOverride, primaryLight: primaryOverride };
}

