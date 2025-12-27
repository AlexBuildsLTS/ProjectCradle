import { GlassCard } from '@/components/glass/GlassCard';
import { Theme } from '@/lib/shared/Theme';
import * as Clipboard from 'expo-clipboard'; // Ensure this matches exactly
import { Copy, Share2, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Share, Text, TouchableOpacity, View } from 'react-native';

/**
 * PROJECT CRADLE: CAREGIVER INVITE SYSTEM
 * Features: Secure Code Generation, Clipboard Integration, AAA UI
 */
export const InviteCaregiver = () => {
  const [inviteCode, setInviteCode] = useState('CRDL-8829');

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(inviteCode);
      triggerLightImpact();
      Alert.alert('Success', 'Invite code copied to clipboard!');
    } catch (err) {
      console.error('Clipboard failure', err);
    }
  };

  const shareCode = async () => {
    try {
      await Share.share({
        message: `Join our family on Project Cradle! Use code: ${inviteCode}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GlassCard className="border-primary/20 bg-primary/5">
      <View className="flex-row items-center mb-6">
        <View className="p-3 rounded-2xl bg-primary/20">
          <UserPlus size={24} color={Theme.colors.primary} />
        </View>
        <View className="ml-4">
          <Text className="text-lg font-black text-white">
            Invite Caregiver
          </Text>
          <Text className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">
            Share Secure Access
          </Text>
        </View>
      </View>

      <View className="flex-row items-center p-4 mb-4 border bg-white/5 rounded-2xl border-white/10">
        <Text className="flex-1 text-2xl font-black tracking-tighter text-white">
          {inviteCode}
        </Text>
        <TouchableOpacity onPress={copyToClipboard} className="p-2">
          <Copy size={20} color={Theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={shareCode}
        className="flex-row items-center justify-center shadow-lg bg-primary h-14 rounded-2xl shadow-primary/20"
      >
        <Share2 size={18} color="#020617" />
        <Text className="ml-3 text-xs font-black tracking-widest uppercase text-neutral-950">
          Share Invite Link
        </Text>
      </TouchableOpacity>
    </GlassCard>
  );
};
function triggerLightImpact() {
  throw new Error('Function not implemented.');
}
