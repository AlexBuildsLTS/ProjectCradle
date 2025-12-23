import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import { Baby, Camera, ChevronLeft, Save, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * PROJECT CRADLE: BIOMETRIC IDENTITY MANAGER
 * Target: app/(tabs)/settings/profile.tsx
 */

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. BIOMETRIC STATE MAPPING
  const [profile, setProfile] = useState({
    full_name: '',
    baby_name: '',
    baby_dob: '',
    avatar_url: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // 2. DATA ACQUISITION
  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, baby_name, baby_dob, avatar_url')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data);
    } catch (error) {
      console.error('Profile Acquisition Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // 3. PERSISTENCE LOGIC
  const handleSave = async () => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        // @ts-ignore - Supabase type inference issue
        .update({
          full_name: profile.full_name,
          baby_name: profile.baby_name,
          baby_dob: profile.baby_dob,
          avatar_url: profile.avatar_url,
        })
        .eq('id', user.id);

      if (error) throw error;
      Alert.alert(
        'System Synchronized',
        'Biometric identity updated successfully.'
      );
    } catch (error: any) {
      Alert.alert('Sync Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-sky-50">
        <ActivityIndicator color="#10B981" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-[#F0F9FF]"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* HEADER NAVIGATION */}
      <View className="flex-row items-center p-6 mt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-3 bg-white border shadow-sm rounded-2xl border-slate-100"
        >
          <ChevronLeft size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View className="items-center px-8">
        {/* BIOMETRIC PHOTO UPLOAD */}
        <View className="items-center mb-10">
          <View className="w-32 h-32 bg-white rounded-[40px] items-center justify-center shadow-xl shadow-sky-100 border-4 border-white overflow-hidden">
            {profile.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                className="w-full h-full"
              />
            ) : (
              <View className="items-center justify-center w-full h-full bg-sky-50">
                <User size={48} color="#bae6fd" />
              </View>
            )}
            <TouchableOpacity className="absolute bottom-0 right-0 p-2 border-4 border-white bg-mint-400 rounded-2xl">
              <Camera size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-4">
            Update Biometric Photo
          </Text>
        </View>

        {/* IDENTITY FORM MESH */}
        <View className="w-full space-y-8">
          <View>
            <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3 ml-2">
              Parent Identity
            </Text>
            <View className="bg-white/60 border border-white rounded-[30px] px-6 h-18 flex-row items-center shadow-sm">
              <User size={20} color="#94a3b8" />
              <TextInput
                className="flex-1 ml-4 text-lg font-bold text-slate-700"
                placeholder="Full Name"
                value={profile.full_name}
                onChangeText={(text) =>
                  setProfile({ ...profile, full_name: text })
                }
              />
            </View>
          </View>

          <View>
            <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3 ml-2">
              Baby Identity
            </Text>
            <View className="bg-white/60 border border-white rounded-[30px] px-6 h-18 flex-row items-center shadow-sm">
              <Baby size={20} color="#94a3b8" />
              <TextInput
                className="flex-1 ml-4 text-lg font-bold text-slate-700"
                placeholder="Baby's Name"
                value={profile.baby_name}
                onChangeText={(text) =>
                  setProfile({ ...profile, baby_name: text })
                }
              />
            </View>
          </View>

          {/* MASTER SYNC BUTTON */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className="bg-[#38BDF8] h-20 rounded-[35px] items-center justify-center flex-row shadow-xl shadow-sky-200 mt-10"
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Save size={24} color="white" className="mr-3" />
                <Text className="text-xl font-black text-white">
                  Save Changes
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
