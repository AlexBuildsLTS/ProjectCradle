import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { AlertTriangle, Baby } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Protocol Error', headerShown: false }} />
      
      <View className="items-center bg-white/40 p-12 rounded-[50px] border border-white">
        <View className="bg-rose-50 w-20 h-20 rounded-3xl items-center justify-center mb-6">
          <Baby size={40} color="#f43f5e" />
        </View>
        
        <Text className="text-slate-800 text-3xl font-black text-center tracking-tighter">
          Rhythm Lost
        </Text>
        <Text className="text-slate-500 text-center mt-2 font-medium leading-5">
          This biometric sector does not exist{'\n'}or has been purged.
        </Text>

        <Link href="/" asChild>
          <TouchableOpacity className="bg-mint-400 px-8 py-4 rounded-full mt-10 shadow-lg shadow-mint-100">
            <Text className="text-white font-black">Return to Command</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    padding: 24,
  },
});