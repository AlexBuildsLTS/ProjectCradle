import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  Alert, ActivityIndicator, KeyboardAvoidingView, 
  Platform, useWindowDimensions, Image, StyleSheet 
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, 
  Baby, Moon, Sparkles, Heart, Zap, Twitter, Linkedin,
  CheckCircle2, Fingerprint, LineChart, MessageSquare,
  Users
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '../../src/store/auth/useAuthStore';

// --- ENHANCED UI COMPONENTS (NURTURING UPGRADE) ---

const SectionHeader = ({ title }: { title: string }) => (
  <View className='mt-8 mb-6'>
    <Text className='mb-2 text-3xl font-black text-slate-800 tracking-tighter'>{title}</Text>
    <View className='h-1.5 w-20 bg-mint-400 rounded-full' />
  </View>
);

const FeatureItem = ({ icon: Icon, title, desc, className }: any) => (
  <View className={`bg-white/60 p-6 rounded-[35px] border border-white mb-5 shadow-sm ${className}`}>
    <View className='flex-row items-center mb-3'>
      <View className='bg-sky-100 w-12 h-12 rounded-2xl items-center justify-center mr-4'>
        <Icon size={24} color='#0284c7' />
      </View>
      <Text className='flex-1 text-xl font-black text-slate-700 tracking-tight'>{title}</Text>
    </View>
    <Text className='text-slate-500 text-sm leading-6 font-medium'>{desc}</Text>
  </View>
);

const TierCard = ({ title, subtitle, features, recommended, className }: any) => (
  <View className={`p-8 rounded-[45px] border mb-8 ${recommended ? 'bg-white border-mint-200 shadow-2xl shadow-mint-100' : 'bg-white/40 border-white/60'} ${className}`}>
    {recommended && (
      <View className='bg-mint-400 px-4 py-1.5 rounded-full self-start mb-4 shadow-md shadow-mint-200 flex-row items-center'>
        <Sparkles size={12} color="white" className="mr-2" />
        <Text className='text-white text-[10px] font-black uppercase tracking-widest'>Most Trusted</Text>
      </View>
    )}
    <Text className='text-3xl font-black text-slate-800 mb-1'>{title}</Text>
    <Text className='text-slate-400 font-bold mb-6 text-xs uppercase tracking-widest'>{subtitle}</Text>
    <View className='h-[1px] bg-slate-100 w-full mb-6' />
    {features.map((item: {label: string, icon: any}, i: number) => (
      <View key={i} className='flex-row items-start mb-4'>
        <View className="bg-mint-50 p-1.5 rounded-full mr-3 border border-mint-100">
           <item.icon size={14} color='#10B981' strokeWidth={3} />
        </View>
        <Text className='text-slate-600 text-sm font-bold flex-1'>{item.label}</Text>
      </View>
    ))}
  </View>
);

