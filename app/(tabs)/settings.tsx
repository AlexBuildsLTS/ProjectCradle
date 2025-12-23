import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Save, ArrowLeft, Baby, User } from 'lucide-react-native';
import { useAuthStore } from '../../src/store/auth/useAuthStore';
import { storageApi } from '../../src/api/storage';
import { supabase, Database } from '../../src/utils/supabase';
import { useRouter } from 'expo-router';

export default function ProfileEditor() {
  const { profile, fetchProfile } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [babyName, setBabyName] = useState(profile?.baby_name || '');
  const [fullName, setFullName] = useState(profile?.full_name || '');

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setLoading(true);
      try {
        await storageApi.uploadAvatar(result.assets[0].uri);
        await fetchProfile(); // Refresh global state
        Alert.alert("Success", "Avatar uploaded successfully.");
      } catch (err) {
        console.error('Avatar upload error:', err);
        Alert.alert("Upload Error", "Failed to upload avatar. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }, [fetchProfile]);

  const handleSave = useCallback(async () => {
    if (!profile?.id) {
      Alert.alert("Error", "Profile not found.");
      return;
    }

    const trimmedFullName = fullName.trim();
    const trimmedBabyName = babyName.trim();

    if (!trimmedFullName || !trimmedBabyName) {
      Alert.alert("Validation Error", "Both names are required.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        // @ts-ignore - Supabase type inference issue
        .update({
          baby_name: trimmedBabyName,
          full_name: trimmedFullName,
        })
        .eq('id', profile.id);

      if (error) {
        throw error;
      }

      await fetchProfile();
      Alert.alert("Success", "Profile updated successfully.");
      router.back();
    } catch (err) {
      console.error('Profile update error:', err);
      Alert.alert("Update Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [profile?.id, fullName, babyName, fetchProfile, router]);

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/auth');
    } catch (err) {
      console.error('Sign out error:', err);
      Alert.alert("Error", "Failed to sign out.");
    }
  }, [router]);

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F0F9FF]">
        <ActivityIndicator size="large" color="#06b6d4" />
        <Text className="mt-4 text-slate-600">Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#F0F9FF] p-6 pt-16">
      <TouchableOpacity onPress={() => router.back()} className="mb-8">
        <ArrowLeft color="#64748b" size={24} />
      </TouchableOpacity>

      <View className="items-center mb-10">
        <TouchableOpacity onPress={pickImage} disabled={loading} className="relative">
          <View className="w-32 h-32 rounded-[45px] bg-white shadow-2xl border-4 border-white overflow-hidden">
            <Image
              source={{ uri: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'User')}` }}
              className="w-full h-full"
            />
          </View>
          <View className="absolute bottom-0 right-0 bg-mint-400 p-3 rounded-2xl border-4 border-[#F0F9FF]">
            <Camera color="white" size={18} />
          </View>
        </TouchableOpacity>
        <Text className="text-slate-400 font-bold mt-4 uppercase text-[10px] tracking-widest">Update Profile Photo</Text>
      </View>

      <View className="bg-white/40 p-8 rounded-[50px] border border-white">
        <Text className="text-slate-400 text-[10px] font-black mb-2 uppercase ml-1">Parent Name</Text>
        <View className="flex-row items-center px-4 mb-6 bg-white border border-slate-100 rounded-2xl h-14">
          <User size={18} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-3 font-bold text-slate-700"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter full name"
            autoCapitalize="words"
          />
        </View>

        <Text className="text-slate-400 text-[10px] font-black mb-2 uppercase ml-1">Baby Name</Text>
        <View className="flex-row items-center px-4 mb-10 bg-white border border-slate-100 rounded-2xl h-14">
          <Baby size={18} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-3 font-bold text-slate-700"
            value={babyName}
            onChangeText={setBabyName}
            placeholder="Enter baby name"
            autoCapitalize="words"
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          className="flex-row items-center justify-center h-16 rounded-full shadow-xl bg-sky-400 shadow-sky-100"
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Save color="white" size={20} className="mr-2" />
              <Text className="text-lg font-black text-white">Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}