/**
 * PROJECT CRADLE: SOUNDSCAPE SYNC V1.0
 * Path: app/(app)/settings/sounds.tsx
 * ----------------------------------------------------------------------------
 * FEATURES:
 * 1. AUDIO PICKER: Integrated document gateway for MP3/WAV synchronization.
 * 2. STORAGE HANDSHAKE: Atomic upload to 'soundscapes' bucket.
 * 3. INTERNAL NAV: Top-left Chevron gateway return to Settings Hub.
 * 4. UX: Cinematic staggered entry for the audio identity ledger.
 */

import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Headphones,
  Music,
  Trash2,
  UploadCloud,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

export default function SoundscapesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const { user } = useAuth();

  const [sounds, setSounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // --- 1. ANIMATION CONTROLLERS ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadSoundscapes();
    Animated.parallel([
      Animated.spring(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }),
    ]).start();
  }, []);

  const triggerFeedback = (style = Haptics.ImpactFeedbackStyle.Medium) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(style);
  };

  /**
   * DATA SYNCHRONIZATION: Loads the biometric audio ledger.
   */
  const loadSoundscapes = async () => {
    try {
      const { data, error } = await supabase
        .from('soundscapes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSounds(data || []);
    } catch (e: any) {
      console.error('[Sounds] Load Error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * AUDIO INITIALIZATION: Handles the file pick and storage transmission.
   */
  const handleUpload = async () => {
    if (!newTitle.trim())
      return Alert.alert(
        'REQUIRED',
        'Please enter a title for the soundscape.',
      );

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setUploading(true);
      const asset = result.assets[0];
      const fileExt = asset.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

      let fileBody;
      if (Platform.OS === 'web') {
        const response = await fetch(asset.uri);
        fileBody = await response.blob();
      } else {
        const formData = new FormData();
        formData.append('file', {
          uri: asset.uri,
          name: fileName,
          type: asset.mimeType || 'audio/mpeg',
        } as any);
        fileBody = formData;
      }

      // 1. TRANSMIT TO STORAGE BUCKET
      const { error: uploadError } = await supabase.storage
        .from('soundscapes')
        .upload(fileName, fileBody);

      if (uploadError) throw uploadError;

      // 2. REGISTER IN BIOMETRIC LEDGER
      const { error: dbError } = await supabase.from('soundscapes').insert({
        user_id: user?.id,
        title: newTitle.trim(),
        storage_path: fileName,
        file_size_bytes: asset.size,
      });

      if (dbError) throw dbError;

      triggerFeedback(Haptics.ImpactFeedbackStyle.Heavy);
      setNewTitle('');
      loadSoundscapes();
      Alert.alert('SUCCESS', 'Audio core synchronized.');
    } catch (e: any) {
      Alert.alert('SYNC ERROR', e.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePurge = async (id: string, path: string) => {
    triggerFeedback(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('PURGE AUDIO', 'Permanently delete this audio core?', [
      { text: 'CANCEL', style: 'cancel' },
      {
        text: 'PURGE',
        style: 'destructive',
        onPress: async () => {
          await supabase.storage.from('soundscapes').remove([path]);
          await supabase.from('soundscapes').delete().eq('id', id);
          loadSoundscapes();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root}>
      <Animated.View
        style={[
          styles.cardWrapper,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <GlassCard style={[styles.container, ...(isDesktop ? [styles.desktopHUD] : [])]}>
          {/* INTERNAL NAV GATEWAY */}
          <View style={styles.cardHeaderRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                triggerFeedback();
                router.back();
              }}
            >
              <ChevronLeft size={24} color="#FFF" strokeWidth={3} />
            </TouchableOpacity>

            <View style={styles.headerTitleGroup}>
              <Headphones size={18} color={Theme.colors.primary} />
              <Text style={styles.headerTitle}>SOUNDSCAPE SYNC</Text>
            </View>
          </View>

          {/* INITIALIZATION GATEWAY (UPLOAD) */}
          <View style={styles.uploadSection}>
            <Text style={styles.label}>INITIALIZE NEW AUDIO CORE</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Soundscape Title (e.g. Ocean Rain)"
                placeholderTextColor="#475569"
              />
              <TouchableOpacity
                style={[styles.uploadBtn, uploading && { opacity: 0.5 }]}
                onPress={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#020617" />
                ) : (
                  <UploadCloud size={20} color="#020617" strokeWidth={2.5} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* IDENTITY LEDGER (LIST) */}
          <Text style={styles.label}>AUDIO IDENTITY LEDGER</Text>
          <ScrollView
            style={styles.ledgerScroll}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <ActivityIndicator
                color={Theme.colors.primary}
                style={{ marginTop: 20 }}
              />
            ) : sounds.length === 0 ? (
              <Text style={styles.emptyText}>NO AUDIO CORES DETECTED</Text>
            ) : (
              sounds.map((sound, index) => (
                <View key={sound.id} style={styles.soundItem}>
                  <View style={styles.soundIconBox}>
                    <Music size={16} color={Theme.colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.soundTitle}>
                      {sound.title.toUpperCase()}
                    </Text>
                    <Text style={styles.soundMeta}>
                      {(sound.file_size_bytes / 1024 / 1024).toFixed(2)} MB •
                      SYNCED
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handlePurge(sound.id, sound.storage_path)}
                    style={styles.purgeBtn}
                  >
                    <Trash2 size={16} color="#F87171" opacity={0.6} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </GlassCard>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: { width: '100%', alignItems: 'center' },
  container: {
    padding: 40,
    width: '100%',
    borderRadius: 48,
    position: 'relative',
    maxHeight: '85%',
  },
  desktopHUD: { maxWidth: 480 },

  cardHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: -16,
    top: -16,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
  },
  headerTitleGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.5,
  },

  uploadSection: { width: '100%', marginBottom: 32 },
  label: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  inputWrap: { flexDirection: 'row', gap: 12 },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  uploadBtn: {
    width: 64,
    backgroundColor: Theme.colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 32,
  },

  ledgerScroll: { width: '100%' },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  soundIconBox: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  soundMeta: { color: '#475569', fontSize: 9, fontWeight: '700', marginTop: 2 },
  purgeBtn: { padding: 10 },
  emptyText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 40,
    letterSpacing: 2,
  },
});
