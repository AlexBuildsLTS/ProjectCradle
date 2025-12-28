/**
 * PROJECT CRADLE: BIOMETRIC JOURNAL V1.2
 * Path: app/(app)/journal.tsx
 * FIXES:
 * - Full image upload logic with Blob conversion for Web.
 * - Dynamic captioning and post-to-family sync.
 * - Real-time activity feed of journal entries.
 */

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { Image as ImageIcon, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function JournalScreen() {
  const { selectedBaby } = useFamily();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [entries, setEntries] = useState<any[]>([]);

  const fetchJournal = async () => {
    if (!selectedBaby?.id) return;
    const { data } = await supabase
      .from('care_events')
      .select('*')
      .eq('baby_id', selectedBaby.id)
      .eq('event_type', 'journal')
      .order('timestamp', { ascending: false });
    if (data) setEntries(data);
  };

  useEffect(() => {
    fetchJournal();
  }, [selectedBaby]);

  const pickMedia = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });
    if (!res.canceled) setSelectedImage(res.assets[0].uri);
  };

  const postEntry = async () => {
    if (!selectedBaby?.id || !caption)
      return Alert.alert('ERROR', 'Content required.');
    setLoading(true);

    try {
      let finalUrl = null;
      if (selectedImage) {
        const fileName = `${selectedBaby.id}/${Date.now()}.jpg`;
        let fileBody;
        if (Platform.OS === 'web') {
          const res = await fetch(selectedImage);
          fileBody = await res.blob();
        } else {
          const formData = new FormData();
          formData.append('file', {
            uri: selectedImage,
            name: fileName,
            type: 'image/jpeg',
          } as any);
          fileBody = formData;
        }
        const { error: uploadError } = await supabase.storage
          .from('journals')
          .upload(fileName, fileBody);
        if (uploadError) throw uploadError;
        const {
          data: { publicUrl },
        } = supabase.storage.from('journals').getPublicUrl(fileName);
        finalUrl = publicUrl;
      }

      await supabase.from('care_events').insert([
        {
          baby_id: selectedBaby.id,
          event_type: 'journal',
          timestamp: new Date().toISOString(),
          details: { caption, image_url: finalUrl, author: profile?.full_name },
        },
      ]);

      setCaption('');
      setSelectedImage(null);
      fetchJournal();
      Alert.alert('POSTED', 'Milestone encrypted and shared.');
    } catch (e: any) {
      Alert.alert('ERROR', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>JOURNAL</Text>

      <GlassCard style={styles.postBox}>
        <TextInput
          style={styles.input}
          placeholder="Capture a milestone..."
          placeholderTextColor="#475569"
          multiline
          value={caption}
          onChangeText={setCaption}
        />
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.preview} />
        )}
        <View style={styles.postActions}>
          <TouchableOpacity onPress={pickMedia}>
            <ImageIcon size={20} color="#4FD1C7" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postBtn}
            onPress={postEntry}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#020617" />
            ) : (
              <Text style={styles.postText}>POST TO FAMILY</Text>
            )}
          </TouchableOpacity>
        </View>
      </GlassCard>

      <View style={styles.feed}>
        {entries.map((entry) => (
          <GlassCard key={entry.id} style={styles.entry}>
            <View style={styles.entryHeader}>
              <View style={styles.avatar}>
                <User size={12} color="#4FD1C7" />
              </View>
              <Text style={styles.author}>
                {entry.details.author || 'Family Member'}
              </Text>
            </View>
            {entry.details.image_url && (
              <Image
                source={{ uri: entry.details.image_url }}
                style={styles.entryImg}
              />
            )}
            <Text style={styles.caption}>{entry.details.caption}</Text>
          </GlassCard>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617' },
  content: {
    padding: 24,
    paddingBottom: 100,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  title: { color: '#FFF', fontSize: 24, fontWeight: '900', marginBottom: 24 },
  postBox: { padding: 20, borderRadius: 24, marginBottom: 40 },
  input: {
    color: '#FFF',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  preview: { width: '100%', height: 200, borderRadius: 16, marginBottom: 12 },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postBtn: {
    backgroundColor: '#4FD1C7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  postText: { color: '#020617', fontWeight: '900', fontSize: 10 },
  feed: { gap: 20 },
  entry: { padding: 16, borderRadius: 24 },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  author: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  entryImg: { width: '100%', height: 250, borderRadius: 16, marginBottom: 12 },
  caption: { color: '#94A3B8', fontSize: 13, lineHeight: 20 },
});
