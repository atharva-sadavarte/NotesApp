import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import api from '../api/axiosInstance.js';
import useAuthStore from '../store/authStore.js';
import Header from '../components/Header.js';
import CustomTextInput from '../components/CustomTextInput.js';
import CustomButton from '../components/CustomButton.js';

// ---------------------------
// Validation schema using yup
// ---------------------------
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function RegisterScreen({ navigation }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  // ---------------------------
  // Register API call
  // ---------------------------
  const register = async (data) => {
    try {
      await api.post('/auth/register', {
        email: data.email,
        password: data.password,
      });
      alert('Registration successful! Please login.');
      navigation.navigate('Login'); // Go to login after success
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Register" />
      <View style={styles.content}>
      {/* Email Input */}
      <Controller
        control={control}
        name="email"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
            <CustomTextInput
              name="Email"
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
              error={errors.email?.message}
          />
        )}
      />

      {/* Password Input */}
      <Controller
        control={control}
        name="password"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
            <CustomTextInput
              name="Password"
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
              error={errors.password?.message}
          />
        )}
      />

      {/* Confirm Password Input */}
      <Controller
        control={control}
        name="confirmPassword"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
            <CustomTextInput
              name="Confirm Password"
            placeholder="Confirm Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
              error={errors.confirmPassword?.message}
          />
        )}
      />

      {/* Submit Button */}
        <CustomButton name="Register" onPress={handleSubmit(register)} />

      {/* Go to Login */}
        <CustomButton
          name="Already have an account? Login"
          onPress={() => navigation.navigate('Login')}
          variant="text"
        />
      </View>
    </SafeAreaView>
  );
}

// ---------------------------
// Styles
// ---------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
});
