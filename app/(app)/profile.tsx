/**
 * PROJECT CRADLE: IDENTITY PROFILE MASTER V3.3
 * Path: app/(app)/profile.tsx
 * * CRITICAL FIXES:
 * 1. Resolved TS2345/Logic Error by standardizing Asset passing.
 * 2. Hard-locked 450px width to stop "Stretching to Oblivion".
 * 3. Fixed Web-Storage handshake using Fetch-to-Blob conversion.
 */

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { Camera, RefreshCw, ShieldCheck, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.full_name || '');
  const [uploading, setUploading] = useState(false);

  /**
   * PICKER: Launches system UI to select biometric identifier photo.
   */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      // Pass the full asset object to the uploader
      uploadAvatar(result.assets[0]);
    }
  };

  /**
   * STORAGE HANDSHAKE: Handles the specific Blob requirements for Web vs Native.
   */
  const uploadAvatar = async (asset: ImagePicker.ImagePickerAsset) => {
    setUploading(true);
    try {
      const fileExt = asset.uri.split('.').pop();
      const fileName = `${user?.id}/avatar_${Date.now()}.${fileExt}`;
      let fileBody;

      if (Platform.OS === 'web') {
        // ESSENTIAL: Web requires converting the URI to a Blob for Supabase Storage
        const response = await fetch(asset.uri);
        fileBody = await response.blob();
      } else {
        // Native handles FormData
        const formData = new FormData();
        formData.append('file', {
          uri: asset.uri,
          name: fileName,
          type: `image/${fileExt}`,
        } as any);
        fileBody = formData;
      }

      // 1. TRANSMIT TO STORAGE
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, fileBody, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      // 2. RETRIEVE PUBLIC LINK
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(fileName);

      // 3. SYNCHRONIZE WITH DATABASE PROFILE
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      Alert.alert('SUCCESS', 'Biometric avatar synchronized with the core.');
      refreshProfile();
    } catch (e: any) {
      Alert.alert('SYNC ERROR', e.message);
    } finally {
      setUploading(false);
    }
  };

  /**
   * IDENTITY UPDATE: Updates the Full Name in the family core.
   */
  const handleUpdateIdentity = async () => {
    if (!name.trim())
      return Alert.alert('Error', 'Name field cannot be empty.');

    setUploading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name.trim() })
        .eq('id', user?.id);

      if (error) throw error;

      Alert.alert(
        'CONFIRMED',
        'Identity profile synchronized with family core.',
      );
      refreshProfile();
    } catch (e: any) {
      Alert.alert('ERROR', e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* FIX: STRETCH LOCK
        Container is locked to 450px on Desktop to prevent the "stretched to oblivion" issue.
      */}
      <GlassCard style={styles.container}>
        <View style={styles.header}>
          <ShieldCheck size={18} color="#4FD1C7" />
          <Text style={styles.headerTitle}>IDENTITY PROFILE</Text>
        </View>

        <TouchableOpacity
          onPress={pickImage}
          style={styles.avatarWrapper}
          disabled={uploading}
        >
          <View style={styles.avatarContainer}>
            {profile?.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.placeholder}>
                <User size={48} color="#4FD1C7" />
              </View>
            )}
            <View style={styles.camIcon}>
              {uploading ? (
                <ActivityIndicator size="small" color="#020617" />
              ) : (
                <Camera size={16} color="#020617" />
              )}
            </View>
          </View>
          <Text style={styles.avatarLabel}>TAP TO UPDATE IDENTIFIER PHOTO</Text>
        </TouchableOpacity>

        <View style={styles.formStack}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>IDENTIFIER NAME</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter biometric name"
              placeholderTextColor="#475569"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              MASTER ENCRYPTION EMAIL (READ ONLY)
            </Text>
            <View style={styles.readOnlyBox}>
              <Text style={styles.readOnlyText} numberOfLines={1}>
                {user?.email}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, uploading && styles.btnDisabled]}
            onPress={handleUpdateIdentity}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#020617" />
            ) : (
              <>
                <Text style={styles.saveText}>SYNC IDENTITY CHANGES</Text>
                <RefreshCw size={18} color="#020617" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </GlassCard>
    </View>
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
  container: {
    padding: 40,
    width: '100%',
    maxWidth: 450, // LOCKED WIDTH FOR DESKTOP
    alignItems: 'center',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(79, 209, 199, 0.3)',
    padding: 4,
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 66,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    borderRadius: 66,
    backgroundColor: 'rgba(79,209,199,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#4FD1C7',
    padding: 10,
    borderRadius: 14,
    borderWidth: 4,
    borderColor: '#020617',
  },
  avatarLabel: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  formStack: {
    width: '100%',
    gap: 24,
  },
  inputGroup: {
    width: '100%',
  },
  label: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    padding: 20,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  readOnlyBox: {
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  readOnlyText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#4FD1C7',
    width: '100%',
    padding: 22,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  saveText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
});
