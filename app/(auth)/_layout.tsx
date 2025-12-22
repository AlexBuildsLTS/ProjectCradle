import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

/**
 * PROJECT CRADLE: AUTH ARCHITECTURE
 * Background: Serene Sky (#F0F9FF)
 */
export default function AuthLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F0F9FF' }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F0F9FF' },
          animation: 'fade',
          gestureEnabled: false, // Prevents bypass of auth gates
        }}
      >
        <Stack.Screen name="login" options={{ title: 'Cradle Sign In' }} />
        <Stack.Screen name="register" options={{ title: 'Join Project Cradle' }} />
      </Stack>
    </View>
  );
}