import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Workspace } from '../../lib/types';

interface AuthState {
  user: User | null;
  workspace: Workspace | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setWorkspace: (workspace: Workspace | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (
        set,
        // get - unused but required by Zustand
    ) => ({
      user: null,
      workspace: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => 
        set({ user, isAuthenticated: !!user }),

      setWorkspace: (workspace) => 
        set({ workspace }),

      setLoading: (loading) => 
        set({ isLoading: loading }),

      logout: () => {
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('careops-token');
          localStorage.removeItem('careops-user');
        }
        set({ 
          user: null, 
          workspace: null, 
          isAuthenticated: false 
        });
      },

      initialize: () => {
        if (typeof window !== 'undefined') {
          const userStr = localStorage.getItem('careops-user');
          const token = localStorage.getItem('careops-token');
          
          if (userStr && token) {
            try {
              const user = JSON.parse(userStr);
              set({ 
                user, 
                isAuthenticated: true,
                isLoading: false 
              });
            } catch {
              // Clear corrupted data
              localStorage.removeItem('careops-user');
              localStorage.removeItem('careops-token');
              set({ isLoading: false });
            }
          } else {
            set({ isLoading: false });
          }
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        workspace: state.workspace,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);