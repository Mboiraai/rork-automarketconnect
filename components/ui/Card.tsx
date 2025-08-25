import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import theme from '@/lib/theme';

export type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  padded?: boolean;
  elevated?: boolean;
  style?: ViewStyle;
  testID?: string;
};

function CardComponent({ children, onPress, padded = true, elevated = true, style, testID }: CardProps) {
  const content = (
    <View style={[styles.base, elevated ? styles.elevated : null, padded ? styles.padded : null, style]} testID={testID}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={{ borderRadius: theme.radius.lg }}>
        <View style={{ borderRadius: theme.radius.lg, overflow: 'hidden' }}>{content}</View>
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  padded: {
    padding: theme.spacing.lg,
  },
  elevated: {
    ...theme.shadows.md,
  },
});

export default memo(CardComponent);
