import React, { useState, useMemo } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  Alert, ActivityIndicator, KeyboardAvoidingView, 
  Platform, useWindowDimensions, StyleSheet 
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, 
  Baby, Moon, Sparkles, Heart, Zap, Twitter, Linkedin, 
  CheckCircle2, Users, BookOpen, Clock, Activity, 
  BarChart3, FileText, ChevronRight, Crown, LifeBuoy
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

// --- ENHANCED UI PRIMITIVES (TAILORED & UPGRADED) ---

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <View className='mt-10 mb-8'>
    <Text className='text-3xl font-black text-slate-800 tracking-tighter'>{title}</Text>
    {subtitle && <Text className="text-slate-500 font-medium mt-1">{subtitle}</Text>}
    <View className='h-1.5 w-20 bg-mint-400 rounded-full mt-3' />
  </View>
);

const FeatureItem = ({ icon: Icon, title, desc, className }: any) => (
  <View className={`bg-white/60 p-6 rounded-[35px] border border-white mb-5 shadow-sm ${className}`}>
    <View className='flex-row items-center mb-3'>
      <View className='bg-sky-100 w-12 h-12 rounded-2xl items-center justify-center mr-4'>
        <Icon size={24} color='#0ea5e9' />
      </View>
      <Text className='flex-1 text-xl font-black text-slate-700 tracking-tight'>{title}</Text>
    </View>
    <Text className='text-slate-500 text-sm leading-6 font-medium'>{desc}</Text>
  </View>
);

