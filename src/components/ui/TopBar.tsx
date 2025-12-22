import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Bell, ChevronDown, LogOut, Settings, ShieldCheck, User } from 'lucide-react-native';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { notificationApi } from '../../api/notifications';

/**
 * PROJECT CRADLE: MASTER COMMAND BRIDGE (TopBar)
 * Handles: Profile Context, Real-time Notifications, and Global Actions.
 * Aesthetic: Frosted Glass / Serene Cloud.
 */

export const TopBar = () => {
  const { profile, logout } = useAuthStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);

  // 1. Fetch notifications on mount & when opened
  useEffect(() => {
    if (showNotifs) {
      loadNotifications();
    }
  }, [showNotifs]);

  const loadNotifications = async () => {
    try {
      const data = await notificationApi.fetchAll();
      setNotifs(data);
    } catch (err) {
      console.error("[Cradle TopBar] Notification Load Failure:", err);
    }
  };

  const handleMarkAllRead = async () => {
    await notificationApi.markAllRead();
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const hasUnread = notifs.some(n => !n.is_read);

  return (
    <View style={styles.container}>
      <BlurView intensity={40} tint="light" className="px-6 pb-4 pt-14 flex-row justify-between items-center border-b border-white/30 bg-white/20">
        
        {/* LEFT: BABY IDENTITY */}
        <TouchableOpacity 
          onPress={() => setShowProfile(!showProfile)}
          className="flex-row items-center"
        >
          <View className="w-11 h-11 rounded-full bg-sky-100 items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            <Image
              source={{ uri: `https://ui-avatars.com/api/?name=${profile?.baby_name || 'Baby'}&background=BAE6FD&color=0369a1` }}
              className="w-full h-full"
            />
          </View>
          <View className="ml-3">
            <Text className="text-slate-800 font-black text-lg tracking-tight">{profile?.baby_name || 'Project Cradle'}</Text>
            <View className="flex-row items-center">
              <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Surveillance Active
              </Text>
              <ChevronDown size={12} color="#94a3b8" className="ml-1" />
            </View>
          </View>
        </TouchableOpacity>

        {/* RIGHT: NOTIFICATION HUB */}
        <TouchableOpacity 
          onPress={() => {
            setShowNotifs(!showNotifs);
            setShowProfile(false);
          }}
          className="w-11 h-11 bg-white/70 rounded-full items-center justify-center border border-white shadow-sm"
        >
          <Bell size={22} color="#475569" />
          {hasUnread && (
            <View className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-400 rounded-full border-2 border-white" />
          )}
        </TouchableOpacity>
      </BlurView>

      {/* --- DROPDOWN A: NOTIFICATIONS (Referencing image_69bd7b.png) --- */}
      {showNotifs && (
        <BlurView intensity={95} tint="light" style={styles.dropdown} className="rounded-[40px] border border-white shadow-2xl overflow-hidden">
          <View className="p-6 flex-row justify-between items-center border-b border-slate-100">
            <Text className="font-black text-slate-800 text-base">Alerts</Text>
            <TouchableOpacity onPress={handleMarkAllRead}>
              <Text className="text-mint-500 font-bold text-xs">Mark all read</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={notifs}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            className="max-h-[400px]"
            renderItem={({ item }) => (
              <TouchableOpacity className={`p-5 border-b border-slate-50 ${item.is_read ? 'opacity-40' : 'bg-white/40'}`}>
                <Text className="text-slate-800 font-bold text-sm">{item.title}</Text>
                <Text className="text-slate-500 text-xs mt-1 leading-4">{item.message}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className="p-10 items-center">
                <Bell size={32} color="#cbd5e1" />
                <Text className="text-slate-400 font-bold mt-2">No new alerts</Text>
              </View>
            }
          />
        </BlurView>
      )}

      {/* --- DROPDOWN B: PROFILE MENU (Referencing image_750f85.png) --- */}
      {showProfile && (
        <BlurView intensity={95} tint="light" style={styles.profileDropdown} className="rounded-[40px] border border-white shadow-2xl overflow-hidden">
          <View className="p-6 border-b border-slate-100 bg-white/40">
            <Text className="font-black text-slate-800 text-lg">{profile?.full_name}</Text>
            <View className="bg-sky-100 self-start px-2 py-0.5 rounded-md mt-1">
              <Text className="text-sky-700 text-[10px] font-bold uppercase">{profile?.role}</Text>
            </View>
          </View>
          
          <View className="p-2">
            <MenuRow icon={User} label="Baby Profile" />
            <MenuRow icon={ShieldCheck} label="Security Settings" />
            <MenuRow icon={Settings} label="Preferences" />
            <View className="h-[1px] bg-slate-100 my-2 mx-4" />
            <TouchableOpacity 
              onPress={logout}
              className="flex-row items-center p-4 rounded-3xl active:bg-rose-50"
            >
              <LogOut size={18} color="#f43f5e" />
              <Text className="ml-3 font-bold text-rose-500">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      )}
    </View>
  );
};

const MenuRow = ({ icon: Icon, label }: any) => (
  <TouchableOpacity className="flex-row items-center p-4 rounded-3xl active:bg-slate-50">
    <Icon size={18} color="#64748b" />
    <Text className="ml-3 font-bold text-slate-600">{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
  },
  dropdown: {
    position: 'absolute',
    top: 120,
    right: 20,
    width: 320,
  },
  profileDropdown: {
    position: 'absolute',
    top: 120,
    left: 20,
    width: 280,
  }
});