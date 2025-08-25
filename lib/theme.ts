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

// Brand Primary (Indigo-ish) anchored to 600/hover 700 provided
const primary: ColorScale = {
  50: '#EEF2FF',
  100: '#E0E7FF',
  200: '#C7D2FE',
  300: '#A5B4FC',
  400: '#818CF8',
  500: '#6676FF',
  600: '#2D5BFF', // brand & CTAs
  700: '#2449CC', // hover/active
  800: '#1D3AA3',
  900: '#172D7D',
};

// Secondary set to Slate scale with 900 as heading color (#0F172A)
const secondary: ColorScale = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
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
  500: '#38BDF8',
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
    surface: '#0B1220',
    surfaceAlt: '#101726',
    text: '#FFFFFF',
    textMuted: gray[400],
    border: '#1E293B',
    overlay: 'rgba(0,0,0,0.6)'
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  radius: { sm: 6, md: 8, lg: 12, xl: 16, full: 999 },
  typography: {
    display: { fontSize: 28, fontWeight: '800' as const, color: '#FFFFFF' },
    heading: { fontSize: 20, fontWeight: '700' as const, color: '#FFFFFF' },
    title: { fontSize: 16, fontWeight: '600' as const, color: '#FFFFFF' },
    body: { fontSize: 14, fontWeight: '400' as const, color: '#FFFFFF' },
    caption: { fontSize: 12, fontWeight: '400' as const, color: gray[400] },
  },
  shadows: {
    sm: { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
    md: { shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
    lg: { shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
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
