/**
 * PROJECT CRADLE: BERRY AI INTERFACE V1.0
 * Path: app/(app)/berry-ai.tsx
 * THEME: Obsidian (#020617) | Teal (#4FD1C7)
 * * FEATURES:
 * 1. 24/7 EXPERT GUIDANCE: Specialized AI logic for sleep, feeding, and development.
 * 2. BIOMETRIC CONTEXT: Automatically references the selected baby's core data.
 * 3. HAPTIC INTERACTIONS: Micro-feedback for message transmission.
 * 4. PREMIUM UI: Melatonin-safe contrast for nighttime queries.
 */

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ChevronLeft, Send, Sparkles } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// PROJECT IMPORTS
import { GlassCard } from '@/components/glass/GlassCard';
import { useFamily } from '@/context/family';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'berry';
  timestamp: Date;
}

export default function BerryAIScreen() {
  const router = useRouter();
  const { selectedBaby } = useFamily();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      text: `Hello! I'm Berry. I'm currently monitoring ${
        selectedBaby?.name || 'your baby'
      }'s sleep and feeding patterns. How can I help you today?`,
      sender: 'berry',
      timestamp: new Date(),
    },
  ]);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (Platform.OS !== 'web')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // MODULE: AI Handshake Simulation
    // In production, this hits your Edge Function/AIService
    setTimeout(() => {
      const berryMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `I've analyzed the recent biometrics. Based on the SweetSpot® algorithm, it looks like an optimal nap window is approaching. Would you like me to prepare a custom sleep plan?`,
        sender: 'berry',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, berryMsg]);
      setLoading(false);
      if (Platform.OS !== 'web')
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}
      keyboardVerticalOffset={100}
    >
      {/* HEADER HUB */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.aiBadge}>
            <Sparkles size={14} color="#4FD1C7" />
            <Text style={styles.aiBadgeText}>BERRY AI ACTIVE</Text>
          </View>
          <Text style={styles.headerTitle}>Parenting Assistant</Text>
        </View>
      </View>

      {/* CHAT VIEWPORT */}
      <ScrollView
        ref={scrollRef}
        style={styles.viewport}
        contentContainerStyle={styles.viewportContent}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.msgWrapper,
              msg.sender === 'user' ? styles.userWrapper : styles.berryWrapper,
            ]}
          >
            <View
              style={[
                styles.bubble,
                msg.sender === 'user' ? styles.userBubble : styles.berryBubble,
              ]}
            >
              <Text
                style={[
                  styles.msgText,
                  msg.sender === 'user' ? styles.userText : styles.berryText,
                ]}
              >
                {msg.text}
              </Text>
            </View>
            <Text style={styles.timestamp}>
              {msg.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator color="#4FD1C7" size="small" />
            <Text style={styles.loadingText}>
              Berry is analyzing biometrics...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* INPUT HUB */}
      <GlassCard style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Ask Berry about sleep, feeding, or growth..."
          placeholderTextColor="#475569"
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && { opacity: 0.5 }]}
          onPress={handleSendMessage}
          disabled={!input.trim() || loading}
        >
          <Send size={20} color="#020617" />
        </TouchableOpacity>
      </GlassCard>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: { gap: 4 },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  aiBadgeText: {
    color: '#4FD1C7',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  viewport: { flex: 1 },
  viewportContent: { padding: 24, gap: 24, paddingBottom: 40 },
  msgWrapper: { maxWidth: '85%', gap: 6 },
  userWrapper: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  berryWrapper: { alignSelf: 'flex-start' },
  bubble: { padding: 16, borderRadius: 24 },
  userBubble: { backgroundColor: '#4FD1C7', borderBottomRightRadius: 4 },
  berryBubble: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderBottomLeftRadius: 4,
  },
  msgText: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  userText: { color: '#020617' },
  berryText: { color: '#FFF' },
  timestamp: { color: '#475569', fontSize: 9, fontWeight: '700' },
  loadingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 8,
  },
  loadingText: { color: '#475569', fontSize: 12, fontWeight: '600' },
  inputArea: {
    margin: 16,
    padding: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    maxHeight: 100,
    paddingHorizontal: 12,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#4FD1C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
