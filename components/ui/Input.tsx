import React, { memo, useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import theme from '@/lib/theme';

export type InputProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
};

function InputComponent({ label, value, onChangeText, placeholder, helperText, errorText, secureTextEntry, disabled = false, left, right, containerStyle, inputStyle, testID }: InputProps) {
  const [focused, setFocused] = useState(false);
  const styles = getStyles(!!errorText, focused, disabled);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputRow}>
        {left ? <View style={{ marginRight: theme.spacing.xs }}>{left}</View> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray[400]}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          style={[styles.input, inputStyle]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          testID={testID}
        />
        {right ? <View style={{ marginLeft: theme.spacing.xs }}>{right}</View> : null}
      </View>
      {errorText ? (
        <Text style={styles.error}>{errorText}</Text>
      ) : helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const getStyles = (hasError: boolean, focused: boolean, disabled: boolean) => {
  const base = {
    borderColor: hasError ? theme.colors.danger[400] : focused ? theme.colors.primary[500] : theme.colors.border,
  } as const;

  return StyleSheet.create({
    container: { width: '100%' },
    label: { ...theme.typography.caption, color: theme.colors.textMuted, marginBottom: theme.spacing.xs },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: disabled ? theme.colors.gray[100] : theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      paddingHorizontal: theme.spacing.md,
      height: 48,
      ...base,
    },
    input: { flex: 1, ...theme.typography.body, color: theme.colors.text, paddingVertical: 0 },
    helper: { ...theme.typography.caption, color: theme.colors.textMuted, marginTop: theme.spacing.xs },
    error: { ...theme.typography.caption, color: theme.colors.danger[600], marginTop: theme.spacing.xs },
  });
};

export default memo(InputComponent);
