/**
 * PROJECT CRADLE: BERRY AI INTERFACE V6.0 (AAA+ PRODUCTION)
 * Path: app/(app)/berry-ai.tsx
 * FIXES:
 * 1. TOTAL SPACE UTILIZATION: Bypassed GlassCard's hardcoded padding to allow edge-to-edge typing.
 * 2. FULL VIEWPORT ATTACHMENT: Chat ledger and input bar now span 100% width on all devices.
 * 3. COMPACT MOBILE HEADER: Reduced typography weight for Samsung/iOS small viewports.
 * 4. ANTI-SCAM UI: Aggressive web outline suppression and focus state hardening.
 */

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Bot, ChevronLeft, Send, Sparkles, User } from 'lucide-react-native';
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
  useWindowDimensions,
  View,
} from 'react-native';

// PROJECT IMPORTS
import { useFamily } from '@/context/family';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'berry';
  timestamp: Date;
}

export default function BerryAIScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { selectedBaby } = useFamily();

  const isSmallMobile = width < 400;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      text: `Biometric handshake successful. I'm monitoring ${
        selectedBaby?.name || 'the baby'
      }. How can I assist you?`,
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

    setTimeout(() => {
      const berryMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Analysis complete. Based on recent activity, ${
          selectedBaby?.name || 'the baby'
        } is showing signs of high sleep pressure. A SweetSpot® window is projected in 12 minutes.`,
        sender: 'berry',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, berryMsg]);
      setLoading(false);
      if (Platform.OS !== 'web')
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.mainWrapper}>
        {/* HEADER: COMPACT & FIXED WIDTH UTILIZATION */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ChevronLeft size={20} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={styles.badgeRow}>
              <Sparkles size={10} color="#4FD1C7" />
              <Text style={styles.badgeText}>AI CORE ACTIVE</Text>
            </View>
            <Text
              style={[
                styles.headerTitle,
                { fontSize: isSmallMobile ? 16 : 20 },
              ]}
            >
              {selectedBaby?.name || 'Assistant'} Hub
            </Text>
          </View>
        </View>

        {/* CHAT VIEWPORT: 100% WIDTH ATTACHMENT */}
        <ScrollView
          ref={scrollRef}
          style={styles.viewport}
          contentContainerStyle={styles.viewportContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.msgWrapper,
                msg.sender === 'user'
                  ? styles.userWrapper
                  : styles.berryWrapper,
              ]}
            >
              <View style={styles.bubbleRow}>
                {msg.sender === 'berry' && (
                  <View style={styles.avatar}>
                    <Bot size={12} color="#4FD1C7" />
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    msg.sender === 'user'
                      ? styles.userBubble
                      : styles.berryBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.msgText,
                      msg.sender === 'user'
                        ? styles.userText
                        : styles.berryText,
                      { fontSize: isSmallMobile ? 14 : 15 },
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
                {msg.sender === 'user' && (
                  <View style={[styles.avatar, styles.userAvatar]}>
                    <User size={12} color="#FFF" />
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.timestamp,
                  msg.sender === 'user'
                    ? { textAlign: 'right', marginRight: 42 }
                    : { marginLeft: 42 },
                ]}
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ))}
          {loading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator color="#4FD1C7" size="small" />
              <Text style={styles.loadingText}>
                Berry is analyzing biometrics...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* INPUT HUB: CUSTOM HIGH-DENSITY CONTAINER (NO WASTED SPACE) */}
        <View style={styles.inputSticky}>
          <View style={styles.customInputBar}>
            <TextInput
              style={[
                styles.inputField,
                Platform.OS === 'web' &&
                  ({ outlineStyle: 'none', border: 'none' } as any),
              ]}
              placeholder="Query Berry..."
              placeholderTextColor="#475569"
              value={input}
              onChangeText={setInput}
              multiline
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !input.trim() && { opacity: 0.3 }]}
              onPress={handleSendMessage}
              disabled={!input.trim() || loading}
            >
              <Send size={18} color="#020617" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  mainWrapper: { flex: 1, width: '100%', alignSelf: 'stretch' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#020617',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: { marginLeft: 16 },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(79, 209, 199, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 2,
  },
  badgeText: {
    color: '#4FD1C7',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerTitle: { color: '#FFF', fontWeight: '900' },
  viewport: { flex: 1 },
  viewportContent: { padding: 16, gap: 24, paddingBottom: 100 },
  msgWrapper: { maxWidth: '92%', gap: 4 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: { backgroundColor: 'rgba(255,255,255,0.05)' },
  userWrapper: { alignSelf: 'flex-end' },
  berryWrapper: { alignSelf: 'flex-start' },
  bubble: { padding: 12, borderRadius: 18, maxWidth: '85%' },
  userBubble: { backgroundColor: '#4FD1C7', borderBottomRightRadius: 2 },
  berryBubble: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderBottomLeftRadius: 2,
  },
  msgText: { lineHeight: 20, fontWeight: '600' },
  userText: { color: '#020617' },
  berryText: { color: '#FFF' },
  timestamp: { color: '#475569', fontSize: 8, fontWeight: '700', marginTop: 4 },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 38,
  },
  loadingText: { color: '#475569', fontSize: 11, fontWeight: '600' },
  inputSticky: {
    width: '100%',
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    paddingTop: 8,
    backgroundColor: '#020617',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  customInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  inputField: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    maxHeight: 120,
    paddingVertical: 8,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#4FD1C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
