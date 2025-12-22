import { Sparkles } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

export const AiMessageBubble = ({ message }: { message: string }) => {
  return (
    <View className="flex-row items-end mb-6 mr-12">
      {/* Berry Avatar with Teal Glow */}
      <View className="w-8 h-8 rounded-full bg-mint-50 items-center justify-center border border-mint-200 mr-2 shadow-md shadow-mint-300/50">
        <Sparkles size={16} color="#10B981" /> {/* Mint-500 */}
      </View>

      {/* Glass Bubble */}
      <View className="bg-white/60 border border-white/70 rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
        <Text className="text-slate-700 leading-6 text-[15px]">{message}</Text>
      </View>
    </View>
  );
};
