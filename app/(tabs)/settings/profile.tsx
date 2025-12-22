import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Save, ArrowLeft, Baby, User } from 'lucide-react-native';
import { useAuthStore } from '../../../src/store/auth/useAuthStore';
import { storageApi } from '../../../src/api/storage';
import { supabase } from '../../../src/utils/supabase';
import { useRouter } from 'expo-router';

export default function ProfileEditor() {
  const { profile, fetchProfile } = useAuthStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [babyName, setBabyName] = useState(profile?.baby_name || '');
  const [fullName, setFullName] = useState(profile?.full_name || '');

  const pickImage = async () => {
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
        Alert.alert("Success", "Avatar synchronized to the cloud.");
      } catch (err) {
        Alert.alert("Upload Error", "Biometric asset transfer failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ baby_name: babyName, full_name: fullName })
      .eq('id', profile.id);

    if (!error) {
      await fetchProfile();
      Alert.alert("Integrity Synced", "Profile data updated.");
      router.back();
    }
    setLoading(false);
  };

  return (
    <ScrollView className="flex-1 bg-[#F0F9FF] p-6 pt-16">
      <TouchableOpacity onPress={() => router.back()} className="mb-8">
        <ArrowLeft color="#64748b" size={24} />
      </TouchableOpacity>

      <View className="items-center mb-10">
        <TouchableOpacity onPress={pickImage} className="relative">
          <View className="w-32 h-32 rounded-[45px] bg-white shadow-2xl border-4 border-white overflow-hidden">
            <Image 
              source={{ uri: profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name}` }} 
              className="w-full h-full" 
            />
          </View>
          <View className="absolute bottom-0 right-0 bg-mint-400 p-3 rounded-2xl border-4 border-[#F0F9FF]">
            <Camera color="white" size={18} />
          </View>
        </TouchableOpacity>
        <Text className="text-slate-400 font-bold mt-4 uppercase text-[10px] tracking-widest">Update Biometric Photo</Text>
      </View>

      <View className="bg-white/40 p-8 rounded-[50px] border border-white">
        <Text className="text-slate-400 text-[10px] font-black mb-2 uppercase ml-1">Parent Identity</Text>
        <View className="flex-row items-center bg-white border border-slate-100 rounded-2xl px-4 h-14 mb-6">
          <User size={18} color="#94a3b8" />
          <TextInput 
            className="flex-1 ml-3 font-bold text-slate-700"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <Text className="text-slate-400 text-[10px] font-black mb-2 uppercase ml-1">Baby Identity</Text>
        <View className="flex-row items-center bg-white border border-slate-100 rounded-2xl px-4 h-14 mb-10">
          <Baby size={18} color="#94a3b8" />
          <TextInput 
            className="flex-1 ml-3 font-bold text-slate-700"
            value={babyName}
            onChangeText={setBabyName}
          />
        </View>

        <TouchableOpacity 
          onPress={handleSave}
          disabled={loading}
          className="bg-sky-400 h-16 rounded-full flex-row items-center justify-center shadow-xl shadow-sky-100"
        >
          <Save color="white" size={20} className="mr-2" />
          <Text className="text-white font-black text-lg">Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}