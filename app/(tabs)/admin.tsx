import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Shield, Activity, Users, MessageSquare, ChevronRight, Zap, Ban } from 'lucide-react-native';
import { adminApi } from '../../src/api/admin';
import { BlurView } from 'expo-blur';

/**
 * PROJECT CRADLE: ADMIN MANAGEMENT CONSOLE
 * Logic: System-wide surveillance and role-based intervention.
 */
export default function AdminScreen() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    adminApi.getAdminStats().then(setStats);
  }, []);

  const ControlTile = ({ icon: Icon, title, value, color }: any) => (
    <View className="w-[48%] bg-white/40 border border-white p-6 rounded-[35px] mb-4">
      <View className={`w-10 h-10 rounded-2xl items-center justify-center mb-4 ${color}`}>
        <Icon size={20} color="white" />
      </View>
      <Text className="text-slate-700 text-2xl font-black">{value || '0'}</Text>
      <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{title}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-[#F0F9FF]" contentContainerStyle={{ padding: 24, paddingTop: 64 }}>
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-slate-800 text-4xl font-black tracking-tighter">Admin Portal</Text>
          <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-[2px]">Operational Command</Text>
        </View>
        <BlurView intensity={20} className="bg-mint-100 px-3 py-1 rounded-full border border-mint-200">
          <Text className="text-mint-600 text-[10px] font-black uppercase tracking-widest">Live</Text>
        </BlurView>
      </View>

      <View className="flex-row flex-wrap justify-between">
        <ControlTile icon={Users} title="Total Users" value={stats?.totalUsers} color="bg-sky-400" />
        <ControlTile icon={MessageSquare} title="Open Tickets" value={stats?.activeTickets} color="bg-rose-400" />
      </View>

      <Text className="text-slate-400 font-black uppercase text-[10px] tracking-widest mt-8 mb-4 ml-2">Console Modules</Text>
      
      {[
        { label: 'User Directory', icon: Users, desc: 'Manage roles and bans' },
        { label: 'Support Queue', icon: MessageSquare, desc: 'Triage active help requests' },
        { label: 'Security Audit', icon: Shield, desc: 'View system access logs' }
      ].map((item) => (
        <TouchableOpacity key={item.label} className="bg-white/40 border border-white p-6 rounded-[40px] mb-4 flex-row items-center justify-between shadow-sm">
          <View className="flex-row items-center flex-1">
            <View className="bg-slate-100 w-12 h-12 rounded-2xl items-center justify-center mr-4">
               <item.icon size={22} color="#64748b" />
            </View>
            <View>
              <Text className="text-slate-700 font-black text-lg">{item.label}</Text>
              <Text className="text-slate-400 text-xs font-medium">{item.desc}</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#cbd5e1" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}