const FooterColumn = ({ title, links }: any) => (
  <View className='mb-10 min-w-[160px]'>
    <Text className='mb-5 text-sm font-black text-slate-800 uppercase tracking-widest'>{title}</Text>
    {links.map((link: string, i: number) => (
      <TouchableOpacity key={i} className='mb-3'>
        <Text className='text-slate-500 text-sm font-medium hover:text-mint-500'>{link}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

// --- MASTER MARKETING CONTENT (PEDAGOGICAL ENGINE) ---

const MarketingContent = React.memo(({ isDesktop }: { isDesktop: boolean }) => (
  <View className='w-full'>
      <Animated.View entering={FadeInUp.delay(200).duration(800)} className='mb-20'>
          <View className='w-16 h-16 bg-mint-400 rounded-[24px] items-center justify-center mb-6 shadow-2xl shadow-mint-300'>
            <Baby color="white" size={32} strokeWidth={2.5} />
          </View>
          <Text className='mb-4 text-5xl font-black text-slate-800 tracking-tighter leading-tight'>About Project Cradle</Text>
          <Text className='text-slate-500 text-xl leading-8 max-w-2xl font-medium'>
            Project Cradle is a high-integrity pediatric surveillance ecosystem designed to stabilize your baby's rhythm through biometric intelligence.
          </Text>
      </Animated.View>

      <View className='mb-20'>
          <SectionHeader title='Surveillance Capabilities' />
          <View className={`flex-row flex-wrap ${isDesktop ? '-mx-2' : ''}`}>
              <FeatureItem className={isDesktop ? 'w-1/2 px-2' : 'w-full'} icon={Zap} title='SweetSpot®' desc='Predictive awake window forecasting with 98% accuracy.' />
              <FeatureItem className={isDesktop ? 'w-1/2 px-2' : 'w-full'} icon={LineChart} title='Rhythm Analytics' desc='Real-time sleep pressure and homeostatic drive tracking.' />
              <FeatureItem className={isDesktop ? 'w-1/2 px-2' : 'w-full'} icon={Fingerprint} title='Idempotent Ledger' iconColor="#0ea5e9" desc='Fiscal-grade event logging for medical consultations.' />
              <FeatureItem className={isDesktop ? 'w-1/2 px-2' : 'w-full'} icon={MessageSquare} title='Berry AI' desc='Instant expert-vetted parenting backup 24/7.' />
          </View>
      </View>

      <View className='mb-20'>
          <SectionHeader title='Membership Tiers' />
          <View className={`flex-row flex-wrap ${isDesktop ? '-mx-3' : ''}`}>
              <TierCard 
                className={isDesktop ? 'w-1/3 px-3' : 'w-full'} 
                title='Member' 
                subtitle='Standard' 
                features={[
                  {label: 'Daily Logging', icon: Heart}, 
                  {label: '24h History', icon: Moon}
                ]} 
              />
              <TierCard 
                className={isDesktop ? 'w-1/3 px-3' : 'w-full'} 
                title='Premium' 
                subtitle='Pro Parent' 
                recommended={true} 
                features={[
                  {label: 'Berry AI Access', icon: Sparkles}, 
                  {label: 'Predictive Windows', icon: Zap}
                ]} 
              />
              <TierCard 
                className={isDesktop ? 'w-1/3 px-3' : 'w-full'} 
                title='Care' 
                subtitle='Pro Team' 
                features={[
                  {label: 'Multi-caregiver', icon: Users}, 
                  {label: 'Pediatric Portal', icon: ShieldCheck}
                ]} 
              />
          </View>
      </View>

      <View className='border-t border-slate-200 pt-12 pb-8'>
          <View className='flex-row flex-wrap justify-between w-full'>
              <FooterColumn title='Platform' links={['Command Center', 'Berry AI', 'Courses', 'Sleep Sounds']} />
              <FooterColumn title='Support' links={['Contact Team', 'Knowledge Base', 'System Status']} />
              <FooterColumn title='Legal' links={['Privacy', 'Biometric Terms', 'Security']} />
          </View>
          <View className='h-[1px] bg-slate-200 w-full my-8' />
          <View className='flex-row items-center justify-between'>
              <Text className='text-slate-400 text-[10px] font-bold uppercase tracking-widest'>© 2025 PROJECT CRADLE BY ZENITHCORE.</Text>
              <View className='flex-row gap-4'>
                  <Twitter size={18} color='#94a3b8' />
                  <Linkedin size={18} color='#94a3b8' />
              </View>
          </View>
      </View>
  </View>
));

export default function LoginScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className='flex-1 bg-[#F0F9FF]'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          {isDesktop ? (
            <View className='flex-row flex-1'>
                {/* LOGIN FORM COLUMN */}
                <View className='w-[40%] h-full justify-center items-center px-12 border-r border-white bg-[#F0F9FF] z-10'>
                    <View className='w-full max-w-md mx-auto'>
                      <Animated.View entering={FadeInDown.duration(600)} className='items-center mb-10'>
                        <View className='w-20 h-20 bg-white rounded-[30px] items-center justify-center mb-6 shadow-2xl shadow-sky-200 border border-white'>
                            <Baby size={40} color="#10B981" />
                        </View>
                        <Text className='text-4xl font-black tracking-tighter text-slate-800 text-center'>Welcome Home</Text>
                        <Text className='text-slate-400 text-center mt-2 text-lg font-bold'>Monitor your baby's rhythm</Text>
                      </Animated.View>

                      <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                        <BlurView intensity={60} tint="light" className='p-10 rounded-[50px] border border-white bg-white/40 shadow-2xl shadow-sky-100'>
                          <View className="mb-6">
                            <Text className='text-slate-400 text-[10px] font-black mb-2 ml-1 uppercase tracking-widest'>Email Address</Text>
                            <View className='bg-white border border-slate-100 rounded-2xl px-4 h-14 flex-row items-center'>
                                <Mail size={20} color='#94a3b8' />
                                <TextInput 
                                  className='flex-1 h-full ml-3 text-base text-slate-700 font-bold' 
                                  placeholder='parent@cradle.com' 
                                  placeholderTextColor='#cbd5e1' 
                                  value={email} 
                                  onChangeText={setEmail}
                                />
                            </View>
                          </View>

                          <View className="mb-8">
                            <Text className='text-slate-400 text-[10px] font-black mb-2 ml-1 uppercase tracking-widest'>Security Cipher</Text>
                            <View className='bg-white border border-slate-100 rounded-2xl px-4 h-14 flex-row items-center'>
                                <Lock size={20} color='#94a3b8' />
                                <TextInput 
                                  className='flex-1 h-full ml-3 text-base text-slate-700 font-bold' 
                                  placeholder='••••••••' 
                                  placeholderTextColor='#cbd5e1' 
                                  secureTextEntry={!showPassword}
                                  value={password} 
                                  onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <EyeOff size={20} color='#94a3b8' /> : <Eye size={20} color='#94a3b8' />}
                                </TouchableOpacity>
                            </View>
                          </View>

                          <TouchableOpacity className='bg-mint-400 h-16 rounded-full items-center justify-center flex-row shadow-xl shadow-mint-200'>
                            <Text className='text-white font-black text-xl mr-2'>Enter Command Center</Text>
                            <ArrowRight size={22} color='white' strokeWidth={3} />
                          </TouchableOpacity>

                          <View className='flex-row justify-center mt-6'>
                            <Text className='text-slate-400 font-bold'>New to Cradle? </Text>
                            <Link href='/(auth)/register' asChild>
                              <TouchableOpacity><Text className='text-sky-500 font-black'>Join Now</Text></TouchableOpacity>
                            </Link>
                          </View>
                        </BlurView>
                      </Animated.View>
                    </View>
                </View>

                {/* MARKETING COLUMN */}
                <ScrollView 
                    className='flex-1 bg-white/20' 
                    contentContainerStyle={{ padding: 100, minHeight: '100%' }}
                    showsVerticalScrollIndicator={false}
                >
                    <MarketingContent isDesktop={isDesktop} />
                </ScrollView>
            </View>
          ) : (
            /* MOBILE LAYOUT */
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
              <View className='items-center justify-center flex-1 px-8 py-12'>
                  <Animated.View entering={FadeInDown.duration(600)} className='items-center mb-10'>
                    <View className='w-20 h-20 bg-white rounded-[30px] items-center justify-center mb-6 shadow-2xl shadow-sky-200 border border-white'>
                        <Baby size={40} color="#10B981" />
                    </View>
                    <Text className='text-4xl font-black tracking-tighter text-slate-800 text-center'>Welcome Home</Text>
                  </Animated.View>

                  <BlurView intensity={60} tint="light" className='w-full p-8 rounded-[45px] border border-white bg-white/40 shadow-2xl shadow-sky-100'>
                      <TextInput 
                        className='bg-white border border-slate-100 rounded-2xl px-5 h-14 text-slate-700 font-bold mb-4'
                        placeholder='Email Address'
                        value={email}
                        onChangeText={setEmail}
                      />
                      <TextInput 
                        className='bg-white border border-slate-100 rounded-2xl px-5 h-14 text-slate-700 font-bold mb-6'
                        placeholder='Password'
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity className='bg-mint-400 h-14 rounded-full items-center justify-center shadow-lg shadow-mint-100'>
                        <Text className='text-white font-black text-lg'>Sign In</Text>
                      </TouchableOpacity>
                  </BlurView>
              </View>
              <View className='bg-white/40 px-8 py-16 border-t border-white'>
                <MarketingContent isDesktop={isDesktop} />
              </View>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}