import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Search, Filter, X } from 'lucide-react-native';
import theme from '@/lib/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
  showFilter?: boolean;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  onFilterPress, 
  placeholder = 'Search cars and parts...', 
  showFilter = true 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isFocused && styles.containerFocused]}>
      <Search size={20} color={theme.colors.gray[500]} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.gray[400]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        testID="search-input"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
          <X size={18} color={theme.colors.gray[500]} />
        </TouchableOpacity>
      )}
      {showFilter && (
        <TouchableOpacity onPress={onFilterPress} style={styles.filterButton} testID="filter-button">
          <Filter size={20} color={theme.colors.primary[800]} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  containerFocused: {
    borderColor: theme.colors.primary[500],
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  clearButton: {
    padding: 4,
    marginRight: 4,
  },
  filterButton: {
    padding: 8,
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.radius.md,
    marginLeft: 4,
  },
});