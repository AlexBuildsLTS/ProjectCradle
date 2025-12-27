/**
 * PROJECT CRADLE: BERRY AI COACHING ENGINE V1.0
 * Path: components/ai/BerryChat.tsx
 * * FEATURES:
 * - Contextual Awareness: Accesses baby's age and 24h logs for precise sleep advice.
 * - SweetSpot® Logic: Explains current sleep pressure and next nap timing.
 * - Evidence-Based: Blends sleep science with gentle parenting solutions.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Sparkles, Send, Bot, Info, ShieldCheck } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

import { GlassCard } from '../glass/GlassCard';
import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import { Theme } from '@/lib/shared/Theme';

export const BerryChat = () => {
  const { profile, user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { role: 'berry', text: `Hi! I'm Berry. I've been monitoring ${profile?.baby_name || 'your baby'}'s patterns. How can I help your family rest better today?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      // In a production environment, this invokes a Supabase Edge Function
      // which has access to the baby's biometric context.
      const { data, error } = await supabase.functions.invoke('berry-ai', {
        body: { 
          prompt: userMessage,
          baby_context: {
            name: profile?.baby_name,
            role: profile?.role
          }
        }
      });

      if (error) throw error;
      setMessages(prev => [...prev, { role: 'berry', text: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'berry', text: "I'm having a bit of trouble connecting to the family core. Please try again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <GlassCard variant="teal" intensity={30} className="flex-1 p-0">
        
        {/* EXPERT BADGE */}
        <View style={styles.expertHeader}>
          <ShieldCheck size={14} color={Theme.colors.primary} />
          <Text style={styles.expertLabel}>EXPERT-VETTED AI GUIDANCE</Text>
        </View>

        <ScrollView 
          ref={scrollRef}
          style={styles.chatArea} 
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, i) => (
            <Animated.View 
              key={i} 
              entering={FadeIn.delay(100)} 
              style={[styles.msgWrapper, msg.role === 'user' ? styles.userWrapper : styles.berryWrapper]}
            >
              {msg.role === 'berry' && (
                <View style={styles.botIcon}><Bot size={16} color="#FFF" /></View>
              )}
              <View style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.berryBubble]}>
                <Text style={[styles.msgText, msg.role === 'user' && { color: '#020617' }]}>{msg.text}</Text>
              </View>
            </Animated.View>
          ))}
          {isTyping && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={Theme.colors.primary} />
              <Text style={styles.loadingText}>Berry is analyzing trends...</Text>
            </View>
          )}
        </ScrollView>

        {/* INPUT INTERFACE */}
        <View style={styles.inputSection}>
          <View style={styles.inputBar}>
            <TextInput 
              style={styles.textInput}
              placeholder="Ask Berry about sleep windows..."
              placeholderTextColor="#475569"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity 
              onPress={handleSend} 
              style={[styles.sendBtn, !input.trim() && { opacity: 0.5 }]}
            >
              <Send size={18} color="#020617" />
            </TouchableOpacity>
          </View>
        </View>

      </GlassCard>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  expertHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: 'rgba(79, 209, 199, 0.05)', justifyContent: 'center', borderBottomWidth: 1, borderColor: 'rgba(79, 209, 199, 0.1)' },
  expertLabel: { color: Theme.colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  chatArea: { flex: 1 },
  chatContent: { padding: 20, gap: 16 },
  msgWrapper: { flexDirection: 'row', gap: 12, maxWidth: '85%' },
  userWrapper: { alignSelf: 'flex-end' },
  berryWrapper: { alignSelf: 'flex-start' },
  botIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  bubble: { padding: 16, borderRadius: 20 },
  userBubble: { backgroundColor: Theme.colors.primary },
  berryBubble: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  msgText: { color: '#FFF', fontSize: 15, lineHeight: 22, fontWeight: '600' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 10 },
  loadingText: { color: '#475569', fontSize: 12, fontWeight: '700' },
  inputSection: { padding: 20, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  inputBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 6, paddingLeft: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  textInput: { flex: 1, height: 48, color: '#FFF', fontSize: 15, fontWeight: '600' },
  sendBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: Theme.colors.primary, alignItems: 'center', justifyContent: 'center' }
});