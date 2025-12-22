import { BlurView } from "expo-blur";
import { Clock, Zap } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

/**
 * PROJECT CRADLE: SWEETSPOT® ENGINE
 * Logic: Calculates sleep pressure based on the last 'SLEEP' end event.
 */
export const SweetSpot = ({ lastWakeTime }: { lastWakeTime: Date }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      // Logic: Awake Window is ~2h for 4mo old
      const windowEnd = new Date(lastWakeTime.getTime() + 120 * 60000);
      const diff = windowEnd.getTime() - new Date().getTime();

      if (diff <= 0) {
        setTimeLeft("OVERTIRED");
      } else {
        const mins = Math.floor(diff / 60000);
        setTimeLeft(`${mins}m`);
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [lastWakeTime]);

  return (
    <BlurView
      intensity={60}
      tint="light"
      className="p-8 rounded-[50px] border border-white bg-white/40 shadow-xl shadow-sky-100 items-center"
    >
      <View className="bg-mint-400 p-3 rounded-2xl mb-4 shadow-lg shadow-mint-100">
        <Zap color="white" size={24} fill="white" />
      </View>
      <Text className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">
        SweetSpot® Countdown
      </Text>
      <Text
        className={`text-6xl font-black tracking-tighter ${
          timeLeft === "OVERTIRED" ? "text-rose-400" : "text-slate-800"
        }`}
      >
        {timeLeft}
      </Text>
      <View className="flex-row items-center mt-4">
        <Clock size={14} color="#94a3b8" />
        <Text className="ml-2 text-slate-400 font-bold">
          Ideal nap at 1:30 PM
        </Text>
      </View>
    </BlurView>
  );
};
