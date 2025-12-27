import React from 'react';
import { Image as ImageIcon } from 'lucide-react-native';
import { Platform, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Sidebar } from '@/components/navigation/Sidebar';
import { 
  LayoutDashboard, 
  Utensils, 
  Settings, 
  Activity, 
  LineChart 
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';

/**
 * PROJECT CRADLE: CORE NAVIGATION ARCHITECTURE
 * Features: Obsidian Glassmorphism, Adaptive Platform Layouts, AAA+ Contrast
 */
export default function AppLayout() {
  const isWeb = Platform.OS === 'web';

  return (
    <View className="flex-row flex-1 bg-neutral-950">
      {/* 1. Desktop Sidebar: Obsidian Glassmorphism for Web */}
      {isWeb && (
        <Sidebar className="border-r w-72 border-white/5 bg-neutral-900/50" />
      )}
      
      <View className="flex-1">
        <Tabs screenOptions={{
          headerShown: false,
          // Hide Tab Bar on Web, apply Deep Obsidian Translucency on Mobile
          tabBarStyle: isWeb ? { display: 'none' } : {
            position: 'absolute',
            borderTopWidth: 0,
            backgroundColor: 'rgba(10, 10, 10, 0.7)', 
            height: 90,
            paddingBottom: 30,
          },
          tabBarBackground: () => (
            Platform.OS !== 'web' && (
              <BlurView intensity={80} tint="dark" className="absolute inset-0" />
            )
          ),
          tabBarActiveTintColor: '#4FD1C7', // Primary Teal
          tabBarInactiveTintColor: '#64748B',
          tabBarLabelStyle: { 
            fontWeight: '700', 
            fontSize: 10, 
            marginTop: -5,
            textTransform: 'uppercase',
            letterSpacing: 0.5
          },
        }}>
          {/* Dashboard: AI Insights & Quick Logs */}
          <Tabs.Screen 
            name="index" 
            options={{
              title: 'Today',
              tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={22} />
            }} 
          />
          
          {/* Feeding: Nutrition & Hydration Ledger */}
          <Tabs.Screen 
            name="feeding" 
            options={{
              title: 'Feeding',
              tabBarIcon: ({ color }) => <Utensils color={color} size={22} />
            }} 
          />

          {/* Growth: Weight & Percentile Analytics */}
          <Tabs.Screen 
            name="growth" 
            options={{
              title: 'Growth',
              tabBarIcon: ({ color }) => <LineChart color={color} size={22} />
            }} 
          />

          {/* Health: Vitals, Meds, & Vaccinations */}
          <Tabs.Screen 
            name="health" 
            options={{
              title: 'Health',
              tabBarIcon: ({ color }) => <Activity color={color} size={22} />
            }} 
          />

          {/* Settings: Family Sync & Unit Preferences */}
          <Tabs.Screen 
            name="settings" 
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => <Settings color={color} size={22} />
            }} 
          />

          <Tabs.Screen 
  name="journal" 
  options={{
    title: 'Journal',
    tabBarIcon: ({ color }) => <ImageIcon color={color} size={22} />
  }} 
/>
        </Tabs>
      </View>
    </View>
  );
}