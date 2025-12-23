import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Bell, ChevronDown, LogOut, Settings, ShieldCheck, User, AlertCircle, CheckCircle } from 'lucide-react-native';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { notificationApi } from '../../api/notifications';
import { Button } from './Button';

/**
 * PROJECT CRADLE: MASTER COMMAND BRIDGE (TopBar)
 * Enhanced with responsive design, glass morphism, and modern UX.
 * Aesthetic: Frosted Glass / Serene Cloud with adaptive layout.
 */

interface Profile {
  baby_name?: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
  email?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  timestamp?: string;
  type?: 'info' | 'warning' | 'success' | 'error';
}

interface MenuItem {
  icon: any;
  label: string;
  onPress?: () => void;
}

export const TopBar = () => {
  const { profile, logout } = useAuthStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive design: Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const { width } = Dimensions.get('window');
      setIsMobile(width < 768);
    };

    checkScreenSize();

    // Listen to dimension changes
    const subscription = Dimensions.addEventListener('change', checkScreenSize);

    return () => {
      subscription?.remove();
    };
  }, []);

  // Fetch notifications with improved error handling
  const loadNotifications = async () => {
    try {
      const data = await notificationApi.fetchAll();
      setNotifs(data);
    } catch (err) {
      console.error("[Cradle TopBar] Notification Load Failure:", err);
      // Show error notification
      setNotifs(prev => [{
        id: 'error',
        title: 'Notification Error',
        message: 'Failed to load notifications',
        is_read: false,
        type: 'error'
      }, ...prev]);
    }
  };

  // Auto-refresh notifications every 5 minutes when dropdown is open
  useEffect(() => {
    if (showNotifs) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 300000);
      return () => clearInterval(interval);
    }
  }, [showNotifs]);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("[Cradle TopBar] Mark Read Failure:", err);
    }
  };

  const hasUnread = notifs.some(n => !n.is_read);
  const unreadCount = notifs.filter(n => !n.is_read).length;

  // Menu items with proper typing
  const menuItems: MenuItem[] = [
    { icon: User, label: 'Baby Profile' },
    { icon: ShieldCheck, label: 'Security Settings' },
    { icon: Settings, label: 'Preferences' },
  ];

  return (
    <View style={styles.container}>
      {/* MAIN TOOLBAR - Glass Morphism Enhanced */}
      <BlurView intensity={40} tint="light" className="flex-row items-center justify-between px-4 pt-12 pb-4 border-b md:px-6 md:pt-14 border-white/30 bg-white/20 glass-tile">
        {/* LEFT: BABY IDENTITY - Responsive Layout */}
        <TouchableOpacity
          onPress={() => {
            setShowProfile(!showProfile);
            setShowNotifs(false);
          }}
          className="flex-row items-center flex-1"
          accessible={true}
          accessibilityLabel={`Profile menu for ${profile?.baby_name || 'Project Cradle'}`}
        >
          <View className="items-center justify-center w-10 h-10 overflow-hidden bg-teal-100 border-2 border-white rounded-full shadow-sm md:w-11 md:h-11">
            <Image
              source={{ uri: profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.baby_name || 'Baby'}&background=BAE6FD&color=0369a1` }}
              className="w-full h-full"
              accessible={true}
              accessibilityLabel="Baby avatar"
            />
          </View>
          {!isMobile && (
            <View className="ml-3">
              <Text className="text-base font-black tracking-tight text-slate-800 md:text-lg" numberOfLines={1}>
                {profile?.baby_name || 'Project Cradle'}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Surveillance Active
                </Text>
                <ChevronDown size={12} color="#94a3b8" className="ml-1" />
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* RIGHT: NOTIFICATION HUB - Enhanced with unread count */}
        <TouchableOpacity
          onPress={() => {
            setShowNotifs(!showNotifs);
            setShowProfile(false);
          }}
          className="items-center justify-center w-10 h-10 border border-white rounded-full shadow-sm md:w-11 md:h-11 bg-white/70"
          accessible={true}
          accessibilityLabel={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell size={20} color="#475569" />
          {hasUnread && (
            <View className="absolute top-1.5 right-1.5 w-3 h-3 md:w-3.5 md:h-3.5 bg-rose-400 rounded-full border-2 border-white items-center justify-center">
              <Text className="text-white text-[8px] font-bold">{Math.min(unreadCount, 9)}</Text>
            </View>
          )}
        </TouchableOpacity>
      </BlurView>

      {/* RESPONSIVE NOTIFICATION DROPDOWN - Enhanced UX */}
      {showNotifs && (
        <BlurView intensity={95} tint="light" style={[styles.dropdown, isMobile ? styles.mobileDropdown : styles.desktopDropdown]} className="rounded-[40px] border border-white shadow-2xl overflow-hidden glass-tile-purple">
          <View className="flex-row items-center justify-between p-4 border-b md:p-6 border-slate-100">
            <Text className="text-base font-black text-slate-800 md:text-lg">Alerts</Text>
            {hasUnread && (
              <Button
                title="Mark all read"
                variant="secondary"
                onPress={handleMarkAllRead}
                className="px-3 py-1 text-xs md:text-sm"
              />
            )}
          </View>

          {/* Enhanced Notification List */}
          <FlatList
            data={notifs}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            className="max-h-[300px] md:max-h-[400px]"
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`p-4 md:p-5 border-b border-slate-50 ${item.is_read ? 'opacity-60' : 'bg-white/20'}`}
                onPress={() => {
                  // Mark as read when clicked
                  setNotifs(prev => prev.map(n => n.id === item.id ? { ...n, is_read: true } : n));
                }}
              >
                <View className="flex-row items-start">
                  {item.type === 'error' && <AlertCircle size={16} color="#ef4444" className="mr-2 mt-0.5" />}
                  {item.type === 'success' && <CheckCircle size={16} color="#10b981" className="mr-2 mt-0.5" />}
                  {item.type === 'warning' && <AlertCircle size={16} color="#f59e0b" className="mr-2 mt-0.5" />}
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-slate-800 md:text-base">{item.title}</Text>
                    <Text className="mt-1 text-xs leading-4 text-slate-500 md:text-sm">{item.message}</Text>
                    {item.timestamp && (
                      <Text className="text-slate-400 text-[10px] mt-1">{new Date(item.timestamp).toLocaleTimeString()}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className="items-center p-8 md:p-10">
                <Bell size={32} color="#cbd5e1" />
                <Text className="mt-2 text-sm font-bold text-slate-400 md:text-base">No new alerts</Text>
                <Text className="mt-1 text-xs text-slate-300">Everything is running smoothly</Text>
              </View>
            }
          />
        </BlurView>
      )}

      {/* RESPONSIVE PROFILE DROPDOWN - Modern Design */}
      {showProfile && (
        <BlurView intensity={95} tint="light" style={[styles.profileDropdown, isMobile ? styles.mobileProfileDropdown : styles.desktopProfileDropdown]} className="rounded-[40px] border border-white shadow-2xl overflow-hidden glass-tile-teal">
          <View className="p-4 border-b md:p-6 border-slate-100 bg-white/20">
            <Text className="text-base font-black text-slate-800 md:text-lg">{profile?.full_name || 'Parent'}</Text>
            <View className="bg-teal-100 self-start px-2 py-0.5 rounded-md mt-1">
              <Text className="text-teal-700 text-[10px] font-bold uppercase">{profile?.role || 'Caregiver'}</Text>
            </View>
            {profile?.email && <Text className="mt-2 text-xs text-slate-500">Signed in as: {profile?.email}</Text>}
          </View>

          <View className="p-2">
            {menuItems.map((item, index) => (
              <MenuRow
                key={index}
                icon={item.icon}
                label={item.label}
                onPress={() => {
                  setShowProfile(false);
                  // Handle navigation
                }}
              />
            ))}
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

const MenuRow = ({ icon: Icon, label, onPress }: MenuItem) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center p-4 rounded-3xl active:bg-slate-50"
  >
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
  mobileDropdown: {
    width: '90%',
    left: '5%',
    right: '5%',
  },
  desktopDropdown: {
    width: 320,
  },
  profileDropdown: {
    position: 'absolute',
    top: 120,
    left: 20,
    width: 280,
  },
  mobileProfileDropdown: {
    width: '90%',
    left: '5%',
    right: '5%',
  },
  desktopProfileDropdown: {
    width: 280,
  },
});
