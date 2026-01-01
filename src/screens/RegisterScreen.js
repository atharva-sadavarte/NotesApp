// @ts-nocheck
import React from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Text, 
  TouchableOpacity,
  Alert // Use Alert.alert instead of web-style alert()
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// 1. Clean Absolute Imports (Removed .js)
import api from '@api/axiosInstance';
import { CustomTextInput, CustomButton, Header } from '@components'; 

// 2. Validation schema (Defined outside to prevent re-creation on render)
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function RegisterScreen({ navigation }) {
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onRegister = async (data) => {
    try {
      await api.post('/auth/register', {
        email: data.email,
        password: data.password,
      });
      Alert.alert('Success', 'Registration successful! Please login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        // keyboardVerticalOffset={64} // Adjust if header overlaps
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Header title="Register" />

          <View style={styles.formCard}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  label="Email"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  label="Password"
                  placeholder="Enter password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  label="Confirm Password"
                  placeholder="Confirm password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <CustomButton
              title="Register"
              onPress={handleSubmit(onRegister)}
              loading={isSubmitting}
              style={styles.registerButton}
            />

            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginPrompt}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    // Standard shadow for 2026 UI
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  registerButton: {
    marginTop: 10,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginPrompt: {
    fontSize: 15,
    color: '#64748B',
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4F46E5',
  },
});