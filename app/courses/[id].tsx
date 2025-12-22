import { useRouter } from "expo-router";
import { ArrowLeft, CheckCircle2, Play } from "lucide-react-native";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LessonPlayer() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      {/* VIDEO STUB (Simulated for high-integrity presentation) */}
      <View className="w-full aspect-video bg-black items-center justify-center relative">
        <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center border border-white/30">
          <Play color="white" fill="white" size={32} />
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-6 left-6 w-10 h-10 bg-black/40 rounded-full items-center justify-center"
        >
          <ArrowLeft color="white" size={20} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 bg-[#F0F9FF] rounded-t-[50px] -mt-10 px-8 pt-10">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2">
            Lesson 04
          </Text>
          <Text className="text-slate-800 text-3xl font-black tracking-tight mb-6">
            Understanding Cortisol Peaks
          </Text>

          <Text className="text-slate-600 leading-7 text-[16px] font-medium mb-10">
            When a baby stays awake past their natural "SweetSpot®," their body
            begins to produce cortisol. This is a survival hormone that creates
            a "second wind," making it significantly harder for the baby to
            settle. In this lesson, we learn how to spot the eye-rubbing cues
            before the peak occurs.
          </Text>

          <TouchableOpacity className="bg-mint-400 w-full p-6 rounded-[30px] flex-row items-center justify-center shadow-xl shadow-mint-100">
            <CheckCircle2 color="white" size={20} className="mr-3" />
            <Text className="text-white font-black text-lg">
              Mark Lesson as Mastered
            </Text>
          </TouchableOpacity>
          <View className="h-20" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
