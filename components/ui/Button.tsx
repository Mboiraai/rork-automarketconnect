import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, Platform } from 'react-native';
import theme from '@/lib/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

function ButtonComponent({ title, onPress, variant = 'primary', size = 'md', disabled = false, loading = false, fullWidth = false, style, textStyle, testID }: ButtonProps) {
  const styles = getStyles(variant, size, disabled || loading, fullWidth);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, style]}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary[600] : '#fff'} />
      ) : (
        <Text style={[styles.text, textStyle]} numberOfLines={1}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const getStyles = (variant: ButtonVariant, size: ButtonSize, disabled: boolean, fullWidth: boolean) => {
  const paddingY = size === 'sm' ? 8 : size === 'lg' ? 14 : 12;
  const paddingX = size === 'sm' ? 12 : size === 'lg' ? 18 : 16;
  const radius = theme.radius.lg;

  const base: ViewStyle = {
    paddingVertical: paddingY,
    paddingHorizontal: paddingX,
    borderRadius: radius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...(fullWidth ? { width: '100%' } : {}),
  };

  const textBase: TextStyle = {
    ...theme.typography.title,
  };

  let button: ViewStyle = { ...base };
  let text: TextStyle = { ...textBase };

  if (variant === 'primary') {
    button = { ...button, backgroundColor: disabled ? theme.colors.primary[700] : theme.colors.primary[600] };
    text = { ...text, color: '#fff' };
  } else if (variant === 'secondary') {
    button = { ...button, backgroundColor: disabled ? theme.colors.secondary[800] : theme.colors.secondary[700] };
    text = { ...text, color: '#fff' };
  } else if (variant === 'outline') {
    button = { ...button, backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.border };
    text = { ...text, color: theme.colors.text };
  } else if (variant === 'ghost') {
    button = { ...button, backgroundColor: Platform.OS === 'web' ? 'transparent' : 'rgba(45,91,255,0.08)' };
    text = { ...text, color: theme.colors.primary[400] };
  } else if (variant === 'danger') {
    button = { ...button, backgroundColor: disabled ? theme.colors.danger[700] : theme.colors.danger[600] };
    text = { ...text, color: '#fff' };
  }

  return StyleSheet.create({ button, text });
};

export default memo(ButtonComponent);
