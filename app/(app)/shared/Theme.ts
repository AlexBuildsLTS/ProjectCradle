import { Platform } from 'react-native';

export const Theme = {
  colors: {
    primary: '#4FD1C7',     // Soft Teal
    secondary: '#B794F6',   // Muted Lavender
    success: '#9AE6B4',     // Warm Sage
    background: '#020617',  // Obsidian Deep
    surface: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.08)',
    text: '#F7FAFC',        // AAA Contrast
    textMuted: '#CBD5E0',   // AAA Contrast
    // Role-Specific Identity Matrix
    roles: {
      ADMIN: { main: '#F87171', glass: 'rgba(248, 113, 113, 0.15)' },
      SUPPORT: { main: '#FB923C', glass: 'rgba(251, 146, 60, 0.15)' },
      PREMIUM_MEMBER: { main: '#C084FC', glass: 'rgba(192, 132, 252, 0.15)' },
      MEMBER: { main: '#4FD1C7', glass: 'rgba(79, 209, 199, 0.15)' },
    }
  },
  glass: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    blur: Platform.OS === 'ios' ? 25 : 0
  }
};