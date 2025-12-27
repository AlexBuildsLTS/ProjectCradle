import "../global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/ThemeContext"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { View } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Set the Global Obsidian Background */}
        <View style={{ flex: 1, backgroundColor: '#020617' }}>
          <Stack screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: '#020617' } 
          }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </View>
      </AuthProvider>
    </QueryClientProvider>
  );
}