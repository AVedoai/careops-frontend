/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './client';
import type {
  User,
  Workspace,
  Service,
  Booking,
  Contact,
  Conversation,
  Form,
  InventoryItem,
  Alert,
  DashboardStats,
  OnboardingStep,
} from '../../lib/types';

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.login(email, password),

  register: (data: {
    email: string;
    password: string;
    businessName: string;
    firstName?: string;
    lastName?: string;
  }) => apiClient.register(data),

  logout: () => apiClient.logout(),

  getCurrentUser: () => apiClient.getCurrentUser(),

  isAuthenticated: () => apiClient.isAuthenticated(),

  refreshToken: () =>
    apiClient.post<{ token: string }>('/api/v1/auth/refresh'),
};

// Dashboard API
export const dashboardApi = {
  getStats: () =>
    apiClient.get<DashboardStats>('/api/v1/dashboard/stats'),

  getAlerts: () =>
    apiClient.get<Alert[]>('/api/v1/dashboard/alerts'),

  markAlertRead: (alertId: string) =>
    apiClient.patch(`/api/v1/dashboard/alerts/${alertId}/read`),

  dismissAlert: (alertId: string) =>
    apiClient.delete(`/api/v1/dashboard/alerts/${alertId}`),
};

// Onboarding API
export const onboardingApi = {
  getSteps: () =>
    apiClient.get<OnboardingStep[]>('/api/v1/onboarding/steps'),

  updateBusinessInfo: (data: {
    name: string;
    address?: string;
    timezone: string;
    contactEmail: string;
    phone?: string;
  }) => apiClient.post('/api/v1/onboarding/business-info', data),

  setupEmailProvider: (data: {
    type: 'sendgrid' | 'mailgun';
    apiKey: string;
  }) => apiClient.post('/api/v1/onboarding/email-provider', data),

  setupSmsProvider: (data: {
    type: 'twilio';
    accountSid: string;
    authToken: string;
    phoneNumber: string;
  }) => apiClient.post('/api/v1/onboarding/sms-provider', data),

  testConnection: (type: 'email' | 'sms') =>
    apiClient.post(`/api/v1/onboarding/test-${type}`),

  createContactForm: (data: {
    name: string;
    fields: unknown[];
  }) => apiClient.post('/api/v1/onboarding/contact-form', data),

  inviteStaff: (data: {
    email: string;
    role: 'staff';
    permissions: string[];
  }) => apiClient.post('/api/v1/onboarding/invite-staff', data),

  activateWorkspace: () =>
    apiClient.post('/api/v1/onboarding/activate'),
};

// Services API
export const servicesApi = {
  getAll: () =>
    apiClient.get<Service[]>('/api/v1/services'),

  getById: (id: string) =>
    apiClient.get<Service>(`/api/v1/services/${id}`),

  create: (data: Partial<Service>) =>
    apiClient.post<Service>('/api/v1/services', data),

  update: (id: string, data: Partial<Service>) =>
    apiClient.put<Service>(`/api/v1/services/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/api/v1/services/${id}`),

  getAvailability: (serviceId: string, date: string) =>
    apiClient.get<string[]>(`/api/v1/services/${serviceId}/availability`, {
      date,
    }),
};

