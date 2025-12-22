import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus, Moon, Droplet, Zap, Baby, X } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

/**
 * PROJECT CRADLE: QUICK ACTION MATRIX
 * Logic: One-touch biometric logging.
 */
export const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const ActionButton = ({ icon: Icon, label, color }: any) => (
    <Animated.View entering={ZoomIn} exiting={FadeOut} className="items-center mb-6">
      <TouchableOpacity className={`${color} w-16 h-16 rounded-full items-center justify-center shadow-lg`}>
        <Icon color="white" size={28} />
      </TouchableOpacity>
      <Text className="text-slate-600 text-[10px] font-black uppercase mt-2 tracking-widest">{label}</Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {isOpen && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={StyleSheet.absoluteFill}>
          <BlurView intensity={80} tint="light" className="flex-1 justify-end items-center pb-32">
            <View className="flex-row flex-wrap justify-center gap-10 px-10">
              <ActionButton icon={Moon} label="Sleep" color="bg-sky-400" />
              <ActionButton icon={Droplet} label="Feed" color="bg-mint-400" />
              <ActionButton icon={Zap} label="Pump" color="bg-rose-400" />
              <ActionButton icon={Baby} label="Diaper" color="bg-amber-400" />
            </View>
          </BlurView>
        </Animated.View>
      )}

      <TouchableOpacity 
        onPress={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-full items-center justify-center shadow-2xl ${isOpen ? 'bg-slate-800' : 'bg-mint-400'}`}
      >
        {isOpen ? <X color="white" size={32} /> : <Plus color="white" size={32} strokeWidth={3} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 110,
    right: 30,
    alignItems: 'center',
    zIndex: 1000,
  }
});