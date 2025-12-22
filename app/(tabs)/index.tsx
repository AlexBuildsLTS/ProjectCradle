import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useCradleStore } from '../../src/store/cradle/useCradleStore';
import { cradleSelectors } from '../../src/store/cradle/selectors';
import { SweetSpotProgress } from '../../src/components/surveillance/SweetSpotProgress';
import { DailyRhythmChart } from '../../src/components/surveillance/DailyRhythm';
import { GlassTile } from '../../src/components/ui/GlassTile';
import { TopBar } from '../../src/components/ui/TopBar';
import { Moon, Milk, Droplets, Utensils } from 'lucide-react-native';
import { format } from 'date-fns';
import { useSync } from '../../src/hooks/useSync';

export default function SurveillanceDashboard() {
  useSync();

  const events = useCradleStore((state) => state.events);
  const toggleSleep = useCradleStore((state) => state.toggleSleep);
  const activeSleepId = useCradleStore((state) => state.activeSleepId);
  
  const pressure = cradleSelectors.getSleepPressure(events);
  const nextWindow = cradleSelectors.getNextWindow(events);

  return (
    <View className="flex-1 bg-[#F0F9FF]">
      <TopBar />
      
      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily rhythm chart - shift view of the day */}
        <DailyRhythmChart />

        {/* Central Surveillance Engine */}
        <View className="mb-8 items-center">
          <SweetSpotProgress pressure={pressure} />
          <View className="mt-8 items-center bg-white/40 px-8 py-4 rounded-[30px] border border-white/60">
            <Text className="text-slate-500 font-bold text-lg">
              {nextWindow ? `Nap due at ${format(nextWindow, 'p')}` : 'Calculating Rhythm...'}
            </Text>
            <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">
              SweetSpot® Prediction
            </Text>
          </View>
        </View>

        {/* Action Grid */}
        <View className="flex-row flex-wrap justify-between">
          <GlassTile 
            title={activeSleepId ? "Wake Up" : "Start Nap"} 
            onPress={toggleSleep}
            variant={activeSleepId ? "mint" : "sky"}
            className="w-[48%] aspect-square mb-4"
          >
            <Moon size={24} color={activeSleepId ? "#10B981" : "#7DD3FC"} />
          </GlassTile>

          <GlassTile title="Bottle" variant="sky" className="w-[48%] aspect-square mb-4">
            <Milk size={24} color="#7DD3FC" />
          </GlassTile>

          <GlassTile title="Diaper" className="w-[48%] aspect-square">
            <Droplets size={24} color="#94a3b8" />
          </GlassTile>

          <GlassTile title="Solids" className="w-[48%] aspect-square">
            <Utensils size={24} color="#94a3b8" />
          </GlassTile>
        </View>
      </ScrollView>
    </View>
  );
}