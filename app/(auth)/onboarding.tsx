import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Baby, Calendar, Weight as WeightIcon, ArrowRight } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { supabase } from '../../src/utils/supabase';

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ babyName: '', dob: '', weight: '' });
  const router = useRouter();

  const handleComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('profiles').update({
      baby_name: formData.babyName,
      baby_dob: formData.dob,
      is_onboarded: true
    }).eq('id', user?.id);
    router.replace('/(tabs)/');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F9FF] p-8 justify-center">
      <View className="items-center mb-12">
        <View className="w-20 h-20 bg-white rounded-[30px] items-center justify-center shadow-xl border border-white">
          <Baby size={40} color="#10B981" />
        </View>
        <Text className="text-3xl font-black text-slate-800 mt-6 text-center">Tell us about{'\n'}your little one</Text>
      </View>

      <BlurView intensity={60} tint="light" className="p-10 rounded-[50px] border border-white bg-white/40">
        {step === 1 ? (
          <AnimatedStep>
            <Text className="text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest">Baby's Name</Text>
            <TextInput 
              className="bg-white border border-slate-100 rounded-2xl px-5 h-14 text-slate-700 font-bold mb-8"
              placeholder="Emma"
              value={formData.babyName}
              onChangeText={(t) => setFormData({...formData, babyName: t})}
            />
            <TouchableOpacity onPress={() => setStep(2)} className="bg-mint-400 h-16 rounded-full items-center justify-center flex-row shadow-xl">
              <Text className="text-white font-black text-lg mr-2">Next Step</Text>
              <ArrowRight size={20} color="white" strokeWidth={3} />
            </TouchableOpacity>
          </AnimatedStep>
        ) : (
          <AnimatedStep>
            <Text className="text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest">Birth Date</Text>
            <TextInput 
              className="bg-white border border-slate-100 rounded-2xl px-5 h-14 text-slate-700 font-bold mb-8"
              placeholder="YYYY-MM-DD"
              value={formData.dob}
              onChangeText={(t) => setFormData({...formData, dob: t})}
            />
            <TouchableOpacity onPress={handleComplete} className="bg-mint-400 h-16 rounded-full items-center justify-center flex-row shadow-xl">
              <Text className="text-white font-black text-lg mr-2">Initialize System</Text>
              <ArrowRight size={20} color="white" strokeWidth={3} />
            </TouchableOpacity>
          </AnimatedStep>
        )}
      </BlurView>
    </SafeAreaView>
  );
}

const AnimatedStep = ({ children }: any) => <View>{children}</View>; // Placeholder for Fade animation