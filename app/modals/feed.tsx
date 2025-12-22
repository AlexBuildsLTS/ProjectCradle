import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { feedingApi } from '../../src/api/feeding';
import { BlurView } from 'expo-blur';
import { Droplet, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function FeedModal() {
  const [amount, setAmount] = useState('120');
  const [side, setSide] = useState<'LEFT' | 'RIGHT' | 'BOTH'>('BOTH');
  const router = useRouter();

  const handleSave = async () => {
    try {
      await feedingApi.logFeed({ type: 'BOTTLE', amountMl: parseInt(amount), side });
      router.back();
    } catch (e) {
      Alert.alert("Sync Failure", "Could not log biometric intake.");
    }
  };

  return (
    <View className="flex-1 bg-slate-900/40 items-center justify-center p-6">
      <BlurView intensity={90} tint="light" className="w-full p-10 rounded-[50px] border border-white">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-2xl font-black text-slate-800">Log Feeding</Text>
          <TouchableOpacity onPress={() => router.back()}><X color="#94a3b8" /></TouchableOpacity>
        </View>

        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-mint-400 rounded-3xl items-center justify-center shadow-xl shadow-mint-100">
             <Droplet color="white" size={32} />
          </View>
        </View>

        <Text className="text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest">Amount (ml)</Text>
        <TextInput 
          className="bg-white border border-slate-100 rounded-2xl h-14 px-6 text-xl font-bold mb-6"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <View className="flex-row justify-between mb-10">
          {['LEFT', 'BOTH', 'RIGHT'].map((s: any) => (
            <TouchableOpacity 
              key={s} 
              onPress={() => setSide(s)}
              className={`px-6 py-3 rounded-full border ${side === s ? 'bg-mint-400 border-mint-400' : 'bg-white border-slate-100'}`}
            >
              <Text className={`font-bold ${side === s ? 'text-white' : 'text-slate-400'}`}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={handleSave} className="bg-slate-800 h-16 rounded-full items-center justify-center shadow-xl">
          <Text className="text-white font-black text-lg">Save Biometric Intake</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}