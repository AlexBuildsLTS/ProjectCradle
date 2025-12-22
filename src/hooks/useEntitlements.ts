import { useAuthStore } from '../store/auth/useAuthStore';

export function useEntitlements() {
  const { profile, role } = useAuthStore();

  const entitlements = {
    canUseBerryAI: role === 'ADMIN' || role === 'SUPPORT' || profile?.tier === 'PREMIUM_MONTHLY' || profile?.tier === 'LIFETIME',
    canAccessCourses: role !== 'MEMBER', // Everyone but standard free members
    isAdmin: role === 'ADMIN',
    isSupport: role === 'SUPPORT' || role === 'ADMIN',
    tier: profile?.tier || 'FREE'
  };

  return entitlements;
}