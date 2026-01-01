/**
 * PROJECT CRADLE: IDENTITY PROFILE MASTER V4.0 (AAA+)
 * Path: app/(app)/settings/profile.tsx
 * ----------------------------------------------------------------------------
 * CRITICAL UPGRADES:
 * 1. AUTHORIZATION HUD: Real-time role display via Sovereign Badge Engine.
 * 2. BIO-SYNC: Atomic identity updates with haptic confirmation.
 * 3. DESKTOP GRID: Scaled for professional monitor layouts.
 * 4. ERROR GUARD: Comprehensive sync-failure handling for storage uploads.
 */

import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  Camera,
  ChevronLeft,
  Fingerprint,
  Lock,
  Mail,
  RefreshCw,
  User,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { GlassCard } from '@/components/glass/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/auth';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.full_name || '');
  const [uploading, setUploading] = useState(false);

  // --- ANIMATION RE-ENGAGEMENT ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const triggerFeedback = () => {
    if (Platform.OS !== 'web')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  /**
   * SOVEREIGN STORAGE SYNC
   * Forges public URL for Biometric Identity Photo.
   */
  const uploadAvatar = async (asset: ImagePicker.ImagePickerAsset) => {
    setUploading(true);
    try {
      const fileExt = asset.uri.split('.').pop();
      const fileName = `${user?.id}/id_sync_${Date.now()}.${fileExt}`;
      let fileBody;

      if (Platform.OS === 'web') {
        const response = await fetch(asset.uri);
        fileBody = await response.blob();
      } else {
        const formData = new FormData();
        formData.append('file', {
          uri: asset.uri,
          name: fileName,
          type: `image/${fileExt}`,
        } as any);
        fileBody = formData;
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, fileBody, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      refreshProfile();
      if (Platform.OS !== 'web')
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      Alert.alert('SYNC_ERROR', e.message);
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) uploadAvatar(result.assets[0]);
  };

  const handleUpdateIdentity = async () => {
    if (!name.trim())
      return Alert.alert('Invalid Identifier', 'Name field cannot be empty.');
    setUploading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name.trim() })
        .eq('id', user?.id);

      if (error) throw error;
      refreshProfile();
      if (Platform.OS !== 'web')
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      Alert.alert('ERROR', e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.cardWrapper,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <GlassCard style={[styles.container, isDesktop ? styles.desktopHUD : {}]}>
          {/* HEADER NAV HANDSHAKE */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push('/(app)/settings')}
            >
              <ChevronLeft size={22} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.titleStack}>
              <Text style={styles.headerTitle}>IDENTITY PROFILE</Text>
              <Text style={styles.headerSub}>SOVEREIGN CORE V4.0</Text>
            </View>
            <Fingerprint size={20} color={Theme.colors.primary} />
          </View>

          {/* AVATAR HANDSHAKE */}
          <TouchableOpacity
            onPress={pickImage}
            style={styles.avatarWrapper}
            disabled={uploading}
          >
            <View style={styles.avatarGlow}>
              <View style={styles.avatarContainer}>
                {profile?.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    style={styles.avatar}
                  />
                ) : (
                  <User size={60} color={Theme.colors.primary} />
                )}
                <View style={styles.camIcon}>
                  {uploading ? (
                    <ActivityIndicator size="small" color="#020617" />
                  ) : (
                    <Camera size={16} color="#020617" />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* AUTHORIZATION STATUS */}
          <View style={styles.authBox}>
            <View style={styles.authInfo}>
              <Lock size={14} color="rgba(255,255,255,0.4)" />
              <Text style={styles.authLabel}>BIOMETRIC ACCESS LEVEL</Text>
            </View>
            <Badge
              label={profile?.role || 'MEMBER'}
              role={profile?.role as any}
              variant="glass"
            />
          </View>

          {/* FORM COMMANDS */}
          <View style={styles.formStack}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>IDENTIFIER NAME</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Update Identity"
                placeholderTextColor="#475569"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ENCRYPTION EMAIL (LOCKED)</Text>
              <View style={styles.readOnlyBox}>
                <Mail size={16} color="#475569" />
                <Text style={styles.readOnlyText}>{user?.email}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, uploading && styles.btnDisabled]}
              onPress={() => {
                triggerFeedback();
                handleUpdateIdentity();
              }}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#020617" />
              ) : (
                <>
                  <Text style={styles.saveText}>SYNC IDENTITY CHANGES</Text>
                  <RefreshCw size={18} color="#020617" strokeWidth={3} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </GlassCard>
      </Animated.View>
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
  cardWrapper: { width: '100%', alignItems: 'center' },
  container: {
    padding: 32,
    width: '100%',
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  desktopHUD: { maxWidth: 520 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStack: { alignItems: 'center' },
  headerTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  headerSub: {
    color: Theme.colors.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 3,
    marginTop: 4,
  },
  avatarWrapper: { alignItems: 'center', marginBottom: 32 },
  avatarGlow: {
    padding: 6,
    borderRadius: 90,
    backgroundColor: 'rgba(79, 209, 199, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatar: { width: '100%', height: '100%', borderRadius: 70 },
  camIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Theme.colors.primary,
    padding: 10,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: '#020617',
  },
  authBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  authInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  authLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  formStack: { gap: 24 },
  inputGroup: { gap: 12 },
  label: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    padding: 20,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  readOnlyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  readOnlyText: { color: '#475569', fontWeight: '700', fontSize: 14, flex: 1 },
  saveBtn: {
    backgroundColor: Theme.colors.primary,
    padding: 24,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.5 },
  saveText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
});
