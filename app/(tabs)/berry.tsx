import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Sparkles } from 'lucide-react-native';
import { berryApi } from '../../src/api/berry';
import { AiMessageBubble } from '../../src/components/berry/AiMessageBubble';
import { UserMessageBubble } from '../../src/components/berry/UserMessageBubble';
import { ChatInput } from '../../src/components/berry/ChatInput';

interface Message {
  id: string;
  type: 'ai' | 'user';
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  { 
    id: '1', 
    type: 'ai', 
    text: "Hi! I'm Berry. I've analyzed your baby's recent rhythm. How can I help you both find a better flow today?" 
  },
];

export default function BerryChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async (text: string) => {
    const userMessage: Message = { id: Date.now().toString(), type: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Connects to the Supabase Edge Function Brain
      const response = await berryApi.sendMessage(text);
      const aiMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        type: 'ai', 
        text: response 
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("[Berry Terminal] Interaction Error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <View className="flex-1 bg-[#F0F9FF]">
      {/* Frosted Header - Mint Glow */}
      <BlurView intensity={80} tint="light" className="pt-14 pb-4 px-6 border-b border-white/40 flex-row items-center z-10">
        <View className="w-12 h-12 bg-white/80 rounded-full items-center justify-center border border-mint-200 mr-4 shadow-xl shadow-mint-300/40">
          <Sparkles size={24} color="#10B981" />
        </View>
        <View>
          <Text className="text-slate-700 font-black text-2xl tracking-tight">Berry AI</Text>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-mint-500 rounded-full animate-pulse mr-2" />
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Surveillance Active</Text>
          </View>
        </View>
      </BlurView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            item.type === 'ai' ? <AiMessageBubble message={item.text} /> : <UserMessageBubble message={item.text} />
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isTyping ? (
            <View className="flex-row items-center ml-4 mt-2">
              <ActivityIndicator size="small" color="#10B981" />
              <Text className="ml-3 text-slate-400 font-bold italic text-xs">Berry is checking the biometric ledger...</Text>
            </View>
          ) : null}
        />

        <ChatInput onSend={handleSend} />
      </KeyboardAvoidingView>
    </View>
  );
}