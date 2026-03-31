import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User,
  UserRole,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, role: UserRole, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Login failed');
          }

          const data = await response.json();
          
          // In real app, we would map backend user to frontend User type correctly
          const user: User = {
            ...data.user,
            balance: 0,
            subscriptionType: 'free',
            isVerified: true,
            isEmailVerified: true,
            createdAt: new Date(),
          };

          set({ 
            user, 
            token: data.token,
            isAuthenticated: true, 
            isLoading: false 
          });
          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },
      
      register: async (email, password, role, name) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role, name }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Registration failed');
          }

          const data = await response.json();
          
          const user: User = {
            ...data.user,
            balance: 0,
            subscriptionType: 'free',
            isVerified: false,
            isEmailVerified: false,
            createdAt: new Date(),
          };

          set({ 
            user, 
            token: data.token,
            isAuthenticated: true, 
            isLoading: false 
          });
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
