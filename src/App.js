import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import useAuthStore from './store/authStore.js';
import AuthNavigator from './navigation/AuthNavigator.js';
import AppNavigator from './navigation/AppNavigator.js';

export default function App() {
  const { token, restoreAuth, isLoading } = useAuthStore();

  useEffect(() => {
    restoreAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
