import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';
import { upsertLocalUser, upsertLocalSubscription } from '../services/localDbService';

const TOKEN_KEY = 'pm_token';

export const useAppStore = create((set, get) => ({
  user: null,
  token: null,
  tier: 'Free',
  subscriptionTier: 'Free',
  analysisHistory: [],
  isOnline: true,
  isLoading: false,
  error: null,
  isHydrated: false,

  setSession: async (token, user) => {
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
    const tier = user?.tier || get().subscriptionTier || 'Free';
    set({
      token,
      user,
      tier,
      subscriptionTier: tier,
      error: null,
    });
    if (user?.email || user?.id) {
      const localId = await upsertLocalUser({
        email: user.email,
        name: user.name,
        tier,
        token,
        serverUserId: user.id?.toString(),
      });
      await upsertLocalSubscription(localId, tier);
    }
  },

  hydrate: async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        set({ token, user: { restored: true } });
        try {
          const sub = await authService.fetchSubscription();
          const tier = sub?.tier || sub?.subscription?.tier || 'Free';
          set({ tier, subscriptionTier: tier });
        } catch {
          // subscription fetch may fail if token expired — interceptor handles 401
        }
      }
    } finally {
      set({ isHydrated: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(email, password);
      await get().setSession(data.token, data.user || { email });
      try {
        const sub = await authService.fetchSubscription();
        const tier = sub?.tier || 'Free';
        set({ tier, subscriptionTier: tier });
      } catch {
        // ignore
      }
      return data;
    } catch (e) {
      const msg = e.response?.data?.error || e.message || '로그인 실패';
      set({ error: msg });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  registerUser: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.register(email, name, password);
      await get().setSession(data.token, data.user || { email, name });
      return data;
    } catch (e) {
      const msg = e.response?.data?.error || e.message || '회원가입 실패';
      set({ error: msg });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await authService.logoutRemote();
    await AsyncStorage.removeItem(TOKEN_KEY);
    set({
      user: null,
      token: null,
      tier: 'Free',
      subscriptionTier: 'Free',
      error: null,
    });
  },

  updateSubscription: async (tier) => {
    set({ isLoading: true, error: null });
    try {
      await authService.upgradeSubscription(tier);
      set({ tier, subscriptionTier: tier });
    } catch (e) {
      const msg = e.response?.data?.error || e.message || '구독 업데이트 실패';
      set({ error: msg });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  addAnalysis: (result) => {
    set((state) => ({
      analysisHistory: [
        {
          id: Date.now(),
          at: new Date().toISOString(),
          ...result,
        },
        ...state.analysisHistory,
      ].slice(0, 50),
    }));
  },

  clearHistory: () => set({ analysisHistory: [] }),

  setOnline: (online) => set({ isOnline: online }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
