import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function CustomButton({
  name,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  ...otherProps
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...otherProps}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary'
              ? '#3A3A3C' // Dark text color for loader contrast
              : '#8338EC' // Bold lavender for secondary
          }
        />
      ) : (
        <Text style={[styles.buttonText, styles[`${variant}Text`]]}>
          {name}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  primary: {
    backgroundColor: '#D9D4F1', // Soft lavender pastel (modern minimal)
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8338EC', // Bold lavender accent
  },
  text: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#3A3A3C', // Dark text for contrast
  },
  secondaryText: {
    color: '#8338EC', // Bold lavender
  },
  textText: {
    color: '#3A3A3C', // Minimal dark text
  },
  disabled: {
    opacity: 0.5,
  },
});
