import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <View className={`rounded-[32px] overflow-hidden border border-white/10 ${className}`} style={styles.cardShadow}>
      <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.gradientOverlay} />
      <View className="p-8">{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(79, 209, 199, 0.03)', // Subtle Teal Glow
  }
});