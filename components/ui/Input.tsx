import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
}

export const Input = ({ label, icon, ...props }: InputProps) => {
  return (
    <View className="mb-4">
      {label && <Text className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest mb-2 ml-1">{label}</Text>}
      <View className="flex-row items-center h-16 px-4 border bg-white/5 border-white/10 rounded-2xl">
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput 
          placeholderTextColor="#475569"
          className="flex-1 font-medium text-white"
          {...props}
        />
      </View>
    </View>
  );
};