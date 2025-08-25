import { TextStyle, ViewStyle } from 'react-native';

export type ColorScale = {
  50: string; 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string; 800: string; 900: string;
};

export interface Theme {
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    gray: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    danger: ColorScale;
    info: ColorScale;
    surface: string;
    surfaceAlt: string;
    text: string;
    textMuted: string;
    border: string;
    overlay: string;
  };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  radius: { sm: number; md: number; lg: number; xl: number; full: number };
  typography: {
    display: TextStyle;
    heading: TextStyle;
    title: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
  shadows: {
    sm: ViewStyle;
    md: ViewStyle;
    lg: ViewStyle;
  };
  motion: { fast: number; normal: number; slow: number };
}

const gray: ColorScale = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
};

const primary: ColorScale = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6',
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
};

const secondary: ColorScale = {
  50: '#FFF7ED',
  100: '#FFEDD5',
  200: '#FED7AA',
  300: '#FDBA74',
  400: '#FB923C',
  500: '#F97316',
  600: '#EA580C',
  700: '#C2410C',
  800: '#9A3412',
  900: '#7C2D12',
};

const success: ColorScale = {
  50: '#ECFDF5',
  100: '#D1FAE5',
  200: '#A7F3D0',
  300: '#6EE7B7',
  400: '#34D399',
  500: '#10B981',
  600: '#059669',
  700: '#047857',
  800: '#065F46',
  900: '#064E3B',
};

const warning: ColorScale = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B',
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
};

const danger: ColorScale = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  500: '#EF4444',
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
};

const info: ColorScale = {
  50: '#ECFEFF',
  100: '#CFFAFE',
  200: '#A5F3FC',
  300: '#67E8F9',
  400: '#22D3EE',
  500: '#06B6D4',
  600: '#0891B2',
  700: '#0E7490',
  800: '#155E75',
  900: '#164E63',
};

export const theme: Theme = {
  colors: {
    primary,
    secondary,
    gray,
    success,
    warning,
    danger,
    info,
    surface: '#FFFFFF',
    surfaceAlt: gray[50],
    text: gray[900],
    textMuted: gray[500],
    border: gray[200],
    overlay: 'rgba(0,0,0,0.5)'
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  radius: { sm: 6, md: 8, lg: 12, xl: 16, full: 999 },
  typography: {
    display: { fontSize: 28, fontWeight: '800' as const },
    heading: { fontSize: 20, fontWeight: '700' as const },
    title: { fontSize: 16, fontWeight: '600' as const },
    body: { fontSize: 14, fontWeight: '400' as const },
    caption: { fontSize: 12, fontWeight: '400' as const },
  },
  shadows: {
    sm: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
    md: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
    lg: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  },
  motion: { fast: 150, normal: 250, slow: 350 },
};

export type ThemeColorKey = keyof Theme['colors'];
export function getColor(path: keyof Theme['colors'] | undefined): string | undefined {
  if (!path) return undefined;
  const value = theme.colors[path];
  return typeof value === 'string' ? value : undefined;
}

export default theme;
