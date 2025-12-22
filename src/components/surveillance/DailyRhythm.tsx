import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Sun, Moon, Cloud } from 'lucide-react-native';

/**
 * PROJECT CRADLE: DAILY RHYTHM CHART
 * Visualizes predicted Awake Windows and Sleep Pressure across a 24h timeline.
 */

export const DailyRhythmChart = () => {
  // Mock data for the rhythm (In Phase 3, this flows from cradleSelectors)
  const segments = [
    { time: '08:00', type: 'WAKE', label: 'Morning Wake' },
    { time: '10:15', type: 'SLEEP', label: 'Nap 1', duration: '1.5h' },
    { time: '13:45', type: 'SLEEP', label: 'Nap 2', duration: '1h', isNext: true },
    { time: '19:30', type: 'SLEEP', label: 'Bedtime' },
  ];

  return (
    <View className="mt-4 mb-8">
      <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-3 ml-2">
        Daily Rhythm
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {segments.map((item, index) => (
          <View key={index} className="mr-4 items-center">
            <View 
              className={`w-24 h-32 rounded-full border border-white/60 items-center justify-center 
                ${item.isNext ? 'bg-mint-100/60 border-mint-200' : 'bg-white/40'}`}
            >
              <Text className="text-slate-400 text-[10px] font-bold mb-2">{item.time}</Text>
              <View className={`p-2 rounded-full ${item.isNext ? 'bg-mint-400' : 'bg-sky-200'}`}>
                {item.type === 'WAKE' ? <Sun size={16} color="white" /> : <Moon size={16} color="white" />}
              </View>
              <Text className="text-slate-600 font-bold text-[12px] mt-2">{item.label}</Text>
              {item.duration && <Text className="text-slate-400 text-[10px]">{item.duration}</Text>}
            </View>
            {item.isNext && (
              <View className="mt-2 bg-mint-500 w-1.5 h-1.5 rounded-full" />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};