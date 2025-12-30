/**
 * PROJECT CRADLE: ADMIN NAVIGATION CORE V4.2
 * Path: app/(app)/admin/_layout.tsx
 * THEME: PROJECT CRADLE (Teal #4FD1C7 | Obsidian #020617)
 * ENHANCEMENTS:
 * - Readability: Extracted styles to StyleSheet for better maintainability.
 * - Performance: Memoized styles and tab configurations to prevent unnecessary re-computations.
 * - Best Practices: Consistent use of Theme constants, added error handling for edge cases.
 * - Error Handling: Added fallback for authentication state to handle profile loading errors.
 */

import React, { useMemo } from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Users, ShieldAlert } from 'lucide-react-native';
import { Platform, ActivityIndicator, View, StyleSheet } from 'react-native';
import { Theme } from '@/lib/shared/Theme';
import { useAuth } from '@/context/auth';

const TAB_BAR_HEIGHT_IOS = 90;
const TAB_BAR_HEIGHT_ANDROID = 70;
const TAB_BAR_PADDING_BOTTOM_IOS = 30;
const TAB_BAR_PADDING_BOTTOM_ANDROID = 12;

const tabConfigurations = [
  {
    name: 'index',
    title: 'Console',
    icon: ({ color }: { color: string }) => (
      <ShieldAlert size={24} color={color} strokeWidth={2.5} />
    ),
  },
  {
    name: 'users',
    title: 'Directory',
    icon: ({ color }: { color: string }) => (
      <Users size={24} color={color} strokeWidth={2.5} />
    ),
  },
];

export default function AdminLayout() {
  const { profile, isLoading: authLoading } = useAuth();

  // Memoize styles to avoid re-computation on re-renders
  const tabBarStyles = useMemo(() => StyleSheet.create({
    tabBar: {
      backgroundColor: Theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: Theme.colors.border,
      height: Platform.OS === 'ios' ? TAB_BAR_HEIGHT_IOS : TAB_BAR_HEIGHT_ANDROID,
      paddingBottom: Platform.OS === 'ios' ? TAB_BAR_PADDING_BOTTOM_IOS : TAB_BAR_PADDING_BOTTOM_ANDROID,
      paddingTop: 12,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    tabBarLabel: {
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
  }), []);

  const loadingStyles = useMemo(() => StyleSheet.create({
    loadingContainer: {
      flex: 1,
      backgroundColor: Theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
  }), []);

  // --- 1. SYSTEM GATE: LOADING STATE ---
  if (authLoading) {
    return (
      <View style={loadingStyles.loadingContainer}>
        <ActivityIndicator color={Theme.colors.primary} size="large" />
      </View>
    );
  }

  // --- 2. SECURITY GATE: STRICT ADMIN ONLY ---
  // Enhanced: Added check for profile existence to handle authentication errors
  if (!profile || profile.role !== 'ADMIN') {
    // If profile is null, user is not authenticated; redirect handled by auth context
    // If role is not ADMIN, unauthorized access
    return <Redirect href="/(app)" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabBarStyles.tabBar,
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.textMuted,
        tabBarLabelStyle: tabBarStyles.tabBarLabel,
      }}
    >
      {tabConfigurations.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: tab.icon,
          }}
        />
      ))}
    </Tabs>
  );
}