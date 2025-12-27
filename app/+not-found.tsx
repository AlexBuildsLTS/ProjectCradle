import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { GlassCard } from '@/components/glass/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle, ArrowLeft } from 'lucide-react-native';

/**
 * PROJECT CRADLE: CUSTOM 404 ENGINE
 * Features: Obsidian Glassmorphism, AAA Navigation Recovery
 */
export default function NotFoundScreen() {
  return (
    <LinearGradient colors={['#020617', '#0F172A']} className="flex-1">
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      
      <View className="items-center justify-center flex-1 p-6">
        <GlassCard className="items-center w-full max-w-md border-primary/20 bg-primary/5">
          <View className="p-6 mb-6 bg-primary/20 rounded-3xl">
            <AlertTriangle size={48} color="#4FD1C7" />
          </View>
          
          <Text className="mb-2 text-3xl font-black tracking-tighter text-center text-white">
            Path Lost
          </Text>
          <Text className="mb-10 font-medium leading-6 text-center text-neutral-400">
            The page you are looking for has been moved or doesn't exist in our biometric records.
          </Text>

          <Link href="/(app)" asChild>
            <View className="flex-row items-center justify-center w-full h-16 shadow-lg bg-primary rounded-2xl shadow-primary/20">
              <ArrowLeft size={20} color="#0F172A" />
              <Text className="ml-3 text-lg font-black text-neutral-900">Return to Today</Text>
            </View>
          </Link>
        </GlassCard>

        <Text className="mt-8 text-neutral-600 font-bold uppercase tracking-widest text-[10px]">
          System Error: 404 • Project Cradle
        </Text>
      </View>
    </LinearGradient>
  );
}