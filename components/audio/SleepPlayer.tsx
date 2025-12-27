import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { Play, Pause, CloudRain, Wind, Waves } from 'lucide-react-native';
import { GlassCard } from '@/components/glass/GlassCard';

export const SleepPlayer = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function toggleSound() {
    if (isPlaying) {
      await sound?.pauseAsync();
      setIsPlaying(false);
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(
         { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' } // Replace with local white noise
      );
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
    }
  }

  return (
    <GlassCard className="mt-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="p-3 bg-primary/20 rounded-2xl">
            <CloudRain size={24} color="#4FD1C7" />
          </View>
          <View className="ml-4">
            <Text className="text-lg font-bold text-neutral-900">Deep White Noise</Text>
            <Text className="text-sm text-neutral-500">Helps baby stay asleep</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={toggleSound}
          className="items-center justify-center w-12 h-12 rounded-full shadow-lg bg-primary"
        >
          {isPlaying ? <Pause size={20} color="white" /> : <Play size={20} color="white" fill="white" />}
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
};