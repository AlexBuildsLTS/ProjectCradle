import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Check, Sparkles, Zap, ShieldCheck, Crown } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PremiumUpgradeScreen() {
  const router = useRouter();

  const PlanCard = ({ title, price, features, isPopular }: any) => (
    <View className={`p-8 rounded-[40px] mb-6 border ${isPopular ? 'bg-white border-mint-300' : 'bg-white/40 border-white/60'}`}>
      {isPopular && (
        <View className="bg-mint-400 self-start px-3 py-1 rounded-full mb-4">
          <Text className="text-white text-[10px] font-black uppercase">Most Loved</Text>
        </View>
      )}
      <Text className="text-slate-400 font-bold uppercase text-[12px] tracking-widest">{title}</Text>
      <Text className="text-slate-800 text-4xl font-black mt-1 mb-6">{price}</Text>
      
      {features.map((f: string, i: number) => (
        <View key={i} className="flex-row items-center mb-3">
          <View className="bg-mint-100 p-1 rounded-full mr-3">
            <Check size={12} color="#10B981" />
          </View>
          <Text className="text-slate-600 font-medium">{f}</Text>
        </View>
      ))}

      <TouchableOpacity 
        className={`mt-6 p-5 rounded-3xl items-center ${isPopular ? 'bg-mint-400 shadow-lg shadow-mint-200' : 'bg-slate-800'}`}
      >
        <Text className="text-white font-black text-lg">Select Plan</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F0F9FF]">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <TouchableOpacity onPress={() => router.back()} className="mb-8">
          <Text className="text-slate-400 font-bold">Close</Text>
        </TouchableOpacity>

        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-white rounded-[30px] items-center justify-center shadow-xl mb-6 border border-white">
            <Crown size={40} color="#10B981" />
          </View>
          <Text className="text-slate-800 text-3xl font-black text-center px-4">Unlock the Full Cradle Experience</Text>
          <Text className="text-slate-500 text-center mt-3 text-lg px-8">Science-backed sleep for happy babies and rested parents.</Text>
        </View>

        <PlanCard 
          title="Monthly" 
          price="$9.99" 
          features={["Unlimited Berry AI", "Advanced Sleep Pressure Analytics", "Full Attachment Course"]} 
        />

        <PlanCard 
          title="Annual" 
          price="$59.99" 
          isPopular={true}
          features={["All Monthly Features", "Priority Support Hub", "Save 50% vs Monthly", "Pediatric Report Exports"]} 
        />

        <PlanCard 
          title="Lifetime" 
          price="$149.99" 
          features={["Forever Access", "All Future Updates", "One-time Payment"]} 
        />

        <View className="items-center mt-4 mb-10">
          <ShieldCheck size={20} color="#94a3b8" />
          <Text className="text-slate-400 text-xs mt-2 italic text-center">
            Secure biometric processing. Cancel anytime via App Store.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}