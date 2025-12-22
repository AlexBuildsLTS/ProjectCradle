import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Play, Pause, RotateCcw } from 'lucide-react-native';

export const ActiveTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [side, setSide] = useState<'L' | 'R'>('L');

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View className="bg-white/40 p-8 rounded-[50px] border border-white items-center shadow-sm">
      <Text className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-4">Active Session: {side === 'L' ? 'Left' : 'Right'}</Text>
      
      <Text className="text-slate-700 text-6xl font-black mb-8">{formatTime(seconds)}</Text>
      
      <View className="flex-row items-center gap-6">
        <TouchableOpacity 
          onPress={() => setSeconds(0)}
          className="w-14 h-14 bg-white/60 rounded-full items-center justify-center border border-white"
        >
          <RotateCcw size={20} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setIsActive(!isActive)}
          className="w-24 h-24 bg-mint-400 rounded-full items-center justify-center shadow-xl shadow-mint-200"
        >
          {isActive ? <Pause size={32} color="white" fill="white" /> : <Play size={32} color="white" fill="white" />}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setSide(side === 'L' ? 'R' : 'L')}
          className="w-14 h-14 bg-white/60 rounded-full items-center justify-center border border-white"
        >
          <Text className="text-slate-600 font-black">{side === 'L' ? 'R' : 'L'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};