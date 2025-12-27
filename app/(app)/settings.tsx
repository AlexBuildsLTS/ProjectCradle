import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Platform, Alert } from 'react-native';
import { useAuth } from '@/context/auth';
import { useBabyContext } from '@/hooks/useBabyContext';
import { useTheme } from '@/context/ThemeContext';
import { GlassCard } from '@/components/glass/GlassCard';
import { InviteCaregiver } from '@/components/settings/InviteCaregiver';
import { JoinFamily } from '@/components/settings/JoinFamily';
import { 
  Baby, 
  Bell, 
  CreditCard, 
  LogOut, 
  ChevronRight, 
  Ruler, 
  ShieldCheck, 
  Database,
  UserCircle,
  MoonStar
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

/**
 * PROJECT CRADLE: ENHANCED SETTINGS ENGINE
 * Features: Circadian Night Mode, AAA Accessibility, Haptic Integration
 */
export default function SettingsScreen() {
  const { user } = useAuth();
  const { data: baby } = useBabyContext();
  const { isNightMode, toggleNightMode } = useTheme();

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSignOut = async () => {
    triggerHaptic();
    Alert.alert("Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => supabase.auth.signOut() }
    ]);
  };

  return (
    <ScrollView 
      className="flex-1 bg-neutral-950" 
      contentContainerStyle={{ 
        padding: 24, 
        paddingBottom: Platform.OS === 'web' ? 40 : 120,
        maxWidth: Platform.OS === 'web' ? 800 : '100%',
        alignSelf: Platform.OS === 'web' ? 'center' : 'auto'
      }}
    >
      <Animated.View entering={FadeInDown.duration(400)}>
        <Text className="mb-2 text-4xl font-black text-white">Settings</Text>
        <Text className="mb-8 font-medium text-neutral-500">Manage your family and app preferences</Text>
      </Animated.View>

      {/* Dynamic Profile Section: Obsidian & Teal */}
      <GlassCard className="mb-8 border-primary/20 bg-primary/5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="p-4 shadow-lg bg-primary rounded-2xl">
              <Baby size={28} color="white" />
            </View>
            <View className="ml-4">
              <Text className="text-2xl font-black text-white">
                {baby?.baby_name || 'Set up Profile'}
              </Text>
              <View className="flex-row items-center mt-1">
                <ShieldCheck size={12} color="#4FD1C7" />
                <Text className="text-primary font-bold text-[10px] uppercase ml-1 tracking-widest">
                  {baby?.role?.replace('_', ' ') || 'New Parent'}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            onPress={triggerHaptic}
            className="p-3 border bg-white/5 rounded-xl border-white/10"
          >
            <UserCircle size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </GlassCard>

      {/* Circadian Night Mode Toggle */}
      <Text className="text-xs font-black tracking-[2px] uppercase text-neutral-500 mb-4 px-1">
        Environment
      </Text>
      <GlassCard className={`mb-8 ${isNightMode ? 'border-red-900/40 bg-red-900/5' : 'border-white/5'}`}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className={`p-2 rounded-lg ${isNightMode ? 'bg-red-500/20' : 'bg-white/5'}`}>
              <MoonStar size={20} color={isNightMode ? "#ff4444" : "#94A3B8"} />
            </View>
            <Text className="ml-3 font-bold text-white">Circadian Night Mode</Text>
          </View>
          <Switch 
            value={isNightMode} 
            onValueChange={(val) => { triggerHaptic(); toggleNightMode(); }}
            trackColor={{ true: '#7f1d1d', false: '#334155' }}
            thumbColor={isNightMode ? "#ff4444" : "#f4f3f4"}
          />
        </View>
      </GlassCard>

      {/* Care Team Synchronization */}
      <View className="mb-10">
        <Text className="text-xs font-black tracking-[2px] uppercase text-neutral-500 mb-4 px-1">
          Care Team Synchronization
        </Text>
        {baby?.baby_name ? <InviteCaregiver /> : <JoinFamily />}
      </View>

      {/* Data Export */}
      <TouchableOpacity 
        onPress={triggerHaptic}
        className="flex-row items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[32px] mb-8"
      >
        <View className="flex-row items-center">
          <View className="p-2 rounded-lg bg-primary/10"><Database size={18} color="#4FD1C7" /></View>
          <Text className="ml-3 font-bold text-white">Export Health Data (CSV)</Text>
        </View>
        <ChevronRight size={18} color="#475569" />
      </TouchableOpacity>

      {/* Safe Exit */}
      <TouchableOpacity 
        onPress={handleSignOut}
        className="mt-12 mb-8 items-center flex-row justify-center bg-red-500/10 py-5 rounded-[32px] border border-red-500/20"
      >
        <LogOut size={20} color="#F87171" />
        <Text className="ml-3 text-xs font-black tracking-widest text-red-400 uppercase">Terminate Session</Text>
      </TouchableOpacity>
      
      <Text className="text-center text-neutral-700 text-[10px] font-bold uppercase tracking-widest mb-10">
        Project Cradle v1.0.4 • Build 2025.12.27
      </Text>
    </ScrollView>
  );
}