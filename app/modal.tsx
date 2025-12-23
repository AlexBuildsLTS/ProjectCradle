import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { X, Droplet } from 'lucide-react-native';
import { useRouter } from 'expo-router';

/**
 * PROJECT CRADLE: QUICK FEED MODAL
 * Resolves the '@/components/EditScreenInfo' missing module error.
 */
export default function FeedModal() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F0F9FF] items-center justify-center p-6">
      <StatusBar style="dark" />
      
      <View className="w-full bg-white/60 p-10 rounded-[50px] border border-white items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="absolute p-2 top-6 right-6"
        >
          <X color="#94a3b8" size={24} />
        </TouchableOpacity>

        <View className="bg-mint-100 p-6 rounded-[30px] mb-6">
          <Droplet color="#10B981" size={40} fill="#10B981" />
        </View>

        <Text className="text-3xl font-black tracking-tighter text-slate-800">Log Feeding</Text>
        <Text className="mt-2 font-medium text-center text-slate-400">
          Capture the biometric intake for your records.
        </Text>

        <TouchableOpacity 
          onPress={() => router.back()}
          className="items-center justify-center w-full h-16 mt-10 rounded-full shadow-xl bg-slate-800"
        >
          <Text className="text-lg font-black text-white">Save Record</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}