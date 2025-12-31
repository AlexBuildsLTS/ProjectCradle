/**
 * PROJECT CRADLE: GROWTH BIOMETRICS HUB V2.8
 * Path: app/(app)/growth.tsx
 * ----------------------------------------------------------------------------
 * FEATURES:
 * 1. UNIT AWARENESS: Automatic labeling for KG/G/LB based on global profile.
 * 2. MATH HANDSHAKE: Automatic conversion from G/LB to KG for database storage.
 * 3. SVG ANALYTICS: High-fidelity line chart with dynamic scaling.
 * 4. UX: Obsidian Glassmorphism with staggered spring entrance staging.
 */

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  History,
  Ruler,
  Scale,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

import { GlassCard } from '@/components/glass/GlassCard';
import { useAuth } from '@/context/auth';
import { useFamily } from '@/context/family';
import { Theme } from '@/lib/shared/Theme';
import { supabase } from '@/lib/supabase';

export default function GrowthScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const { babies = [], selectedBaby, selectBaby } = useFamily() as any;
  const { user, profile } = useAuth();

  // GLOBAL PREFERENCES
  const weightUnit = (profile as any)?.weight_unit || 'kg';
  const heightUnit = (profile as any)?.height_unit || 'cm';

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [growthLogs, setGrowthLogs] = useState<any[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchLogs();
    Animated.spring(fadeAnim, {
      toValue: 1,
      tension: 40,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [selectedBaby]);

  const triggerFeedback = (style = Haptics.ImpactFeedbackStyle.Medium) => {
    if (process.env.EXPO_PUBLIC_PLATFORM !== 'web') Haptics.impactAsync(style);
  };

  /**
   * DATA FETCH: Retrieves numerical ledger
   */
  const fetchLogs = async () => {
    if (!selectedBaby?.id) return;
    try {
      const { data, error } = await supabase
        .from('growth_logs')
        .select('*')
        .eq('baby_id', selectedBaby.id)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setGrowthLogs(data || []);
    } catch (e: any) {
      console.error('[Growth] Sync Error:', e.message);
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * CONVERSION LOGIC: Input -> Database (KG/CM)
   */
  const convertToStore = (val: string, unit: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return null;
    if (unit === 'g') return num / 1000;
    if (unit === 'lb') return num * 0.453592;
    if (unit === 'in') return num * 2.54;
    return num;
  };

  /**
   * DISPLAY LOGIC: Database -> View
   */
  const formatDisplayValue = (val: number, unit: string) => {
    if (!val) return '--';
    if (unit === 'g') return (val * 1000).toFixed(0);
    if (unit === 'lb') return (val / 0.453592).toFixed(2);
    if (unit === 'in') return (val / 2.54).toFixed(1);
    return val.toFixed(2);
  };

  const handleSync = async () => {
    if (!selectedBaby?.id)
      return Alert.alert('CORE ERROR', 'No active subject detected.');
    if (!weightInput && !heightInput)
      return Alert.alert('REQUIRED', 'Enter baby values.');

    setLoading(true);
    triggerFeedback(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      const dbWeight = convertToStore(weightInput, weightUnit);
      const dbHeight = convertToStore(heightInput, heightUnit);

      const { error } = await supabase.from('growth_logs').insert([
        {
          baby_id: selectedBaby.id,
          user_id: user?.id,
          weight_kg: dbWeight,
          height_cm: dbHeight,
        },
      ]);

      if (error) throw error;

      setWeightInput('');
      setHeightInput('');
      await fetchLogs();
      if (process.env.EXPO_PUBLIC_PLATFORM !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (e: any) {
      Alert.alert('SYNC FAILED', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Animated.View
          style={[
            styles.mainWrapper,
            isDesktop && styles.desktopWidth,
            { opacity: fadeAnim },
          ]}
        >
          {/* HEADER HUB */}
          <View style={styles.header}>
            <View style={styles.headerTitleGroup}>
              <Text style={styles.title}>GROWTH CORE</Text>
              <TouchableOpacity
                style={[
                  styles.switcherTrigger,
                  showSwitcher && styles.switcherTriggerActive,
                ]}
                onPress={() => {
                  triggerFeedback();
                  setShowSwitcher(!showSwitcher);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.subtitle}>
                  SUBJECT: {selectedBaby?.name?.toUpperCase() || 'SELECT CORE'}
                </Text>
                <ChevronDown
                  size={14}
                  color={Theme.colors.primary}
                  style={{
                    transform: [{ rotate: showSwitcher ? '180deg' : '0deg' }],
                  }}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.settingsBadge}
              onPress={() => router.push('/(app)/settings/family')}
            >
              <Users size={12} color={Theme.colors.primary} />
              <Text style={styles.statusText}>MANAGE CORES</Text>
            </TouchableOpacity>
          </View>

          {/* DROPDOWN SWITCHER PANEL */}
          {showSwitcher && (
            <GlassCard style={styles.switcherPanel}>
              <Text style={styles.panelLabel}>
                SELECT ACTIVE BABY
              </Text>
              {babies.map((baby: any) => (
                <TouchableOpacity
                  key={baby.id}
                  style={[
                    styles.switcherItem,
                    selectedBaby?.id === baby.id && styles.switcherItemActive,
                  ]}
                  onPress={() => {
                    triggerFeedback(Haptics.ImpactFeedbackStyle.Light);
                    selectBaby(baby.id);
                    setShowSwitcher(false);
                  }}
                >
                  <View style={styles.itemLeft}>
                    <Activity
                      size={14}
                      color={
                        selectedBaby?.id === baby.id
                          ? Theme.colors.primary
                          : '#475569'
                      }
                    />
                    <Text
                      style={[
                        styles.switcherText,
                        selectedBaby?.id === baby.id && { color: '#FFF' },
                      ]}
                    >
                      {baby.name.toUpperCase()}
                    </Text>
                  </View>
                  {selectedBaby?.id === baby.id && (
                    <CheckCircle2 size={14} color={Theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </GlassCard>
          )}

          {/* ANALYTICS CHART */}
          <GlassCard style={styles.chartCard}>
            <View style={styles.analyticsHeader}>
              <TrendingUp size={18} color={Theme.colors.primary} />
              <Text style={styles.analyticsTitle}>
                BABY PROGRESSION ({weightUnit.toUpperCase()})
              </Text>
            </View>

            <View style={styles.svgContainer}>
              {growthLogs.length > 1 ? (
                <GrowthLineChart
                  data={growthLogs}
                  width={isDesktop ? 750 : width - 80}
                  height={180}
                />
              ) : (
                <View style={styles.chartPlaceholder}>
                  <Activity size={32} color="rgba(255,255,255,0.05)" />
                  <Text style={styles.placeholderText}>
                    ADD MORE SYNC POINTS TO GENERATE TRENDS
                  </Text>
                </View>
              )}
            </View>
          </GlassCard>

          {/* INPUT HUB: DYNAMIC LABELING */}
          <Text style={styles.sectionLabel}>INITIALIZE NEW BIOMETRICS</Text>
          <GlassCard style={styles.inputCard}>
            <View style={styles.inputStack}>
              <BiometricField
                label={`WEIGHT (${weightUnit.toUpperCase()})`}
                icon={Scale}
                value={weightInput}
                onChange={setWeightInput}
                placeholder="0.00"
              />
              <BiometricField
                label={`HEIGHT (${heightUnit.toUpperCase()})`}
                icon={Ruler}
                value={heightInput}
                onChange={setHeightInput}
                placeholder="0.0"
              />
            </View>
            <TouchableOpacity
              style={[styles.saveBtn, loading && { opacity: 0.5 }]}
              onPress={handleSync}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#020617" />
              ) : (
                <Text style={styles.saveText}>COMMIT BIOMETRICS</Text>
              )}
            </TouchableOpacity>
          </GlassCard>

          {/* HISTORY LEDGER: DYNAMIC FORMATTING */}
          <View style={styles.ledger}>
            <View style={styles.ledgerHeader}>
              <History size={16} color="#475569" />
              <Text style={styles.ledgerTitle}>CHRONOLOGICAL HISTORY</Text>
            </View>
            {[...growthLogs].reverse().map((log: any) => (
              <GlassCard key={log.id} style={styles.logCard}>
                <View style={styles.proRow}>
                  <View style={styles.iconCircle}>
                    <ShieldCheck size={18} color={Theme.colors.primary} />
                  </View>
                  <View style={styles.dataStack}>
                    <Text style={styles.logDate}>
                      {new Date(log.timestamp).toLocaleDateString()}
                    </Text>
                    <Text style={styles.logValues}>
                      {formatDisplayValue(log.weight_kg, weightUnit)}
                      {weightUnit} •{' '}
                      {formatDisplayValue(log.height_cm, heightUnit)}
                      {heightUnit}
                    </Text>
                  </View>
                  <ChevronRight size={14} color="#1E293B" />
                </View>
              </GlassCard>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- SUB-COMPONENT: HIGH-FIDELITY CHART ---
const GrowthLineChart = ({
  data,
  width,
  height,
}: {
  data: any[];
  width: number;
  height: number;
}) => {
  const weights = data.map((d: any) => parseFloat(d.weight_kg) || 0);
  const max = Math.max(...weights);
  const min = Math.min(...weights);
  const range = max - min || 1;
  const padding = 20;

  const points = data.map((d: any, i: number) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y =
      height -
      ((parseFloat(d.weight_kg) - min) / range) * (height - padding * 2) -
      padding;
    return `${x},${y}`;
  });

  const d = `M ${points.join(' L ')}`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={Theme.colors.primary} stopOpacity="0.2" />
          <Stop offset="1" stopColor={Theme.colors.primary} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path
        d={`${d} L ${width - padding},${height} L ${padding},${height} Z`}
        fill="url(#chartGrad)"
      />
      <Path
        d={d}
        fill="none"
        stroke={Theme.colors.primary}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p: string, i: number) => {
        const [x, y] = p.split(',');
        return (
          <Circle key={i} cx={x} cy={y} r="4" fill={Theme.colors.primary} />
        );
      })}
    </Svg>
  );
};

const BiometricField = ({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
}: any) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.wrapper}>
      <Icon size={18} color="#4FD1C7" />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholder={placeholder}
        placeholderTextColor="#475569"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#020617', alignItems: 'center' },
  scroll: { width: '100%', alignItems: 'center', paddingBottom: 120 },
  mainWrapper: { width: '100%', padding: 24 },
  desktopWidth: { maxWidth: 800 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingTop: 20,
  },
  headerTitleGroup: { flex: 1 },
  title: { color: '#FFF', fontSize: 26, fontWeight: '900', letterSpacing: 1 },
  switcherTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  switcherTriggerActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
  },
  subtitle: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  settingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  statusText: {
    color: Theme.colors.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  switcherPanel: {
    padding: 16,
    borderRadius: 24,
    marginBottom: 32,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.2)',
  },
  panelLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
    marginLeft: 4,
  },
  switcherItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  switcherItemActive: { backgroundColor: 'rgba(79, 209, 199, 0.05)' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  switcherText: { color: '#94A3B8', fontSize: 13, fontWeight: '800' },
  chartCard: {
    padding: 24,
    borderRadius: 36,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.15)',
  },
  analyticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  analyticsTitle: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  svgContainer: {
    height: 180,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholder: { alignItems: 'center', gap: 12 },
  placeholderText: {
    color: '#1E293B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sectionLabel: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 4,
  },
  inputCard: { padding: 32, borderRadius: 36 },
  inputStack: { gap: 20, marginBottom: 32 },
  fieldGroup: { width: '100%' },
  label: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 1,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 20,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 16,
  },
  saveBtn: {
    backgroundColor: Theme.colors.primary,
    padding: 24,
    borderRadius: 22,
    alignItems: 'center',
  },
  saveText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  ledger: { marginTop: 44 },
  ledgerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    marginLeft: 4,
  },
  ledgerTitle: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },
  logCard: {
    padding: 0,
    height: 85,
    borderRadius: 28,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  proRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(79, 209, 199, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 209, 199, 0.1)',
  },
  dataStack: { flex: 1, marginLeft: 18 },
  logDate: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  logValues: { color: '#FFF', fontSize: 16, fontWeight: '800', marginTop: 4 },
});
