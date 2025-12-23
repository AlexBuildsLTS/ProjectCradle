import { supabase } from '@/utils/supabase';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import '../global.css';

/**
 * PROJECT CRADLE: CORE ADAPTIVE ROOT
 * Stabilizing high-fidelity surveillance pipeline.
 */
export default function RootLayout() {
  const { width } = useWindowDimensions();
  const segments = useSegments();
  const router = useRouter();
  const isLargeScreen = width > 1024; // Desktop breakpoint

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const inAuthGroup = segments[0] === '(auth)';

      if (!session && !inAuthGroup) {
        // Redirect to login if no session is active
        router.replace('/(auth)/login');
      } else if (session && inAuthGroup) {
        // Redirect to dashboard if session exists
        router.replace('/(tabs)/');
      }
    };
    checkUser();
  }, [segments]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F9FF' }}>
      <View
        style={{
          flex: 1,
          alignSelf: 'center',
          width: isLargeScreen ? 1400 : '100%', // Professional desktop centering
          maxWidth: '100%',
        }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        </Stack>
      </View>
    </View>
  );
}
