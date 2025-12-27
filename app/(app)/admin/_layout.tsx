/**
 * PROJECT CRADLE: ADMIN NAVIGATION CORE V4.1
 * Path: app/(app)/admin/_layout.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617)
 * FIXES:
 * - Routing: Fixed TypeScript error by correcting Redirect href.
 * - Security: Strict RBAC gate ensures only ADMIN role can see this tab.
 * - Icons: Explicitly assigned ShieldAlert and Users icons.
 */

import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Users, ShieldAlert } from 'lucide-react-native';
import { Platform, ActivityIndicator, View } from 'react-native';
import { Theme } from '@/lib/shared/Theme';
import { useAuth } from '@/context/auth';

export default function AdminLayout() {
  const { profile, isLoading: authLoading } = useAuth();

  // --- 1. SYSTEM GATE: LOADING STATE ---
  if (authLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Theme.colors.primary} size="large" />
      </View>
    );
  }

  // --- 2. SECURITY GATE: STRICT ADMIN ONLY ---
  // FIXED: Corrected href format to resolve TS error 2820
  if (profile?.role !== 'ADMIN') {
    return <Redirect href="/(app)" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#020617', 
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.08)',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          paddingTop: 12,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: Theme.colors.primary, // #4FD1C7
        tabBarInactiveTintColor: '#475569',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '900',
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Console',
          // FIXED: Explicit icon assignment
          tabBarIcon: ({ color }) => (
            <ShieldAlert size={24} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Directory',
          // FIXED: Explicit icon assignment
          tabBarIcon: ({ color }) => (
            <Users size={24} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}