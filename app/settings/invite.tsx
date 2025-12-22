import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Image, Clipboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import QRCode from 'react-native-qrcode-svg';
import { ArrowLeft, Copy, Users, Cloud } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { inviteApi } from '../../src/api/invites';

export default function InviteScreen() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generate();
  }, []);

  const generate = async () => {
    try {
      const code = await inviteApi.generateInviteToken();
      setToken(code);
    } catch (err) {
      Alert.alert("Sync Error", "Could not generate secure token.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (token) {
      Clipboard.setString(token);
      Alert.alert("Copied", "Secure token copied to clipboard.");
    }
  };

  return (
    <View className="flex-1 bg-[#F0F9FF]">
      {/* DECORATIVE ELEMENTS (Cloud & Pacifier placeholder) */}
      <View className="absolute top-20 left-[-50] opacity-50">
         <Cloud size={200} color="#bae6fd" fill="#bae6fd" />
      </View>
      {/* Replace with actual 3D image asset later */}
      <View className="absolute top-40 right-[-20] w-32 h-32 bg-mint-200 rounded-full opacity-30 blur-2xl" />

      <SafeAreaView className="flex-1 p-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-10">
          <TouchableOpacity onPress={() => router.back()} className="bg-white/60 p-3 rounded-full">
            <ArrowLeft size={24} color="#475569" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-slate-800 tracking-tight">Caregiver Sync</Text>
          <View style={{ width: 48 }} />
        </View>

        {/* MAIN CARD */}
        <BlurView intensity={60} tint="light" className="p-10 rounded-[50px] border border-white bg-white/40 shadow-2xl items-center">
          <View className="w-24 h-24 bg-sky-100 rounded-3xl items-center justify-center mb-6 shadow-inner">
            <Users size={40} color="#0284c7" />
          </View>
          
          <Text className="text-3xl font-black text-slate-800 text-center mb-4 tracking-tighter">Invite a Partner</Text>
          <Text className="text-slate-500 text-center mb-10 font-medium leading-6">
            Share baby's biometric rhythm. Have the secondary caregiver scan this code to sync data instantly.
          </Text>

          {loading ? (
            <View className="h-64 items-center justify-center">
              <ActivityIndicator size="large" color="#10B981" />
              <Text className="text-slate-400 font-bold mt-4 text-xs uppercase tracking-widest">Generating Secure Hash...</Text>
            </View>
          ) : token ? (
            <View className="items-center">
              {/* QR Code Container with Glass Effect */}
              <View className="p-6 bg-white rounded-[35px] shadow-xl border-2 border-sky-100 mb-8">
                <QRCode value={token} size={180} color="#0f172a" backgroundColor="white" />
              </View>

              {/* Token Copy Chip */}
              <TouchableOpacity 
                onPress={copyToClipboard}
                className="flex-row items-center bg-white/60 px-6 py-3 rounded-full border border-white/80"
              >
                <Text className="text-slate-600 font-black text-lg mr-4 tracking-widest">{token}</Text>
                <Copy size={18} color="#94a3b8" />
              </TouchableOpacity>
              <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Token expires in 24 hours</Text>
            </View>
          ) : (
             <Text className="text-rose-400 font-bold">Failed to load token.</Text>
          )}
        </BlurView>
      </SafeAreaView>
    </View>
  );
}