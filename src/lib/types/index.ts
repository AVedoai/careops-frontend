/* eslint-disable @typescript-eslint/no-explicit-any */
// Core types for the CareOps application
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'owner' | 'staff';
  workspaceId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  timezone: string;
  contactEmail: string;
  phone?: string;
  isActive: boolean;
  ownerId: string;
  settings: WorkspaceSettings;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceSettings {
  emailProvider?: {
    type: 'sendgrid' | 'mailgun';
    apiKey: string;
    verified: boolean;
  };
  smsProvider?: {
    type: 'twilio';
    accountSid: string;
    authToken: string;
    phoneNumber: string;
    verified: boolean;
  };
  branding?: {
    primaryColor: string;
    logo?: string;
  };
}

export interface Service {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description?: string;
  duration: number; // minutes
  price?: number;
  location?: string;
  isActive: boolean;
  availability: ServiceAvailability[];
  requiredForms: string[]; // form IDs
  createdAt: string;
  updatedAt: string;
}

export interface ServiceAvailability {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  contactId: string;
  date: string; // ISO date
  time: string; // "11:00"
  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  reminderSent: boolean;
  formSubmissions: FormSubmission[];
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  workspaceId: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  tags: string[];
  lastContactDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  workspaceId: string;
  status: 'active' | 'closed';
  assignedToUserId?: string;
  lastMessageAt: string;
  unreadCount: number;
  isAutomationPaused: boolean;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  type: 'email' | 'sms';
  direction: 'inbound' | 'outbound';
  content: string;
  subject?: string; // for emails
  automated: boolean;
  sentByUserId?: string;
  status: 'sent' | 'delivered' | 'failed';
  createdAt: string;
}

export interface Form {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  type: 'contact' | 'required_document';
  fields?: FormField[]; // for contact forms
  fileUrl?: string; // for document uploads
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox';
  label: string;
  required: boolean;
  options?: string[]; // for select fields
  placeholder?: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  bookingId?: string;
  contactId?: string;
  responses: Record<string, any>;
  status: 'pending' | 'completed' | 'overdue';
  submittedAt?: string;
  dueDate?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  quantity: number;
  lowStockThreshold: number;
  unit: string; // "bottles", "pieces", etc.
  costPerUnit?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  workspaceId: string;
  type: 'inventory_low' | 'form_overdue' | 'booking_reminder' | 'unanswered_inquiry';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AutomationRule {
  id: string;
  workspaceId: string;
  trigger: 'new_contact' | 'booking_created' | 'booking_reminder' | 'form_due';
  conditions?: Record<string, any>;
  actions: AutomationAction[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationAction {
  type: 'send_email' | 'send_sms' | 'create_task' | 'update_contact';
  config: Record<string, any>;
  delay?: number; // minutes
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  businessName: string;
  firstName?: string;
  lastName?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export interface ContactFormData {
  name?: string;
  email: string;
  phone?: string;
  message?: string;
}

export interface BookingFormData {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  serviceId: string;
  notes?: string;
}

// Dashboard Types
export interface DashboardStats {
  todayBookings: {
    total: number;
    completed: number;
    noShows: number;
  };
  conversations: {
    total: number;
    active: number;
    newToday: number;
    unanswered: number;
  };
  forms: {
    pending: number;
    completed: number;
    overdue: number;
  };
  revenue?: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}