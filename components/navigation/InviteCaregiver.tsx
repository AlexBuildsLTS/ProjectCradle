import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GlassCard } from '@/components/glass/GlassCard';
import { UserPlus } from 'lucide-react-native';

export const InviteCaregiver = () => (
  <GlassCard className="mt-6">
    <View className="flex-row items-center mb-4">
      <UserPlus size={24} color="#B794F6" />
      <Text className="ml-3 text-xl font-bold text-neutral-900">Add Caregiver</Text>
    </View>
    <TouchableOpacity className="items-center py-4 bg-primary/10 rounded-2xl">
      <Text className="font-bold text-primary">Generate Invite Code</Text>
    </TouchableOpacity>
  </GlassCard>
);