import React from 'react';
import { View, Text } from 'react-native';

export const UserMessageBubble = ({ message }: { message: string }) => {
  return (
    <View className="flex-row items-end justify-end mb-6 ml-12">
      {/* User Glass Bubble - Sky Tint */}
      <View className="bg-sky-100/40 border border-sky-200/50 rounded-2xl rounded-br-sm px-5 py-3 shadow-sm">
        <Text className="text-slate-700 leading-6 text-[15px]">{message}</Text>
      </View>
    </View>
  );
};