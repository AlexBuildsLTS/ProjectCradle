import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Heart, Calendar, ArrowRight, Sparkles } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function OnboardingScreen() {
  const [babyName, setBabyName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('profiles').update({
        baby_name: babyName,
        baby_dob: dob.toISOString().split('T')[0],
      }).eq('id', user.id);
      if (!error) router.replace('/(app)');
    }
  };

  return (
    <View className="justify-center flex-1 px-8 bg-neutral-950">
      <Animated.View entering={FadeIn.delay(200)}>
        <View className="items-center justify-center w-16 h-16 mb-8 bg-secondary/20 rounded-3xl">
          <Heart size={32} color="#B794F6" fill="#B794F6" />
        </View>

        <Text className="mb-3 text-4xl font-black tracking-tighter text-white">Baby's Identity</Text>
        <Text className="mb-12 text-lg font-medium text-neutral-500">Initialize Berry AI with your little one's details.</Text>

        <View className="space-y-6">
          <View>
            <Text className="text-neutral-400 font-black text-[10px] uppercase tracking-[2px] mb-3 ml-1">Full Name</Text>
            <View className="justify-center h-16 px-5 border bg-white/5 border-white/10 rounded-2xl">
              <TextInput 
                placeholder="e.g. Charlie"
                placeholderTextColor="#475569"
                className="text-xl font-bold text-white"
                value={babyName}
                onChangeText={setBabyName}
              />
            </View>
          </View>

          <View>
            <Text className="text-neutral-400 font-black text-[10px] uppercase tracking-[2px] mb-3 ml-1">Arrival Date</Text>
            <TouchableOpacity 
              onPress={() => setShowPicker(true)}
              className="flex-row items-center justify-between h-16 px-5 border bg-white/5 border-white/10 rounded-2xl"
            >
              <Text className="text-xl font-bold text-white">{dob.toLocaleDateString()}</Text>
              <Calendar size={20} color="#B794F6" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleComplete}
          className="flex-row items-center justify-center h-16 mt-12 shadow-2xl bg-secondary rounded-2xl shadow-secondary/20"
        >
          <Sparkles size={20} color="#020617" className="mr-3" />
          <Text className="text-lg font-black tracking-widest uppercase text-neutral-950">Activate AI Insights</Text>
        </TouchableOpacity>
      </Animated.View>

      {showPicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="spinner"
          onChange={(e, d) => { setShowPicker(false); if(d) setDob(d); }}
        />
      )}
    </View>
  );
}