import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function CustomTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  multiline = false,
  error,
  autoCapitalize = 'none',
  style,
  ...otherProps
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          error && styles.inputError,
          isFocused && styles.inputFocused,
          style,
        ]}
        placeholder={placeholder || label}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...otherProps}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10, // reduced from 10 to 6
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4, // reduced from 6
    color: '#1F2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F8FAFF',
    color: '#111827',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  inputFocused: {
    borderColor: '#4F46E5',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputMultiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 2, // reduced from 4
  },
});
