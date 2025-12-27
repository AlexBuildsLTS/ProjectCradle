import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { GlassCard } from '@/components/glass/GlassCard';
import { Pill, Syringe, Thermometer, Plus } from 'lucide-react-native';
import { useBiometrics } from '@/hooks/useBiometrics';
import { useFormatting } from '@/hooks/useFormatting';
import * as Crypto from 'expo-crypto';

export default function HealthScreen() {
  const { logEvent } = useBiometrics();
  const { displayTemp, units } = useFormatting();
  const [temp, setTemp] = useState("");

  const handleLogHealth = (type: 'MEDICATION' | 'HEALTH_LOG', metadata: any) => {
    logEvent.mutate({
      correlation_id: Crypto.randomUUID(),
      event_type: type as any,
      timestamp: new Date().toISOString(),
      metadata: metadata,
    });
    Alert.alert("Success", "Health data recorded.");
    if (type === 'HEALTH_LOG') setTemp("");
  };

  return (
    <ScrollView 
      className="flex-1 p-6 bg-neutral-950" 
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <Text className="mb-8 text-4xl font-black text-white">Health</Text>

      {/* Fever Tracker - Dynamically Adaptable */}
      <Text className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mb-4">Vital Signs</Text>
      <GlassCard className="mb-10 border-orange-500/20 bg-orange-500/5">
        <View className="flex-row items-center mb-4">
          <View className="p-2 bg-orange-500/20 rounded-xl">
            <Thermometer size={20} color="#FB923C" />
          </View>
          <Text className="ml-3 text-lg font-bold text-white">Fever Tracker ({units.temp})</Text>
        </View>

        <View className="flex-row items-center space-x-4">
          <TextInput
            placeholder={`Example: ${displayTemp("38.5")}`}
            placeholderTextColor="#4B5563"
            keyboardType="numeric"
            value={temp}
            onChangeText={setTemp}
            className="flex-1 p-4 text-lg text-white border bg-white/5 border-white/10 rounded-2xl"
          />
          <TouchableOpacity
            onPress={() => handleLogHealth("HEALTH_LOG", { temperature: temp, unit: units.temp })}
            className="p-4 bg-orange-500 shadow-lg rounded-2xl shadow-orange-500/20"
          >
            <Plus color="white" size={24} />
          </TouchableOpacity>
        </View>
      </GlassCard>

      {/* Medication Cabinet */}
      <Text className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mb-4">Medication Cabinet</Text>
      <View className="mb-10 space-y-4">
        {['Vitamin D', 'Paracetamol', 'Ibuprofen'].map((med) => (
          <TouchableOpacity 
            key={med} 
            activeOpacity={0.7}
            onPress={() => handleLogHealth('MEDICATION', { name: med, dose: 'Standard' })}
          >
            <GlassCard className="flex-row items-center justify-between p-5 border-white/5 bg-white/5">
              <View className="flex-row items-center">
                <View className="p-2 bg-primary/20 rounded-xl">
                  <Pill size={20} color="#4FD1C7" />
                </View>
                <Text className="ml-4 font-bold text-white">{med}</Text>
              </View>
              <Plus size={20} color="#4FD1C7" />
            </GlassCard>
          </TouchableOpacity>
        ))}
      </View>

      {/* Vaccination Milestones */}
      <Text className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mb-4">Vaccinations</Text>
      <GlassCard className="border-secondary/20 bg-secondary/5">
        <View className="flex-row items-center mb-4">
          <View className="p-2 bg-secondary/20 rounded-xl">
            <Syringe size={20} color="#B794F6" />
          </View>
          <Text className="ml-3 text-xs font-black tracking-widest uppercase text-secondary">Immunity Schedule</Text>
        </View>
        <Text className="mb-2 text-lg font-bold text-white">4-Month Booster</Text>
        <Text className="text-sm leading-5 text-neutral-400">
          DTaP, Polio, and Hib are scheduled for next week. Logging temperature is recommended post-appointment.
        </Text>
      </GlassCard>
    </ScrollView>
  );
}