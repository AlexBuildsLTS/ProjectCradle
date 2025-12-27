/**
 * PROJECT CRADLE: BERRY AI ASSISTANT V2.0
 * Path: components/ai/BerryAssistant.tsx
 * * DESIGN SYSTEM:
 * - Theme: Obsidian / Dark Mode Optimized
 * - UI: Glassmorphism (using GlassCard)
 * - Accessibility: Melatonin-safe (low blue-light profile)
 */

import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  StyleSheet 
} from 'react-native';
import { Sparkles, Send, X, Bot } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown, FadeOut, SlideOutDown } from 'react-native-reanimated';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';
import { GlassCard } from '../glass/GlassCard'; // Correct relative path
import { buildParentingPrompt } from '@/services/ai-prompt-builder';

export const BerryAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { profile } = useAuth(); // Using the synchronized Auth Context

  const handleAskBerry = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setResponse(null);

    try {
      /**
       * 1. CONTEXTUAL PROMPT GENERATION
       * Passing baby name and age to the Edge Function for personalized advice.
       */
      const prompt = buildParentingPrompt(
        profile?.baby_name || 'Baby',
        0, // Age logic will be connected to your Growth module next
        [], 
        input
      );

      /**
       * 2. SECURE EDGE FUNCTION CALL
       * Invoking the 'berry-ai' function with the contextual prompt.
       */
      const { data, error } = await supabase.functions.invoke('berry-ai', {
        body: { prompt }
      });

      if (error) throw error;
      setResponse(data.text);
      setInput('');
    } catch (error: any) {
      setResponse(`I'm sorry, I'm having trouble connecting to the family core: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- FLOATING TRIGGER BUTTON ---
  if (!isOpen) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.fabContainer}>
        <TouchableOpacity 
          onPress={() => setIsOpen(true)}
          activeOpacity={0.9}
          style={styles.fab}
        >
          <Sparkles color="#020617" size={28} />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // --- FULL CHAT INTERFACE ---
  return (
    <Animated.View 
      entering={SlideInDown} 
      exiting={SlideOutDown}
      style={styles.overlay}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => setIsOpen(false)} 
          style={styles.backdrop} 
        />
        
        <View style={styles.assistantContainer}>
          <GlassCard variant="teal" intensity={30} className="flex-1 p-0">
            
            {/* 1. Header Section */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <View style={styles.botIconWrapper}>
                  <Bot size={22} color="#4FD1C7" />
                </View>
                <View>
                  <Text style={styles.headerTitle}>Berry Assistant</Text>
                  <Text style={styles.headerStatus}>AI PRO ACTIVE</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setIsOpen(false)} hitSlop={20}>
                <X size={24} color="#475569" />
              </TouchableOpacity>
            </View>

            {/* 2. Chat Ledger */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              <View style={styles.welcomeBubble}>
                <Text style={styles.welcomeText}>
                  Hello! I'm Berry. How can I help optimize {profile?.baby_name || 'your baby'}'s schedule today?
                </Text>
              </View>

              {response && (
                <Animated.View entering={FadeIn} style={styles.responseBubble}>
                  <View style={styles.responseHeader}>
                    <Sparkles size={12} color="#4FD1C7" />
                    <Text style={styles.responseTextLabel}>BERRY'S INSIGHT</Text>
                  </View>
                  <Text style={styles.responseText}>{response}</Text>
                </Animated.View>
              )}

              {isLoading && (
                <View style={styles.loadingArea}>
                  <ActivityIndicator color="#4FD1C7" size="small" />
                  <Text style={styles.loadingText}>Analyzing patterns...</Text>
                </View>
              )}
            </ScrollView>

            {/* 3. Input Interface */}
            <View style={styles.inputSection}>
              <View style={styles.inputWrapper}>
                <TextInput 
                  placeholder="Ask about sleep regression, feeding..." 
                  placeholderTextColor="#475569"
                  style={styles.textInput}
                  value={input}
                  onChangeText={setInput}
                  onSubmitEditing={handleAskBerry}
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  onPress={handleAskBerry}
                  disabled={isLoading || !input.trim()}
                  style={[styles.sendBtn, !input.trim() && { opacity: 0.3 }]}
                >
                  <Send size={18} color="#020617" />
                </TouchableOpacity>
              </View>
            </View>

          </GlassCard>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fabContainer: { position: 'absolute', bottom: 100, right: 24, zIndex: 1000 },
  fab: { backgroundColor: '#4FD1C7', width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', shadowColor: '#4FD1C7', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 10 },
  overlay: { position: 'absolute', inset: 0, zIndex: 10000, justifyContent: 'flex-end' },
  keyboardView: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2, 6, 23, 0.6)' },
  assistantContainer: { height: '80%', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  botIconWrapper: { backgroundColor: 'rgba(79, 209, 199, 0.1)', padding: 10, borderRadius: 12 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  headerStatus: { color: '#4FD1C7', fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  scrollArea: { flex: 1 },
  scrollContent: { padding: 24 },
  welcomeBubble: { backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 20, borderRadius: 24, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  welcomeText: { color: '#CBD5E0', fontSize: 15, lineHeight: 24, fontWeight: '600' },
  responseBubble: { backgroundColor: 'rgba(79, 209, 199, 0.03)', padding: 20, borderRadius: 24, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(79, 209, 199, 0.1)' },
  responseHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  responseTextLabel: { color: '#4FD1C7', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  responseText: { color: '#FFF', fontSize: 15, lineHeight: 24, fontWeight: '600' },
  loadingArea: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 10 },
  loadingText: { color: '#475569', fontSize: 12, fontWeight: '700' },
  inputSection: { padding: 24, borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 20, padding: 8, paddingLeft: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  textInput: { flex: 1, color: '#FFF', fontSize: 15, fontWeight: '600', height: 48 },
  sendBtn: { backgroundColor: '#4FD1C7', width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }
});