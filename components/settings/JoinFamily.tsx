 import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { GlassCard } from '@/components/glass/GlassCard';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Users } from 'lucide-react-native';

/**
 * PROJECT CRADLE: JOIN FAMILY COMPONENT
 * Allows caregivers to link to an existing baby profile via invite code.
 */
export const JoinFamily = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    if (code.length !== 6) {
      Alert.alert("Invalid Code", "Please enter a 6-digit invite code.");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 1. Verify if the code exists and is pending
      const { data: invite, error: inviteError } = await supabase
        .from('caregiver_invites')
        .select('*')
        .eq('invite_code', code.toUpperCase())
        .eq('status', 'PENDING')
        .single();

      if (inviteError || !invite) throw new Error("Invalid or expired invite code.");

      // 2. Fetch the inviter's baby profile data
      const { data: inviterProfile, error: profileError } = await supabase
        .from('profiles')
        .select('baby_name, baby_dob')
        .eq('id', invite.inviter_id)
        .single();

      if (profileError) throw profileError;

      // 3. Update the joining user's profile with the baby's data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          baby_name: inviterProfile.baby_name,
          baby_dob: inviterProfile.baby_dob,
          role: 'SECONDARY_CAREGIVER'
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // 4. Mark the invite as accepted
      await supabase
        .from('caregiver_invites')
        .update({ status: 'ACCEPTED' })
        .eq('id', invite.id);

      Alert.alert("Success!", `You have joined the care team for ${inviterProfile.baby_name}.`);
      router.replace('/(app)');
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="mt-6">
      <View className="flex-row items-center mb-4">
        <View className="p-2 bg-primary/20 rounded-xl">
          <Users size={20} color="#4FD1C7" />
        </View>
        <Text className="ml-3 text-lg font-bold text-neutral-900">Join a Family</Text>
      </View>

      <TextInput
        placeholder="Enter 6-Digit Code"
        className="p-4 mb-4 text-2xl font-black tracking-widest text-center border bg-white/50 border-neutral-200 rounded-2xl text-neutral-900"
        value={code}
        onChangeText={(text) => setCode(text.toUpperCase())}
        maxLength={6}
        autoCapitalize="characters"
      />

      <TouchableOpacity 
        onPress={handleJoin}
        disabled={loading}
        className="items-center py-4 shadow-lg bg-primary rounded-2xl"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-lg font-bold text-white">Join Family</Text>
        )}
      </TouchableOpacity>
    </GlassCard>
  );
};