// src/store/useAuthStore.ts
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

type AuthState = {
  profile: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  session: any;
  checkAuth: () => Promise<void>;
  setSession: (session: any) => void;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  user: null,
  session: null,

  // On app bootstrap, fetch current session from Supabase
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;

      set({
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
      });
    } catch (err) {
      console.error('Auth check failed', err);
      set({
        session: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Called on every onAuthStateChange event
  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session,
    }),

  // Sign out via Supabase, then clear store
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error', error);
      throw error;
    }
    set({
      session: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
