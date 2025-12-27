import React from 'react';
import { View, Text, Platform } from 'react-native';
import { ShieldCheck, Lock, Cpu } from 'lucide-react-native';

/**
 * PROJECT CRADLE: TRUST & INTEGRITY FOOTER
 * Features: AAA Contrast, Platform-Adaptive Versioning
 */
export const DashboardFooter = () => {
  const currentYear = new Date().getFullYear();
  const isWeb = Platform.OS === 'web';

  return (
    <View className={`mt-12 pb-24 px-6 items-center ${isWeb ? 'max-w-4xl self-center w-full' : ''}`}>
      <View className="flex-row items-center px-4 py-2 mb-6 border rounded-full bg-white/5 border-white/10">
        <ShieldCheck size={14} color="#4FD1C7" />
        <Text className="text-primary font-bold text-[10px] uppercase ml-2 tracking-widest">
          AES-256 Encrypted & Secure
        </Text>
      </View>

      <View className="flex-row items-center space-x-6 opacity-40">
        <View className="flex-row items-center">
          <Lock size={12} color="#94A3B8" />
          <Text className="text-neutral-400 text-[9px] font-bold uppercase ml-1">Privacy First</Text>
        </View>
        <View className="flex-row items-center">
          <Cpu size={12} color="#94A3B8" />
          <Text className="text-neutral-400 text-[9px] font-bold uppercase ml-1">Edge Compute v1.0.4</Text>
        </View>
      </View>

      <Text className="text-neutral-600 text-[10px] mt-4 font-medium">
        © {currentYear} Project Cradle. Built for {Platform.OS === 'web' ? 'Web Interface' : 'Mobile Experience'}.
      </Text>
      
      {isWeb && (
        <Text className="text-neutral-700 text-[8px] mt-2 tracking-tighter uppercase">
          Enterprise Cloud Instance: {process.env.EXPO_PUBLIC_SUPABASE_URL?.split('//')[1].split('.')[0]}
        </Text>
      )}
    </View>
  );
};