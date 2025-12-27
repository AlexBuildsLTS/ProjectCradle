import React from 'react';
import { Stack } from "expo-router";
import { View, Text, useWindowDimensions, Platform, ScrollView, StyleSheet } from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";
import AuthMarketing from "./AuthMarketing"; 
import AuthFooter from './AuthFooter';

/**
 * PROJECT CRADLE: CORE AUTH ARCHITECTURE
 * Fixed: 60/40 Desktop Split | Vertical Stack Mobile | No White Squares
 */
export default function AuthLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  return (
    <View style={[styles.root, { backgroundColor: '#3333FF' }]}>
      <View style={{ flexDirection: isDesktop ? 'row' : 'column', flex: 1 }}>
        
        {/* LEFT PANE (60% Desktop): Marketing Content */}
        {isDesktop && (
          <View style={styles.desktopLeftPane}>
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={{ padding: 80 }}
            >
              <Animated.View entering={FadeInLeft.duration(1000)}>
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
                  <Text style={styles.mobileTitle}>Project Cradle</Text>
                </View>
              )}

              {/* STACK: Glass Box Form Container */}
              <View style={styles.stackWrapper}>
                <Stack screenOptions={{ 
                  headerShown: false, 
                  contentStyle: { backgroundColor: 'transparent' },
                  animation: 'fade'
                }} />
              </View>

              {/* MOBILE SEQUENTIAL: Marketing appears strictly BELOW the form as full-width blocks */}
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
<Stack screenOptions={{ 
  headerShown: false, 
  contentStyle: { backgroundColor: 'transparent' }, // KILLS THE WHITE SQUARE
  animation: 'fade'
}} />
const styles = StyleSheet.create({
  root: { flex: 1 },
  desktopLeftPane: { 
    flex: 1.5, 
    backgroundColor: '#020020', 
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
  stackWrapper: { 
    width: '100%',
    minHeight: Platform.OS === 'web' ? 700 : 600, 
    justifyContent: 'center'
  },
  mobileHeader: { alignItems: 'center', marginBottom: 40 },
  mobileTitle: { color: '#FFF', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    width: '100%',
    marginVertical: 40
  },
  mobileMarketingSpace: { width: '100%' },
  inlineFooter: { 
    marginTop: 60, 
    paddingTop: 32, 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255,255,255,0.05)', 
    alignItems: 'center'
  },
  footerText: { color: '#475569', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  footerVersion: { color: '#1E293B', fontSize: 10, fontWeight: '900', marginTop: 4 }
});