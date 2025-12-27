import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Sparkles, Send, X, Bot } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown, FadeOut, SlideOutDown } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { useBabyContext } from '@/hooks/useBabyContext';
import { buildParentingPrompt } from '@/services/ai-prompt-builder';

export const BerryAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { data: baby } = useBabyContext();

  const handleAskBerry = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setResponse(null);

    try {
      // 1. Build the contextual prompt using our service
      const prompt = buildParentingPrompt(
        baby?.baby_name || 'Baby',
        baby?.ageInMonths || 0,
        [], // In production, pass the last 5-10 care_events here
        input
      );

      // 2. Call the Supabase Edge Function we deployed
      const { data, error } = await supabase.functions.invoke('berry-ai', {
        body: { prompt }
      });

      if (error) throw error;
      setResponse(data.text);
      setInput('');
    } catch (error: any) {
      setResponse(`Sorry, I encountered an error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <TouchableOpacity 
          onPress={() => setIsOpen(true)}
          activeOpacity={0.9}
          className="absolute items-center justify-center rounded-full shadow-2xl bottom-24 right-6 bg-primary w-14 h-14"
        >
          <Sparkles color="white" size={28} />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      entering={SlideInDown} 
      exiting={SlideOutDown}
      className="absolute inset-0 z-50 justify-end"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="justify-end flex-1 p-4"
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => setIsOpen(false)} 
          className="absolute inset-0 bg-black/10" 
        />
        
        <View className="h-[75%] rounded-4xl overflow-hidden border border-white/40 shadow-2xl">
          <BlurView intensity={100} tint="light" className="flex-1">
            
            {/* Header */}
            <View className="flex-row items-center justify-between p-6 border-b border-neutral-100">
              <View className="flex-row items-center">
                <View className="p-2 rounded-xl bg-primary/10">
                  <Bot size={24} color="#4FD1C7" />
                </View>
                <Text className="ml-3 text-xl font-black text-neutral-900">Berry AI</Text>
              </View>
              <TouchableOpacity onPress={() => setIsOpen(false)} hitSlop={20}>
                <X size={24} color="#CBD5E0" />
              </TouchableOpacity>
            </View>

            {/* Chat Body */}
            <ScrollView 
              ref={scrollViewRef}
              className="flex-1 p-6"
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              <View className="p-5 mb-6 border bg-white/40 border-white/60 rounded-3xl">
                <Text className="font-medium leading-6 text-neutral-700">
                  Hi! I'm Berry. How can I help with {baby?.baby_name || 'your baby'}'s schedule or development today?
                </Text>
              </View>

              {response && (
                <Animated.View entering={FadeIn} className="p-5 mb-6 border bg-primary/5 border-primary/20 rounded-3xl">
                  <Text className="font-bold tracking-widest uppercase text-primary text-[10px] mb-2">Berry's Advice</Text>
                  <Text className="leading-6 text-neutral-800">{response}</Text>
                </Animated.View>
              )}

              {isLoading && (
                <View className="items-start mb-6">
                  <ActivityIndicator color="#4FD1C7" />
                </View>
              )}
            </ScrollView>

            {/* Input Area */}
            <View className="p-6 bg-white/20">
              <View className="flex-row items-center px-4 py-3 bg-white border shadow-sm rounded-2xl border-neutral-200">
                <TextInput 
                  placeholder="Ask about sleep or feeding..." 
                  className="flex-1 h-10 text-neutral-900"
                  value={input}
                  onChangeText={setInput}
                  multiline={false}
                  onSubmitEditing={handleAskBerry}
                />
                <TouchableOpacity 
                  onPress={handleAskBerry}
                  disabled={isLoading}
                  className={`p-2 rounded-xl ${input.trim() ? 'bg-primary' : 'bg-neutral-200'}`}
                >
                  <Send size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>

          </BlurView>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};