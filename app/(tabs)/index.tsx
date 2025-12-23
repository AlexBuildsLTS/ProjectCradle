import React, { useMemo } from 'react';
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';

// Third-party imports
import { format } from 'date-fns';
import { Moon, Milk, Droplets, Utensils } from 'lucide-react-native';

// Local imports
import { useCradleStore } from '../../src/store/cradle/useCradleStore';
import { cradleSelectors } from '../../src/store/cradle/selectors';
import { SweetSpotProgress } from '../../src/components/surveillance/SweetSpotProgress';
import { DailyRhythmChart } from '../../src/components/surveillance/DailyRhythm';
import { GlassTile } from '../../src/components/ui/GlassTile';
import { TopBar } from '../../src/components/ui/TopBar';
import { useSync } from '../../src/hooks/useSync';

// Modern Color Constants - Teal & Purple Theme
const COLORS = {
  teal: '#14B8A6',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
  slate: '#64748b',
};

export default function SurveillanceDashboard() {
  useSync();

  // Get window dimensions for responsive design
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  // Destructure store once for better performance
  const {
    events,
    toggleSleep,
    activeSleepId,
    addEvent,
    addDiaperEvent,
  } = useCradleStore();

  // Memoize grouped events to avoid recalculation on every render
  const groupedEvents = useMemo(() => cradleSelectors.getGroupedEvents(events), [events]);

  // Memoize derived values
  const pressure = useMemo(() => cradleSelectors.getSleepPressure(events), [events]);
  const nextWindow = useMemo(() => cradleSelectors.getNextWindow(events), [events]);
  const lastDiaper = useMemo(() => cradleSelectors.getLastDiaperEvent(events), [events]);
  const lastFeed = useMemo(() => cradleSelectors.getLastFeedEvent(events), [events]);
  const lastSolid = useMemo(() => cradleSelectors.getLastSolidEvent(events), [events]);

  // Handlers
  const handleAddFeed = () => addEvent('feed');
  const handleAddSolid = () => addEvent('solid');
  const handleAddDiaper = () => addDiaperEvent();

  // Helper to format last event time
  const formatLastEvent = (event: any) => event ? format(event.timestamp, 'p') : 'None';

  return (
    <View className="flex-1 bg-gradient-to-br from-teal-50 via-purple-50 to-cyan-50">
      <TopBar />

      <ScrollView
        contentContainerStyle={{ 
          paddingHorizontal: isDesktop ? 48 : isTablet ? 32 : 20, 
          paddingTop: 20, 
          paddingBottom: 120 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily rhythm chart - shift view of the day */}
        <View className="mb-6 md:mb-8">
          <DailyRhythmChart />
        </View>

        {/* Central Surveillance Engine */}
        <View className="items-center mb-8 md:mb-12">
          <SweetSpotProgress pressure={pressure} />
          <View className="items-center px-6 py-4 mt-6 border glass-tile-purple md:px-10 md:py-6 border-purple-200/40">
            <Text className="text-base font-bold text-center md:text-lg lg:text-xl text-slate-700">
              {nextWindow ? `Nap due at ${format(nextWindow, 'p')}` : 'Calculating Rhythm...'}
            </Text>
            <Text className="text-slate-400 text-[10px] md:text-xs uppercase font-bold tracking-widest mt-2">
              SweetSpot® Prediction
            </Text>
          </View>
        </View>

        {/* Action Grid - Responsive Layout */}
        <View className={`
          flex-row flex-wrap justify-between
          ${isDesktop ? 'max-w-6xl mx-auto' : ''}
        `}>
          <GlassTile
            title={activeSleepId ? "Wake Up" : "Start Nap"}
            onPress={toggleSleep}
            variant={activeSleepId ? "teal" : "purple"}
            className={`
              mb-4 md:mb-6
              ${isDesktop ? 'w-[24%] aspect-square' : isTablet ? 'w-[48%] aspect-square' : 'w-[48%] aspect-square'}
            `}
          >
            <View className="items-center justify-center">
              <Moon size={isDesktop ? 36 : 28} color={activeSleepId ? COLORS.teal : COLORS.purple} strokeWidth={2} />
              <Text className="mt-2 text-xs text-center text-slate-500 md:text-sm">
                Active sleep tracking
              </Text>
            </View>
          </GlassTile>

          <GlassTile
            title="Bottle"
            variant="teal"
            className={`
              mb-4 md:mb-6
              ${isDesktop ? 'w-[24%] aspect-square' : isTablet ? 'w-[48%] aspect-square' : 'w-[48%] aspect-square'}
            `}
            onPress={handleAddFeed}
          >
            <View className="items-center justify-center">
              <Milk size={isDesktop ? 36 : 28} color={COLORS.teal} strokeWidth={2} />
              <Text className="mt-2 text-xs text-center text-slate-500 md:text-sm">
                Last: {formatLastEvent(lastFeed)}
              </Text>
            </View>
          </GlassTile>

          <GlassTile
            title="Diaper"
            variant="default"
            className={`
              mb-4 md:mb-6
              ${isDesktop ? 'w-[24%] aspect-square' : isTablet ? 'w-[48%] aspect-square' : 'w-[48%] aspect-square'}
            `}
            onPress={handleAddDiaper}
          >
            <View className="items-center justify-center">
              <Droplets size={isDesktop ? 36 : 28} color={COLORS.cyan} strokeWidth={2} />
              <Text className="mt-2 text-xs text-center text-slate-500 md:text-sm">
                Last: {formatLastEvent(lastDiaper)}
              </Text>
            </View>
          </GlassTile>

          <GlassTile
            title="Solids"
            variant="green"
            className={`
              mb-4 md:mb-6
              ${isDesktop ? 'w-[24%] aspect-square' : isTablet ? 'w-[48%] aspect-square' : 'w-[48%] aspect-square'}
            `}
            onPress={handleAddSolid}
          >
            <View className="items-center justify-center">
              <Utensils size={isDesktop ? 36 : 28} color={COLORS.slate} strokeWidth={2} />
              <Text className="mt-2 text-xs text-center text-slate-500 md:text-sm">
                Last: {formatLastEvent(lastSolid)}
              </Text>
            </View>
          </GlassTile>
        </View>

        {/* Additional Info Section */}
        {isDesktop && (
          <View className="max-w-6xl p-6 mx-auto mt-8 glass-tile">
            <Text className="mb-2 text-lg font-bold text-slate-800">Today's Summary</Text>
            <Text className="text-sm text-slate-600">
              Track your baby's daily rhythm and monitor their sleep, feeding, and diaper patterns.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
