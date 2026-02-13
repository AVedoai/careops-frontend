import { create } from 'zustand';
import type { DashboardStats, Alert, Booking, Conversation } from '../../lib/types';

interface DashboardState {
  stats: DashboardStats | null;
  alerts: Alert[];
  todayBookings: Booking[];
  activeConversations: Conversation[];
  isLoading: boolean;
  
  // Actions
  setStats: (stats: DashboardStats) => void;
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  removeAlert: (alertId: string) => void;
  markAlertRead: (alertId: string) => void;
  setTodayBookings: (bookings: Booking[]) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  setActiveConversations: (conversations: Conversation[]) => void;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>(
  (
    set,
    // get - unused but required by Zustand
  ) => ({
  stats: null,
  alerts: [],
  todayBookings: [],
  activeConversations: [],
  isLoading: false,

  setStats: (stats) => set({ stats }),

  setAlerts: (alerts) => set({ alerts }),

  addAlert: (alert) => 
    set((state) => ({ 
      alerts: [alert, ...state.alerts] 
    })),

  removeAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.filter(alert => alert.id !== alertId)
    })),

  markAlertRead: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map(alert =>
        alert.id === alertId
          ? { ...alert, isRead: true }
          : alert
      )
    })),

  setTodayBookings: (bookings) => set({ todayBookings: bookings }),

  updateBooking: (bookingId, updates) =>
    set((state) => ({
      todayBookings: state.todayBookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, ...updates }
          : booking
      )
    })),

  setActiveConversations: (conversations) => 
    set({ activeConversations: conversations }),

  updateConversation: (conversationId, updates) =>
    set((state) => ({
      activeConversations: state.activeConversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, ...updates }
          : conv
      )
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  reset: () => set({
    stats: null,
    alerts: [],
    todayBookings: [],
    activeConversations: [],
    isLoading: false,
  }),
}));