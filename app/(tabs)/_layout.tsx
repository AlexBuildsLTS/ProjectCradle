import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  useWindowDimensions, 
  Image, 
  Platform,
  StyleSheet
} from 'react-native';
import { Tabs, useRouter, usePathname, Slot, Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  LifeBuoy,
  ShieldCheck,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  Moon,
  Baby,
  Activity
} from 'lucide-react-native';

// --- INTERNAL ARCHITECTURE ---
import { useAuthStore } from '../../src/store/auth/useAuthStore';

// 1. NAVIGATION CONFIGURATION (Pediatric Mapping)
type NavKey = 'Dashboard' | 'BerryAI' | 'Courses' | 'Support' | 'Admin' | 'Settings';

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
  label: string;
  roleRequired?: string[];
}

const NAV_MAP: Record<NavKey, NavItem> = {
  Dashboard: { name: 'index', icon: LayoutDashboard, path: '/(tabs)/', label: 'Command' },
  BerryAI:   { name: 'berry', icon: Sparkles, path: '/(tabs)/berry', label: 'Berry AI' },
  Courses:   { name: 'courses', icon: BookOpen, path: '/(tabs)/courses', label: 'Courses' },
  Support:   { name: 'support', icon: LifeBuoy, path: '/(tabs)/support', label: 'Support' },
  Admin:     { name: 'admin', icon: ShieldCheck, path: '/(tabs)/admin', label: 'System', roleRequired: ['ADMIN', 'SUPPORT'] },
  Settings:  { name: 'settings', icon: Settings, path: '/(tabs)/settings', label: 'Settings' },
};

// ============================================================================
// 2. DESKTOP COMPONENTS (Sidebar & TopBar)
// ============================================================================

const Sidebar = ({ role, pathname }: { role: string, pathname: string }) => {
  const router = useRouter();
  
  return (
    <View className="h-full p-6 border-r border-white w-72 bg-sky-50/50">
      <View className="flex-row items-center px-2 mb-10">
        <View className="items-center justify-center w-10 h-10 shadow-lg bg-mint-400 rounded-2xl shadow-mint-200">
          <Baby color="white" size={24} />
        </View>
        <Text className="ml-3 text-xl font-black tracking-tighter text-slate-700">Project Cradle</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.values(NAV_MAP).map((item) => {
          if (item.roleRequired && !item.roleRequired.includes(role)) return null;
          const isActive = pathname === item.path;

          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => router.push(item.path as any)}
              className={`flex-row items-center p-4 rounded-3xl mb-2 ${isActive ? 'bg-white shadow-sm' : 'opacity-60'}`}
            >
              <item.icon size={22} color={isActive ? '#10B981' : '#64748b'} />
              <Text className={`ml-4 font-bold ${isActive ? 'text-slate-700' : 'text-slate-500'}`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {/* System Integrity Badge */}
      <View className="bg-white/60 p-4 rounded-[30px] border border-white">
        <View className="flex-row items-center">
          <Activity size={14} color="#10B981" />
          <Text className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Surveillance Live</Text>
        </View>
      </View>
    </View>
  );
};

// ============================================================================
// 3. MAIN ORCHESTRATOR
// ============================================================================

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const pathname = usePathname();
  const { role, profile } = useAuthStore();
  const router = useRouter();

  // Unified loading and auth guard
  if (!profile && Platform.OS !== 'web') {
     // Optional: Redirect to login if needed
  }

  // --- VIEW A: MOBILE ADAPTIVE (Bottom Tabs + Header) ---
  if (isMobile) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#10B981',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarStyle: {
            position: 'absolute',
            borderTopWidth: 0,
            height: 90,
            paddingBottom: 30,
            backgroundColor: 'transparent',
          },
          tabBarBackground: () => (
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Command',
            tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="berry"
          options={{
            title: 'Berry AI',
            tabBarIcon: ({ focused }) => (
              <View className={`-mt-8 w-16 h-16 rounded-full items-center justify-center shadow-xl border-4 border-sky-50 ${focused ? 'bg-mint-400' : 'bg-white'}`}>
                <Sparkles color={focused ? 'white' : '#10B981'} size={28} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="support"
          options={{
            title: 'Support',
            tabBarIcon: ({ color }) => <LifeBuoy size={24} color={color} />,
          }}
        />
        {/* Hidden internal routes */}
        <Tabs.Screen name="admin" options={{ href: null }} />
        <Tabs.Screen name="courses" options={{ href: null }} />
        <Tabs.Screen name="settings" options={{ href: null }} />
      </Tabs>
    );
  }

  // --- VIEW B: DESKTOP COMMAND CENTER (Sidebar + Top Bar + Slot) ---
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F9FF', flexDirection: 'row' }}>
      {/* 1. Permanent Side Navigation */}
      <Sidebar role={role || 'MEMBER'} pathname={pathname} />

      {/* 2. Content Matrix */}
      <View style={{ flex: 1 }}>
        {/* Top Desktop Utility Bar */}
        <View className="flex-row items-center justify-between h-20 px-8 border-b border-white/50">
          <View>
            <Text className="text-xs font-bold tracking-widest uppercase text-slate-400">Surveillance Dashboard</Text>
            <Text className="text-2xl font-black text-slate-700">{profile?.baby_name || 'Baby'}'s Rhythm</Text>
          </View>
          
          <View className="flex-row items-center gap-6">
            <TouchableOpacity className="p-3 bg-white border shadow-sm rounded-2xl border-slate-100">
              <Bell size={20} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center gap-3">
              <Image 
                source={{ uri: `https://ui-avatars.com/api/?name=${profile?.full_name}&background=BAE6FD&color=0369a1` }} 
                className="w-10 h-10 border border-white rounded-2xl" 
              />
              <ChevronDown size={16} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* The Viewport Slot */}
        <View style={{ flex: 1, padding: 32 }}>
          <Slot />
        </View>
      </View>
    </SafeAreaView>
  );
}