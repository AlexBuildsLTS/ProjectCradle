// components/tracking/TimelineItem.tsx
import { View, Text } from 'react-native';
import { EventType } from '@/types/biometrics';
import { Utensils, Moon, Droplets } from 'lucide-react-native';

const ICON_MAP = {
  FEED: { icon: Utensils, color: '#4FD1C7' },
  SLEEP: { icon: Moon, color: '#B794F6' },
  DIAPER: { icon: Droplets, color: '#F6AD55' },
};

export const TimelineItem = ({ type, time, detail }: { type: EventType; time: string; detail: string }) => {
  const Config = ICON_MAP[type as keyof typeof ICON_MAP];
  
  return (
    <View className="flex-row items-center mb-6">
      <View className="w-12 items-center">
        <Text className="text-xs text-neutral-400 font-bold">{time}</Text>
      </View>
      <View className="mx-4 h-full w-[2px] bg-neutral-200 relative items-center">
        <View className="absolute top-0 w-4 h-4 rounded-full bg-white border-2 border-primary" style={{ borderColor: Config?.color }} />
      </View>
      <View className="flex-1 bg-white/40 border border-white/20 rounded-2xl p-4">
        <View className="flex-row items-center">
          {Config && <Config.icon size={16} color={Config.color} />}
          <Text className="ml-2 font-bold text-neutral-900">{type}</Text>
        </View>
        <Text className="text-neutral-500 text-sm mt-1">{detail}</Text>
      </View>
    </View>
  );
};