const TierCard = ({ title, subtitle, features, recommended, className, price }: any) => (
  <View className={`p-8 rounded-[45px] border mb-8 ${recommended ? 'bg-white border-mint-200 shadow-2xl shadow-mint-100' : 'bg-white/40 border-white/60'} ${className}`}>
    {recommended && (
      <View className='bg-mint-400 px-4 py-1.5 rounded-full self-start mb-4 flex-row items-center'>
        <Crown size={12} color="white" className="mr-2" />
        <Text className='text-white text-[10px] font-black uppercase tracking-widest'>Most Trusted</Text>
      </View>
    )}
    <Text className='text-3xl font-black text-slate-800 mb-1'>{title}</Text>
    <Text className='text-slate-400 font-bold mb-2 uppercase text-[10px] tracking-widest'>{subtitle}</Text>
    <Text className='text-slate-800 text-4xl font-black mb-6'>{price}<Text className="text-lg text-slate-400 font-medium">/mo</Text></Text>
    
    <View className='h-[1px] bg-slate-100 w-full mb-6' />
    
    {features.map((item: {label: string, icon: any}, i: number) => (
      <View key={i} className='flex-row items-center mb-4'>
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
        <Text className='text-slate-500 text-sm font-medium hover:text-mint-500 transition-colors'>{link}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

// --- ENHANCED PASSWORD METER (MISSION READY) ---
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const score = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);

  const colors = ['#e2e8f0', '#FDA4AF', '#BAE6FD', '#34D399'];
  const labels = ['UNPROTECTED', 'VULNERABLE', 'SECURE', 'MISSION READY'];

  return (
    <View className="mt-3">
      <View className="flex-row gap-1.5 h-1.5 w-full">
        {[1, 2, 3].map((i) => (
          <View key={i} className="flex-1 rounded-full" style={{ backgroundColor: i <= score ? colors[score] : '#f1f5f9' }} />
        ))}
      </View>
      <View className="flex-row justify-between items-center mt-1.5">
        <Text className="text-[9px] font-black tracking-tighter" style={{ color: colors[score] }}>{labels[score]}</Text>
        <ShieldCheck size={10} color={colors[score]} />
      </View>
    </View>
  );
};

// --- MASTER MARKETING CONTENT (EXPANDED & TAILORED) ---

const MarketingContent = React.memo(({ isDesktop }: { isDesktop: boolean }) => (
  <View className='w-full'>
      <Animated.View entering={FadeInUp.delay(200).duration(800)} className='mb-20'>
          <View className='w-16 h-16 bg-mint-400 rounded-[24px] items-center justify-center mb-6 shadow-2xl shadow-mint-300'>
            <Baby color="white" size={32} strokeWidth={2.5} />
          </View>
          <Text className='mb-4 text-6xl font-black text-slate-800 tracking-tighter leading-[1.1]'>
            Magically predicts{'\n'}your baby's next nap
          </Text>
          <Text className='text-slate-500 text-xl leading-8 max-w-2xl font-medium'>
            Find your child's natural rhythm. We utilize Awake Windows and Sleep Pressure algorithms to create a schedule so perfect, naptime becomes a breeze.
          </Text>
      </Animated.View>

      <View className='mb-20'>
          <SectionHeader title='High-Integrity Surveillance' subtitle="Biometric tracking tailored for parents" />
          <View className={`flex-row flex-wrap ${isDesktop ? '-mx-3' : ''}`}>
              <FeatureItem className={isDesktop ? 'w-[48%] mx-2' : 'w-full'} icon={Clock} title='Awake Windows' desc='Dynamic adjustments based on homeostatic sleep drive.' />
              <FeatureItem className={isDesktop ? 'w-[48%] mx-2' : 'w-full'} icon={Sparkles} title='Berry AI' desc='Instant expert-vetted backup for every parenting milestone.' />
              <FeatureItem className={isDesktop ? 'w-[48%] mx-2' : 'w-full'} icon={Activity} title='Live Statistics' desc='Spot irregularities and correlations in health patterns.' />
              <FeatureItem className={isDesktop ? 'w-[48%] mx-2' : 'w-full'} icon={ShieldCheck} title='Attachment First' desc='Science-based courses written by top pediatric sleep experts.' />
          </View>
      </View>

      <View className='mb-20'>
          <SectionHeader title='Membership Tiers' />
          <View className={`flex-row flex-wrap ${isDesktop ? '-mx-4' : ''}`}>
              <TierCard 
                className={isDesktop ? 'w-[31%] mx-2' : 'w-full'} 
                title='Member' 
                subtitle='Base Access' 
                price="$0"
                features={[
                  {label: 'Daily Logging', icon: FileText},
                  {label: 'Sleep Tracking', icon: Moon},
                  {label: '24h History', icon: Clock}
                ]} 
              />
              <TierCard 
                className={isDesktop ? 'w-[31%] mx-2' : 'w-full'} 
                title='Premium' 
                subtitle='Advanced Rhythm' 
                recommended={true} 
                price="$9.99"
                features={[
                  {label: 'Unlimited Berry AI', icon: Sparkles},
                  {label: 'Advanced Statistics', icon: BarChart3},
                  {label: 'Sleep Courses', icon: BookOpen},
                  {label: 'SweetSpot® Engine', icon: Zap}
                ]} 
              />
              <TierCard 
                className={isDesktop ? 'w-[31%] mx-2' : 'w-full'} 
                title='Care' 
                subtitle='Pro Caregiver' 
                price="$19.99"
                features={[
                  {label: 'Multi-caregiver Sync', icon: Users},
                  {label: 'Pediatrician Portal', icon: ShieldCheck},
                  {label: 'Priority Support', icon: LifeBuoy}
                ]} 
              />
          </View>
      </View>

      <View className='border-t border-slate-200 pt-16 pb-12'>
          <View className='flex-row flex-wrap justify-between w-full'>
              <FooterColumn title='Platform' links={['Command Center', 'Berry AI', 'Courses', 'Sleep Sounds']} />
              <FooterColumn title='Community' links={['Attachment Parenting', 'Sleep Experts', 'Success Stories']} />
              <FooterColumn title='Trust' links={['Privacy Policy', 'Data Integrity', 'Biometric Security']} />
          </View>
          <View className='h-[1px] bg-slate-200 w-full my-10' />
          <View className='flex-row items-center justify-between'>
              <Text className='text-slate-400 text-xs font-bold'>© 2025 PROJECT CRADLE BY ZENITHCORE. HIGH-INTEGRITY NURTURING.</Text>
              <View className='flex-row gap-6'>
                  <Twitter size={20} color='#94a3b8' />
                  <Linkedin size={20} color='#94a3b8' />
              </View>
          </View>
      </View>
  </View>
));

// --- MAIN REGISTRATION SCREEN ---

export default function RegisterScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', agreed: false });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <View className='flex-1 bg-[#F0F9FF]'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View className={`flex-1 ${isDesktop ? 'flex-row' : 'flex-col'}`}>
              
              {/* INTERACTIVE FORM COLUMN */}
              <View className={`${isDesktop ? 'w-[40%] border-r border-white' : 'w-full'} justify-center items-center px-10 py-12`}>
                  <View className='w-full max-w-md'>
                    <Animated.View entering={FadeInDown.duration(800)} className='items-center mb-12'>
                      <View className="w-20 h-20 bg-white rounded-[30px] items-center justify-center shadow-2xl shadow-sky-200 border border-white">
                        <Baby size={40} color="#10B981" strokeWidth={2} />
                      </View>
                      <Text className='text-4xl font-black tracking-tighter text-slate-800 text-center mt-6'>Initialize Account</Text>
                      <Text className='text-slate-400 text-center mt-2 text-lg font-bold'>Secure your family's future</Text>
                    </Animated.View>

                    <BlurView intensity={60} tint="light" className='p-10 rounded-[50px] border border-white bg-white/40 shadow-2xl shadow-sky-100'>
                        <View className="flex-row gap-4 mb-5">
                          <View className="flex-1">
                            <Text className='text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest'>First Name</Text>
                            <TextInput 
                              className='bg-white border border-slate-100 rounded-2xl px-5 h-14 text-slate-700 font-bold'
                              placeholder='Jane'
                              onChangeText={t => setForm({...form, firstName: t})}
                            />
                          </View>
                          <View className="flex-1">
                            <Text className='text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest'>Last Name</Text>
                            <TextInput 
                              className='bg-white border border-slate-100 rounded-2xl px-5 h-14 text-slate-700 font-bold'
                              placeholder='Doe'
                              onChangeText={t => setForm({...form, lastName: t})}
                            />
                          </View>
                        </View>

                        <View className="mb-5">
                          <Text className='text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest'>Parental Email</Text>
                          <TextInput 
                            className='bg-white border border-slate-100 rounded-2xl px-5 h-14 text-slate-700 font-bold'
                            placeholder='jane@cradle.com'
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={t => setForm({...form, email: t})}
                          />
                        </View>

                        <View className="mb-5">
                          <Text className='text-slate-400 text-[10px] font-black mb-2 uppercase tracking-widest'>Security Cipher</Text>
                          <View className="relative">
                            <TextInput 
                              className='bg-white border border-slate-100 rounded-2xl px-5 h-14 text-slate-700 font-bold pr-12'
                              secureTextEntry={!showPass}
                              placeholder='••••••••'
                              onChangeText={t => setForm({...form, password: t})}
                            />
                            <TouchableOpacity onPress={() => setShowPass(!showPass)} className="absolute right-4 top-4">
                              {showPass ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
                            </TouchableOpacity>
                          </View>
                          <PasswordStrengthIndicator password={form.password} />
                        </View>

                        <TouchableOpacity 
                          className='bg-mint-400 h-16 rounded-full items-center justify-center flex-row shadow-xl shadow-mint-200 mt-4 active:scale-95 transition-all'
                        >
                          <Text className='text-white font-black text-xl mr-2'>Create Account</Text>
                          <ArrowRight size={22} color='white' strokeWidth={3} />
                        </TouchableOpacity>

                        <View className='flex-row justify-center mt-8'>
                          <Text className='text-slate-400 font-bold'>Already tracking? </Text>
                          <Link href='/(auth)/login' asChild>
                            <TouchableOpacity><Text className='text-sky-500 font-black'>Sign In</Text></TouchableOpacity>
                          </Link>
                        </View>
                    </BlurView>
                  </View>
              </View>

              {/* MASSIVE MARKETING COLUMN (PEDAGOGICAL ENGINE) */}
              <ScrollView 
                className={`flex-1 ${isDesktop ? 'bg-white/20' : 'bg-white/40'}`} 
                contentContainerStyle={{ padding: isDesktop ? 100 : 32 }}
                showsVerticalScrollIndicator={false}
              >
                <MarketingContent isDesktop={isDesktop} />
              </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}