// Bookings API
export const bookingsApi = {
  getAll: (params?: { 
    date?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => apiClient.getPaginated<Booking>('/api/v1/bookings', params),

  getById: (id: string) =>
    apiClient.get<Booking>(`/api/v1/bookings/${id}`),

  create: (data: {
    serviceId: string;
    contactData: {
      firstName: string;
      lastName?: string;
      email: string;
      phone?: string;
    };
    date: string;
    time: string;
    notes?: string;
  }) => apiClient.post<Booking>('/api/v1/bookings', data),

  update: (id: string, data: Partial<Booking>) =>
    apiClient.put<Booking>(`/api/v1/bookings/${id}`, data),

  cancel: (id: string, reason?: string) =>
    apiClient.post(`/api/v1/bookings/${id}/cancel`, { reason }),

  markComplete: (id: string, notes?: string) =>
    apiClient.post(`/api/v1/bookings/${id}/complete`, { notes }),

  markNoShow: (id: string) =>
    apiClient.post(`/api/v1/bookings/${id}/no-show`),

  sendReminder: (id: string) =>
    apiClient.post(`/api/v1/bookings/${id}/reminder`),
};

// Contacts API
export const contactsApi = {
  getAll: (params?: {
    search?: string;
    tags?: string[];
    page?: number;
    limit?: number;
  }) => apiClient.getPaginated<Contact>('/api/v1/contacts', params),

  getById: (id: string) =>
    apiClient.get<Contact>(`/api/v1/contacts/${id}`),

  create: (data: Partial<Contact>) =>
    apiClient.post<Contact>('/api/v1/contacts', data),

  update: (id: string, data: Partial<Contact>) =>
    apiClient.put<Contact>(`/api/v1/contacts/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/api/v1/contacts/${id}`),

  addTags: (id: string, tags: string[]) =>
    apiClient.post(`/api/v1/contacts/${id}/tags`, { tags }),

  removeTags: (id: string, tags: string[]) =>
    apiClient.delete(`/api/v1/contacts/${id}/tags`, { data: { tags } }),
};

// Conversations API
export const conversationsApi = {
  getAll: (params?: {
    status?: 'active' | 'closed';
    assigned?: boolean;
    page?: number;
    limit?: number;
  }) => apiClient.getPaginated<Conversation>('/api/v1/conversations', params),

  getById: (id: string) =>
    apiClient.get<Conversation>(`/api/v1/conversations/${id}`),

  sendMessage: (id: string, data: {
    content: string;
    type: 'email' | 'sms';
    subject?: string;
  }) => apiClient.post(`/api/v1/conversations/${id}/messages`, data),

  markRead: (id: string) =>
    apiClient.post(`/api/v1/conversations/${id}/read`),

  assign: (id: string, userId: string) =>
    apiClient.post(`/api/v1/conversations/${id}/assign`, { userId }),

  close: (id: string) =>
    apiClient.post(`/api/v1/conversations/${id}/close`),

  pauseAutomation: (id: string) =>
    apiClient.post(`/api/v1/conversations/${id}/pause-automation`),

  resumeAutomation: (id: string) =>
    apiClient.post(`/api/v1/conversations/${id}/resume-automation`),
};

// Forms API
export const formsApi = {
  getAll: () =>
    apiClient.get<Form[]>('/api/v1/forms'),

  getById: (id: string) =>
    apiClient.get<Form>(`/api/v1/forms/${id}`),

  create: (data: Partial<Form>) =>
    apiClient.post<Form>('/api/v1/forms', data),

  update: (id: string, data: Partial<Form>) =>
    apiClient.put<Form>(`/api/v1/forms/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/api/v1/forms/${id}`),

  uploadDocument: (file: File, name: string, onProgress?: (progress: number) => void) =>
    apiClient.upload('/api/v1/forms/upload', file, onProgress),

  getSubmissions: (formId: string, params?: {
    status?: 'pending' | 'completed' | 'overdue';
    page?: number;
    limit?: number;
  }) => apiClient.getPaginated(`/api/v1/forms/${formId}/submissions`, params),
};

// Inventory API
export const inventoryApi = {
  getAll: () =>
    apiClient.get<InventoryItem[]>('/api/v1/inventory'),

  getById: (id: string) =>
    apiClient.get<InventoryItem>(`/api/v1/inventory/${id}`),

  create: (data: Partial<InventoryItem>) =>
    apiClient.post<InventoryItem>('/api/v1/inventory', data),

  update: (id: string, data: Partial<InventoryItem>) =>
    apiClient.put<InventoryItem>(`/api/v1/inventory/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/api/v1/inventory/${id}`),

  adjustQuantity: (id: string, adjustment: number, reason?: string) =>
    apiClient.post(`/api/v1/inventory/${id}/adjust`, {
      adjustment,
      reason,
    }),

  getLowStockItems: () =>
    apiClient.get<InventoryItem[]>('/api/v1/inventory/low-stock'),
};

// Workspace API
export const workspaceApi = {
  getCurrent: () =>
    apiClient.get<Workspace>('/api/v1/workspace'),

  update: (data: Partial<Workspace>) =>
    apiClient.put<Workspace>('/api/v1/workspace', data),

  getMembers: () =>
    apiClient.get<User[]>('/api/v1/workspace/members'),

  inviteMember: (data: {
    email: string;
    role: 'staff';
    permissions: string[];
  }) => apiClient.post('/api/v1/workspace/invite', data),

  removeMember: (userId: string) =>
    apiClient.delete(`/api/v1/workspace/members/${userId}`),

  updateMember: (userId: string, data: {
    role?: 'staff';
    permissions?: string[];
  }) => apiClient.put(`/api/v1/workspace/members/${userId}`, data),
};

// Public API (no auth required)
export const publicApi = {
  getWorkspace: (slug: string) =>
    apiClient.get<Workspace>(`/api/v1/public/workspaces/${slug}`),

  getService: (workspaceSlug: string, serviceSlug: string) =>
    apiClient.get<Service>(`/api/v1/public/workspaces/${workspaceSlug}/services/${serviceSlug}`),

  getAvailability: (workspaceSlug: string, serviceSlug: string, date: string) =>
    apiClient.get<string[]>(
      `/api/v1/public/workspaces/${workspaceSlug}/services/${serviceSlug}/availability`,
      { date }
    ),

  createBooking: (workspaceSlug: string, data: {
    serviceSlug: string;
    contactData: {
      firstName: string;
      lastName?: string;
      email: string;
      phone?: string;
    };
    date: string;
    time: string;
    notes?: string;
  }) => apiClient.post(`/api/v1/public/workspaces/${workspaceSlug}/bookings`, data),

  getForm: (workspaceSlug: string, formId: string) =>
    apiClient.get<Form>(`/api/v1/public/workspaces/${workspaceSlug}/forms/${formId}`),

  submitContactForm: (workspaceSlug: string, data: {
    name?: string;
    email: string;
    phone?: string;
    message?: string;
  }) => apiClient.post(`/api/v1/public/workspaces/${workspaceSlug}/contact`, data),

  submitForm: (workspaceSlug: string, formId: string, data: Record<string, unknown>) =>
    apiClient.post(`/api/v1/public/workspaces/${workspaceSlug}/forms/${formId}/submit`, data),
};

// Submissions API
export const SubmissionsAPI = {
  getList: () => apiClient.get('/api/v1/submissions'),
  
  getById: (id: string) => apiClient.get(`/api/v1/submissions/${id}`),
  
  create: (data: any) => apiClient.post('/api/v1/submissions', data),
  
  update: (id: string, data: any) => apiClient.put(`/api/v1/submissions/${id}`, data),
  
  delete: (id: string) => apiClient.delete(`/api/v1/submissions/${id}`)
};

// Staff API  
export const StaffAPI = {
  getList: () => apiClient.get('/api/v1/staff'),
  
  getById: (id: string) => apiClient.get(`/api/v1/staff/${id}`),
  
  create: (data: any) => apiClient.post('/api/v1/staff', data),
  
  update: (id: string, data: any) => apiClient.put(`/api/v1/staff/${id}`, data),
  
  delete: (id: string) => apiClient.delete(`/api/v1/staff/${id}`)
};

// Messages API
export const MessagesAPI = {
  getList: () => apiClient.get('/api/v1/messages'),
  
  getById: (id: string) => apiClient.get(`/api/v1/messages/${id}`),
  
  create: (data: any) => apiClient.post('/api/v1/messages', data),
  
  markAsRead: (id: string) => apiClient.patch(`/api/v1/messages/${id}/read`),
  
  delete: (id: string) => apiClient.delete(`/api/v1/messages/${id}`)
};

// Leads API
export const LeadsAPI = {
  getList: () => apiClient.get('/api/v1/leads'),
  
  getById: (id: string) => apiClient.get(`/api/v1/leads/${id}`),
  
  create: (data: any) => apiClient.post('/api/v1/leads', data),
  
  update: (id: string, data: any) => apiClient.put(`/api/v1/leads/${id}`, data),
  
  delete: (id: string) => apiClient.delete(`/api/v1/leads/${id}`)
};

// Export the raw API client for legacy support
export { api } from './client';

// Export the API client instance
export { apiClient };