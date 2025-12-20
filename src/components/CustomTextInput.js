import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function CustomTextInput({
  name,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  multiline = false,
  error,
  autoCapitalize = 'none',
  ...otherProps
}) {
  return (
    <View style={styles.container}>
      {name && <Text style={styles.label}>{name}</Text>}
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          error && styles.inputError,
        ]}
        placeholder={placeholder || name}
        placeholderTextColor="#A1A1AA" // soft grey placeholder
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        {...otherProps}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1F2937', // dark slate grey, modern minimal
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB', // soft grey border
    borderRadius: 12, // slightly rounded for modern feel
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F8FAFF', // light pastel blue background
    color: '#111827', // dark text for readability
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  inputMultiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444', // bold red accent
  },
  error: {
    color: '#EF4444', // bold red for error
    fontSize: 12,
    marginTop: 4,
  },
});
