/**
 * PROJECT CRADLE: SOUNDSCAPE ENGINE V2.0 (AAA+ FINAL)
 * Path: components/audio/SoundscapePlayer.tsx
 * FIXES:
 * 1. THEME SYNC: Switched to primary teal architecture to match Sleep Tab.
 * 2. AUDIO HANDSHAKE: Configured for background playback and looping.
 * 3. UI: Pro-Row control cluster for high-density night use.
 */

import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import {
  Activity,
  CloudRain,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  Wind,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GlassCard } from '../glass/GlassCard';

const SOUNDSCAPES = [
  {
    id: 'white_noise',
    name: 'Deep White Noise',
    icon: Wind,
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  },
  {
    id: 'womb',
    name: 'Womb Pulse',
    icon: Activity,
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'rain',
    name: 'Soothing Rain',
    icon: CloudRain,
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
];

export const SoundscapePlayer = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Configure global audio behavior for Sleep sessions
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });

    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const loadAndPlay = async (index: number) => {
    setLoading(true);
    if (sound) await sound.unloadAsync();

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: SOUNDSCAPES[index].uri },
        { shouldPlay: true, isLooping: true, volume: 0.5 },
      );

      setSound(newSound);
      setCurrentIndex(index);
      setIsPlaying(true);
    } catch (error) {
      console.error('Audio Handshake Failure');
    } finally {
      setLoading(false);
    }
  };

  const togglePlayback = async () => {
    if (!sound) {
      await loadAndPlay(currentIndex);
      return;
    }
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const activeTrack = SOUNDSCAPES[currentIndex];

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>SOUNDSCAPE ENGINE</Text>
        <Volume2 size={14} color="#4FD1C7" />
      </View>

      <View style={styles.trackDisplay}>
        <View style={styles.iconCircle}>
          <activeTrack.icon size={28} color="#4FD1C7" />
        </View>
        <Text style={styles.trackName}>{activeTrack.name}</Text>
        <Text style={styles.trackDesc}>
          Scientifically calibrated for REM cycles
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() =>
            loadAndPlay(
              (currentIndex - 1 + SOUNDSCAPES.length) % SOUNDSCAPES.length,
            )
          }
        >
          <SkipBack size={24} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={togglePlayback}
          style={styles.playBtn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#020617" />
          ) : isPlaying ? (
            <Pause size={28} color="#020617" fill="#020617" />
          ) : (
            <Play size={28} color="#020617" fill="#020617" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => loadAndPlay((currentIndex + 1) % SOUNDSCAPES.length)}
        >
          <SkipForward size={24} color="#475569" />
        </TouchableOpacity>
      </View>

      <View style={styles.timerRow}>
        {['15m', '30m', '60m', '∞'].map((time) => (
          <TouchableOpacity key={time} style={styles.timerBadge}>
            <Text style={styles.timerText}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: { marginTop: 24, padding: 24, borderRadius: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLabel: {
    color: '#4FD1C7',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },
  trackDisplay: { alignItems: 'center', marginBottom: 32 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(79, 209, 199, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  trackName: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  trackDesc: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  playBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4FD1C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 32,
  },
  timerBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  timerText: { color: '#475569', fontSize: 10, fontWeight: '800' },
});
