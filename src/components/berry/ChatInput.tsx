import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Send } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim().length > 0) {
      onSend(text);
      setText('');
    }
  };

  return (
    // Frosted Glass Container
    <BlurView intensity={90} tint="light" className="px-4 py-4 border-t border-white/40">
      <View className="flex-row items-center bg-white/50 border border-white/60 rounded-full pl-5 pr-1 py-1 shadow-sm">
        <TextInput
          className="flex-1 h-10 text-slate-700 text-[16px]"
          placeholder="Ask Berry about sleep, feeds..."
          placeholderTextColor="#94a3b8"
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          style={{ paddingVertical: Platform.OS === 'ios' ? 8 : 4 }} // Alignment fix
        />
        
        {/* Glowing Send Button */}
        <TouchableOpacity
          onPress={handleSend}
          activeOpacity={0.8}
          className="w-10 h-10 bg-mint-400 rounded-full items-center justify-center shadow-md shadow-mint-300/50"
        >
          <Send size={18} color="white" style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </View>
    </BlurView>
  );
};