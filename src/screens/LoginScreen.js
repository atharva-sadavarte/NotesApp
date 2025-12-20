import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useAuthStore from '../store/authStore.js';
import Header from '../components/Header.js';
import CustomTextInput from '../components/CustomTextInput.js';
import CustomButton from '../components/CustomButton.js';

// ---------------------------
// Validation schema using yup
// ---------------------------
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginScreen({ navigation }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const login = useAuthStore((state) => state.login);

  // ---------------------------
  // Handle Login
  // ---------------------------
  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      // After login, navigation automatically changes because of AppNavigator
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Login" />
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

      {/* Submit Button */}
        <CustomButton name="Login" onPress={handleSubmit(onSubmit)} />

      {/* Go to Register */}
        <CustomButton
          name="Don't have an account? Register"
          onPress={() => navigation.navigate('Register')}
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
