import { Theme } from "@/app/(app)/shared/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

/**
 * PROJECT CRADLE: CIRCADIAN THEME ENGINE
 * Features: Persistence, Melatonin-Safe Red Shift, AAA Obsidian Aesthetics
 */
interface ThemeContextType {
  isNightMode: boolean;
  toggleNightMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isNightMode: false,
  toggleNightMode: () => {},
});

const STORAGE_KEY = "PROJECT_CRADLE_NIGHT_MODE";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isNightMode, setIsNightMode] = useState(false);

  // 1. Persist user preference across sessions
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) setIsNightMode(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load theme preference", e);
      }
    };
    loadPreference();
  }, []);

  const toggleNightMode = async () => {
    const nextValue = !isNightMode;
    setIsNightMode(nextValue);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextValue));
    } catch (e) {
      console.error("Failed to save theme preference", e);
    }
  };

  return (
    <ThemeContext.Provider value={{ isNightMode, toggleNightMode }}>
      <View
        style={{
          flex: 1,
          backgroundColor: isNightMode ? "#0a0000" : Theme.colors.background,
        }}
      >
        {children}

        {/* Melatonin-Safe Overlay: Ultra-low blue light for night-shift parenting */}
        {isNightMode && (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: "rgba(255, 0, 0, 0.06)",
                zIndex: 99999,
                // Web specific optimization for backdrop filter if needed
                ...(Platform.OS === "web" &&
                  ({ mixBlendMode: "multiply" } as any)),
              },
            ]}
          />
        )}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
