import React from 'react';
import { Stack } from "expo-router";
import { View, Text, useWindowDimensions, Platform, ScrollView, Image, StyleSheet } from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";
// CRITICAL: Ensure AuthMarketing has a 'export default' inside its own file.
import AuthMarketing from "./AuthMarketing"; 

/**
 * PROJECT CRADLE: CORE AUTH ARCHITECTURE
 * Fixes: Background Bleed, Marketing Overlap, Router Crash
 */
export default function AuthLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  return (
    // FORCING THE ROOT TO BE DEEP OBSIDIAN
    <View style={[styles.root, { backgroundColor: '#020617' }]}>
      <View style={{ flexDirection: isDesktop ? 'row' : 'column', flex: 1 }}>
        
        {/* LEFT PANE (60% Desktop): Marketing Content */}
        {isDesktop && (
          <View style={styles.desktopLeftPane}>
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={{ padding: 80 }}
            >
              <Animated.View entering={FadeInLeft.duration(1000)}>
                <Image 
                  source={require('@/assets/images/icon.png')} 
                  style={styles.brandIcon} 
                />
                <AuthMarketing isDesktop={true} />
              </Animated.View>
            </ScrollView>
          </View>
        )}

        {/* RIGHT PANE (40% Desktop / 100% Mobile): Auth Form */}
        <View style={styles.authPane}>
          <ScrollView 
            contentContainerStyle={styles.authScrollContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.authConstraint}>
              {!isDesktop && (
                <View style={styles.mobileHeader}>
                  <Image source={require('@/assets/images/icon.png')} style={styles.mobileIcon} />
                  <Text style={styles.mobileTitle}>Project Cradle</Text>
                </View>
              )}

              {/* STACK: contentStyle transparent ensures #020617 shows through */}
              <View style={styles.stackWrapper}>
                <Stack screenOptions={{ 
                  headerShown: false, 
                  contentStyle: { backgroundColor: 'transparent' },
                  animation: 'fade'
                }} />
              </View>

              {/* MOBILE SEQUENTIAL GRID: Appears strictly BELOW the form */}
              {!isDesktop && (
                <View style={styles.mobileMarketingSpace}>
                   <View style={styles.divider} />
                   <AuthMarketing isDesktop={false} />
                </View>
              )}

              <View style={styles.inlineFooter}>
                <Text style={styles.footerText}>© 2025 PROJECT CRADLE. SECURE SESSION.</Text>
                <Text style={styles.footerVersion}>V1.3.1 MASTER STACK</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  // 60/40 Ratio Weighting: 1.5 to 1
  desktopLeftPane: { 
    flex: 1.5, 
    backgroundColor: '#050505', 
    borderRightWidth: 1, 
    borderRightColor: 'rgba(255,255,255,0.05)' 
  },
  authPane: { flex: 1, backgroundColor: '#020617' },
  authScrollContent: { 
    flexGrow: 1, 
    paddingHorizontal: 24, 
    paddingVertical: 60, 
    alignItems: 'center' 
  },
  authConstraint: { width: '100%', maxWidth: 450 },
  brandIcon: { width: 64, height: 64, borderRadius: 18, marginBottom: 48 },
  // minHeight 750px: Forces form space so buttons are always visible
  stackWrapper: { 
    width: '100%',
    minHeight: Platform.OS === 'web' ? 750 : 680, 
    justifyContent: 'center'
  },
  mobileHeader: { alignItems: 'center', marginBottom: 56 },
  mobileIcon: { width: 80, height: 80, borderRadius: 24, marginBottom: 16 },
  mobileTitle: { color: '#FFF', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    width: '100%',
    marginBottom: 40
  },
  mobileMarketingSpace: { marginTop: 40, width: '100%' },
  inlineFooter: { 
    marginTop: 80, 
    paddingTop: 40, 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255,255,255,0.05)', 
    alignItems: 'center'
  },
  footerText: { color: '#475569', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  footerVersion: { color: '#1E293B', fontSize: 10, fontWeight: '900', marginTop: 4 }
});