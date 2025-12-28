/**
 * PROJECT CRADLE: MASTER SIGN-UP ENGINE V5.1 - AAA+ QUALITY
 * Path: app/(auth)/sign-up.tsx
 */

import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CheckSquare,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
} from 'react-native-reanimated';

import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { supabase } from '@/lib/supabase';

const { width: screenWidth } = Dimensions.get('window');

export default function SignUp() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(30);
  const scaleAnim = useSharedValue(0.95);
  const successScale = useSharedValue(0);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isFormValid =
    email &&
    firstName &&
    password &&
    confirmPassword &&
    agreed &&
    passwordsMatch;

  React.useEffect(() => {
    fadeAnim.value = withSpring(1, { damping: 15, stiffness: 100 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }, { scale: scaleAnim.value }],
  }));

  const handleSignUp = async () => {
    if (!agreed)
      return Alert.alert(
        'Consent Required',
        'Please acknowledge the security protocols.',
      );
    if (!passwordsMatch)
      return Alert.alert('Security Alert', 'Passwords do not match.');

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { full_name: firstName.trim(), is_onboarded: false } },
      });

      if (error) throw error;

      if (data.user) {
        setIsSuccess(true);
        successScale.value = withSpring(1);
        // Animated redirect after success view
        setTimeout(() => {
          router.replace('/(auth)/sign-in');
        }, 2200);
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.background}>
        <Animated.View style={[styles.container, containerStyle]}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.glassCard}>
              {isSuccess ? (
                /* SUCCESS ANIMATION VIEW */
                <Animated.View
                  entering={ZoomIn}
                  style={styles.successContainer}
                >
                  <CheckCircle2 size={80} color="#4FD1C7" />
                  <Text style={styles.successTitle}>SUCCESSFUL</Text>
                  <Text style={styles.successSubtitle}>
                    ACCOUNT created. Redirecting to Portal...
                  </Text>
                  <ActivityIndicator
                    color="#4FD1C7"
                    style={{ marginTop: 20 }}
                  />
                </Animated.View>
              ) : (
                /* FORM VIEW */
                <Animated.View exiting={FadeOut}>
                  <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.replace('/(auth)/sign-in')}
                    activeOpacity={0.7}
                  >
                    <View style={styles.backIconContainer}>
                      <ArrowLeft size={18} color="#4FD1C7" />
                    </View>
                    <Text style={styles.backText}>RETURN TO PORTAL</Text>
                  </TouchableOpacity>

                  <View style={styles.headerSection}>
                    <View style={styles.titleContainer}>
                      <Sparkles size={24} color="#4FD1C7" />
                      <Text style={styles.title}>Initialize Core</Text>
                    </View>
                    <Text style={styles.subtitle}>
                      Establish a secure link for family biometric
                      synchronization.
                    </Text>
                  </View>

                  <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                      <View style={styles.inputIcon}>
                        <User size={18} color="#4FD1C7" />
                      </View>
                      <TextInput
                        placeholder="Full Name"
                        placeholderTextColor="rgba(148, 163, 184, 0.7)"
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        editable={!loading}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <View style={styles.inputIcon}>
                        <Mail size={18} color="#4FD1C7" />
                      </View>
                      <TextInput
                        placeholder="Email Address"
                        placeholderTextColor="rgba(148, 163, 184, 0.7)"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        editable={!loading}
                      />
                    </View>

                    {/* PASSWORD BAR - Eye Icon fixed inside bar for Mobile */}
                    <View style={styles.inputGroup}>
                      <View style={styles.inputIcon}>
                        <Lock size={18} color="#4FD1C7" />
                      </View>
                      <TextInput
                        placeholder="Master Password"
                        secureTextEntry={!showPassword}
                        placeholderTextColor="rgba(148, 163, 184, 0.7)"
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        editable={!loading}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeButton}
                        activeOpacity={0.7}
                      >
                        {showPassword ? (
                          <EyeOff size={18} color="#4FD1C7" />
                        ) : (
                          <Eye size={18} color="rgba(148, 163, 184, 0.7)" />
                        )}
                      </TouchableOpacity>
                    </View>

                    {password.length > 0 && (
                      <PasswordStrengthIndicator password={password} />
                    )}

                    <View
                      style={[
                        styles.inputGroup,
                        !passwordsMatch &&
                          password.length > 0 &&
                          styles.inputError,
                      ]}
                    >
                      <View style={styles.inputIcon}>
                        <ShieldCheck
                          size={18}
                          color={passwordsMatch ? '#4FD1C7' : '#94A3B8'}
                        />
                      </View>
                      <TextInput
                        placeholder="Verify Password"
                        secureTextEntry={!showPassword}
                        placeholderTextColor="rgba(148, 163, 184, 0.7)"
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        editable={!loading}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => setAgreed(!agreed)}
                    style={styles.consentRow}
                    disabled={loading}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.checkboxContainer,
                        {
                          backgroundColor: agreed
                            ? '#4FD1C7'
                            : 'rgba(255, 255, 255, 0.1)',
                        },
                      ]}
                    >
                      {agreed && <CheckSquare size={16} color="#020617" />}
                    </View>
                    <Text style={styles.consentText}>
                      I acknowledge the{' '}
                      <Text style={styles.tealText}>
                        Security Protocols & Terms
                      </Text>
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSignUp}
                    disabled={loading || !isFormValid}
                    style={[
                      styles.submitBtn,
                      {
                        backgroundColor: isFormValid
                          ? '#4FD1C7'
                          : 'rgba(255, 255, 255, 0.1)',
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    {loading ? (
                      <ActivityIndicator color="#020617" />
                    ) : (
                      <View style={styles.btnContent}>
                        <Text
                          style={[
                            styles.submitText,
                            {
                              color: isFormValid
                                ? '#020617'
                                : 'rgba(148, 163, 184, 0.5)',
                            },
                          ]}
                        >
                          ACTIVATE CORE
                        </Text>
                        <ArrowRight
                          size={20}
                          color={
                            isFormValid ? '#020617' : 'rgba(148, 163, 184, 0.5)'
                          }
                          style={{ marginLeft: 12 }}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              )}
              <View style={{ height: 40 }} />
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  background: { flex: 1, backgroundColor: '#020617' },
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  glassCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  successContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  successTitle: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 24,
    letterSpacing: 2,
  },
  successSubtitle: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 12,
  },
  backIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(79, 209, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#4FD1C7',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  headerSection: { paddingHorizontal: 24, paddingBottom: 32 },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  title: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  formSection: { paddingHorizontal: 24, gap: 20 },
  inputGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  inputError: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
    backgroundColor: 'rgba(239, 68, 68, 0.02)',
  },
  inputIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  input: { color: '#FFF', flex: 1, fontWeight: '500', fontSize: 16 },
  eyeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 12,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consentText: { color: '#94A3B8', fontSize: 14, fontWeight: '500', flex: 1 },
  tealText: { color: '#4FD1C7', fontWeight: '700' },
  submitBtn: {
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
  },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  submitText: { fontWeight: '700', letterSpacing: 1.2, fontSize: 15 },
});
