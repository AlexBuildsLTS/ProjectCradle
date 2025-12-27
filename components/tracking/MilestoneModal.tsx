/**
 * PROJECT CRADLE: MILESTONE & JOURNAL ENGINE V1.0
 * Path: components/tracking/MilestoneModal.tsx
 * * FEATURES:
 * - Image Integration: Hooks into device camera/gallery for memory capture.
 * - Milestone Categorization: Physical, Cognitive, Emotional, and Social "Firsts".
 * - Secure Storage: Uploads directly to 'journal' bucket in Supabase.
 * - UI: High-fidelity glass interface with image preview.
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  Alert,
  Image,
  ScrollView,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { 
  X, 
  Camera, 
  Image as ImageIcon, 
  Check, 
  Star, 
  Type,
  CloudUpload
} from 'lucide-react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';
import { Theme } from '@/lib/shared/Theme';
import { GlassCard } from '../glass/GlassCard';

interface MilestoneModalProps {
  visible: boolean;
  onClose: () => void;
  babyId: string;
}

export const MilestoneModal = ({ visible, onClose, babyId }: MilestoneModalProps) => {
  const { user } = useAuth();
  
  // --- STATE ---
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- IMAGE PICKER LOGIC ---
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // --- UPLOAD & SAVE LOGIC ---
  const handleSaveMilestone = async () => {
    if (!title) return Alert.alert("Required", "Please name this milestone.");
    
    setIsUploading(true);
    try {
      let imageUrl = null;

      // 1. Upload to Supabase Storage if image exists
      if (selectedImage) {
        const fileExt = selectedImage.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
        
        // Convert URI to Blob for Supabase
        const response = await fetch(selectedImage);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('journal')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;
        imageUrl = fileName;
      }

      // 2. Save Reference to Database
      const { error } = await supabase.from('care_events').insert([{
        user_id: user?.id,
        baby_id: babyId,
        event_type: 'milestone',
        correlation_id: (Platform.OS === 'web' ? crypto.randomUUID() : Math.random().toString(36).substring(7)),
        timestamp: new Date().toISOString(),
        metadata: {
          title,
          image_url: imageUrl,
          is_favorite: true
        },
        notes: notes.trim()
      }]);

      if (error) throw error;
      
      Alert.alert("Memory Locked", "This milestone has been archived in the family core.");
      onClose();
      resetForm();
    } catch (err: any) {
      Alert.alert("Engine Failure", err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setNotes('');
    setSelectedImage(null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={StyleSheet.absoluteFill} />
        
        <Animated.View entering={SlideInUp} style={styles.modalContainer}>
          <GlassCard variant="main" intensity={40} className="p-0 overflow-hidden">
            
            {/* HEADER */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <Star size={18} color={Theme.colors.secondary} />
                <Text style={styles.headerTitle}>CAPTURE MILESTONE</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
              
              {/* IMAGE PREVIEW / PICKER */}
              <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderBox}>
                    <Camera size={32} color="#475569" />
                    <Text style={styles.placeholderText}>ATTACH VISUAL MEMORY</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* TITLE INPUT */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Type size={14} color="#94A3B8" />
                  <Text style={styles.inputLabel}>MILESTONE NAME</Text>
                </View>
                <TextInput 
                  style={styles.glassInput}
                  placeholder="e.g., First Social Smile"
                  placeholderTextColor="#475569"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              {/* NOTES INPUT */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>THE STORY</Text>
                <TextInput 
                  style={[styles.glassInput, { height: 100, textAlignVertical: 'top' }]}
                  placeholder="Describe the moment..."
                  placeholderTextColor="#475569"
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>

            </ScrollView>

            {/* ACTION FOOTER */}
            <View style={styles.footer}>
              <TouchableOpacity 
                onPress={handleSaveMilestone}
                disabled={isUploading}
                style={styles.saveBtn}
              >
                {isUploading ? (
                  <ActivityIndicator color="#020617" />
                ) : (
                  <>
                    <Text style={styles.saveText}>ARCHIVE MEMORY</Text>
                    <CloudUpload size={20} color="#020617" />
                  </>
                )}
              </TouchableOpacity>
            </View>

          </GlassCard>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 20 },
  modalContainer: { width: '100%', maxWidth: 480, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { color: Theme.colors.secondary, fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  content: { padding: 24, maxHeight: 500 },
  imagePicker: { width: '100%', height: 200, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', overflow: 'hidden', marginBottom: 24, justifyContent: 'center', alignItems: 'center' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderBox: { alignItems: 'center', gap: 12 },
  placeholderText: { color: '#475569', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  inputGroup: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  inputLabel: { color: '#475569', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  glassInput: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, color: '#FFF', fontSize: 15, fontWeight: '600', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  footer: { padding: 24, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  saveBtn: { backgroundColor: Theme.colors.secondary, height: 64, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  saveText: { color: '#020617', fontWeight: '900', fontSize: 13, letterSpacing: 1 }
});