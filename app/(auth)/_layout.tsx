/**
 * PROJECT CRADLE: AUTH LAYOUT V4.0 - AAA+ QUALITY
 * Path: app/(auth)/_layout.tsx
 * FEATURES:
 * - Optimized spacing and form visibility
 * - Premium desktop/mobile responsive design
 * - Smooth animations and transitions
 * - Perfect glassmorphism integration
 * - Professional marketing section layout
 */

import { Stack } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInLeft, FadeInUp } from 'react-native-reanimated';
import AuthMarketing from './AuthMarketing';

export default function AuthLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  return (
    <View style={styles.root}>
      <View style={{ flexDirection: isDesktop ? 'row' : 'column', flex: 1 }}>
        {/* DESKTOP BRANDING */}
        {isDesktop && (
          <View style={styles.iconAnchor}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.desktopIcon}
              resizeMode="contain"
            />
          </View>
        )}

        {/* MARKETING PANE (60% DESKTOP) */}
        {isDesktop && (
          <View style={styles.desktopLeftPane}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.marketingScroll}
            >
              <Animated.View entering={FadeInLeft.duration(1000)}>
                <AuthMarketing isDesktop={true} />
              </Animated.View>
            </ScrollView>
          </View>
        )}

        {/* AUTH FORM PANE (40% DESKTOP) */}
        <View style={styles.authPane}>
          <ScrollView
            contentContainerStyle={styles.authScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.authConstraint}>
              {!isDesktop && (
                <View style={styles.mobileHeader}>
                  <Image
                    source={require('../../assets/images/icon.png')}
                    style={styles.mobileIcon}
                  />
                  <Text style={styles.mobileTitle}>Cradle</Text>
                </View>
              )}

              {/* OPTIMIZED STACK WRAPPER */}
              <View style={styles.stackWrapper}>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'transparent', flex: 1 },
                    animation: 'fade',
                    presentation: 'transparentModal',
                  }}
                />
              </View>

              {!isDesktop && (
                <View style={styles.mobileMarketingSpace}>
                  <View style={styles.divider} />
                  <Animated.View entering={FadeInUp.duration(1000)}>
                    <AuthMarketing isDesktop={false} />
                  </Animated.View>
                </View>
              )}

              <View style={styles.inlineFooter}>
                <Text style={styles.footerText}>
                  © 2025 PROJECT CRADLE. SECURE SESSION.
                </Text>
                <Text style={styles.footerVersion}>V4.0 AAA+ QUALITY</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#020617',
  },
  iconAnchor: { 
    position: 'absolute', 
    top: 40, 
    left: 40, 
    zIndex: 100 
  },
  desktopIcon: { 
    width: 52, 
    height: 52, 
    borderRadius: 14 
  },
  desktopLeftPane: {
    flex: 1.5,
    backgroundColor: '#020020',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.05)',
  },
  marketingScroll: { 
    padding: 80, 
    paddingTop: 120,
    paddingBottom: 80,
  },
  authPane: { 
    flex: 1, 
    backgroundColor: '#020617' 
  },
  authScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authConstraint: { 
    width: '100%', 
    maxWidth: 480,
    alignItems: 'center',
  },
  stackWrapper: {
    width: '100%',
    minHeight: 650, // Increased for better form visibility
    backgroundColor: 'transparent',
    borderRadius: 32,
    overflow: 'visible',
    marginBottom: 20,
  },
  mobileHeader: { 
    alignItems: 'center', 
    marginBottom: 32, 
    gap: 16 
  },
  mobileIcon: { 
    width: 60, 
    height: 60, 
    borderRadius: 16 
  },
  mobileTitle: { 
    color: '#FFF', 
    fontSize: 32, 
    fontWeight: '900' 
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    width: '100%',
    marginVertical: 32,
  },
  mobileMarketingSpace: { 
    width: '100%',
    marginBottom: 20,
  },
  inlineFooter: {
    marginTop: 40,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  footerText: { 
    color: '#475569', 
    fontSize: 10, 
    fontWeight: '800' 
  },
  footerVersion: {
    color: '#1E293B',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 4,
  },
});
