import { Platform } from 'react-native';

const isWeb = Platform?.OS === 'web';

const webShadows = {
  none: { boxShadow: 'none' },
  sm: { boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  card: { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  md: { boxShadow: '0 6px 16px rgba(0,0,0,0.10)' },
  lg: { boxShadow: '0 10px 24px rgba(0,0,0,0.12)' },
  xl: { boxShadow: '0 15px 30px rgba(0,0,0,0.15)' },
};

const nativeShadows = {
  none: {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 30,
    elevation: 8,
  },
};

const theme = {
  colors: {
    primary: '#6C63FF',
    primaryDark: '#5849FF',
    primaryLight: '#8B85FF',
    primaryGradientStart: '#6C63FF',
    primaryGradientEnd: '#5849FF',
    
    secondary: '#FF6584',
    accent: '#00D9C0',
    
    background: '#F8F9FE',
    backgroundLight: '#FFFFFF',
    surface: '#F6F7FB',
    surfaceElevated: '#FFFFFF',
    card: '#FFFFFF',
    
    text: '#1A1D2E',
    textSecondary: '#4A5568',
    muted: '#6B7280',
    textLight: '#9CA3AF',
    
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    
    star: '#FFB800',
    success: '#10B981',
    successLight: '#D1FAE5',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 32,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  shadow: isWeb ? webShadows : nativeShadows,
  animation: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
};

export default theme;
