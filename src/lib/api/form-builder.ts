// lib/api/form-builder.ts

import axios from 'axios';
import type {
  Form,
  FormListResponse,
  FormSubmission,
  SubmissionListResponse,
  PublicForm,
  FormAnalytics,
  FormTemplate,
  FieldType
} from '../../../src/types/form-builder';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Auth token management (implement based on your auth system)
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token') || '';
  }
  return '';
};

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export class FormBuilderAPI {
  // Form Management
  static async getForms(params?: {
    page?: number;
    perPage?: number;
    formType?: string;
    search?: string;
  }): Promise<FormListResponse> {
    const response = await api.get('/api/v1/form-builder/', { params });
    return response.data;
  }

  static async getForm(formId: number): Promise<Form> {
    const response = await api.get(`/api/v1/form-builder/${formId}`);
    return response.data;
  }

  static async createCustomForm(formData: {
    name: string;
    description?: string;
    fields?: Array<FieldType>;
    settings?: Record<string, unknown>;
  }): Promise<Form> {
    const response = await api.post('/api/v1/form-builder/custom', {
      type: 'CUSTOM',
      ...formData,
      fields: formData.fields || [],
      settings: formData.settings || {
        notifications: { email: false, emailTo: '' },
        redirect: { enabled: false, url: '' },
        thankYouMessage: 'Thank you for your submission!',
        allowMultipleSubmissions: false,
        requireEmail: false,
        enableCaptcha: false
      }
    });
    return response.data;
  }

  static async createExternalForm(formData: {
    name: string;
    description?: string;
    externalUrl: string;
  }): Promise<Form> {
    const response = await api.post('/api/v1/form-builder/external', {
      type: 'EXTERNAL_LINK',
      external_url: formData.externalUrl,
      name: formData.name,
      description: formData.description
    });
    return response.data;
  }

  static async createDocumentForm(
    name: string,
    description: string,
    file: File
  ): Promise<Form> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('file', file);

    const response = await api.post('/api/v1/form-builder/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  static async updateForm(formId: number, formData: {
    name?: string;
    description?: string;
    fields?: Array<FieldType>;
    settings?: Record<string, unknown>;
    isActive?: boolean;
    isPublished?: boolean;
  }): Promise<Form> {
    const response = await api.put(`/api/v1/form-builder/${formId}`, formData);
    return response.data;
  }

  static async publishForm(formId: number): Promise<Form> {
    const response = await api.post(`/api/v1/form-builder/${formId}/publish`);
    return response.data;
  }

  static async duplicateForm(formId: number): Promise<Form> {
    const response = await api.post(`/api/v1/form-builder/${formId}/duplicate`);
    return response.data;
  }

  static async deleteForm(formId: number): Promise<{ success: boolean }> {
    const response = await api.delete(`/api/v1/form-builder/${formId}`);
    return response.data;
  }

  static async getFormAnalytics(formId: number): Promise<FormAnalytics> {
    const response = await api.get(`/api/v1/form-builder/${formId}/analytics`);
    return response.data;
  }

  static async getShareLink(formId: number): Promise<{
    shareLink: string;
    embedCode: string;
    fullUrl: string;
  }> {
    const response = await api.get(`/api/v1/form-builder/${formId}/share-link`);
    return response.data;
  }

  // Form Templates
  static async getFormTemplates(): Promise<{ templates: FormTemplate[] }> {
    const response = await api.get('/api/v1/form-builder/templates');
    return response.data;
  }

  static async createFormFromTemplate(
    templateId: string,
    name: string,
    description?: string
  ): Promise<Form> {
    const response = await api.post(
      `/api/v1/form-builder/from-template/${templateId}`,
      { name, description }
    );
    return response.data;
  }

  // Submissions Management
  static async getSubmissions(params?: {
    page?: number;
    perPage?: number;
    formId?: number;
    status?: string;
    search?: string;
  }): Promise<SubmissionListResponse> {
    const response = await api.get('/api/v1/form-builder/submissions/', { params });
    return response.data;
  }

  static async getSubmission(submissionId: number): Promise<FormSubmission> {
    const response = await api.get(`/api/v1/form-builder/submissions/${submissionId}`);
    return response.data;
  }

  static async updateSubmission(
    submissionId: number,
    data: {
      status?: string;
      notes?: string;
      assignedTo?: number;
      isRead?: boolean;
    }
  ): Promise<FormSubmission> {
    const response = await api.put(
      `/api/v1/form-builder/submissions/${submissionId}`,
      data
    );
    return response.data;
  }

  static async convertSubmissionToBooking(submissionId: number): Promise<{
    message: string;
  }> {
    const response = await api.post(
      `/api/v1/form-builder/submissions/${submissionId}/convert-to-booking`
    );
    return response.data;
  }

  // Export
  static async exportFormSubmissions(
    formId: number,
    format: 'csv' | 'excel' | 'json' = 'csv'
  ): Promise<Blob> {
    const response = await api.get(
      `/api/v1/form-builder/${formId}/export`,
      { 
        params: { format },
        responseType: 'blob'
      }
    );
    return response.data;
  }

  // File Upload Helper
  static async uploadFile(file: File, fieldId: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('field_id', fieldId);

    const response = await api.post('/api/v1/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
}

export class PublicFormAPI {
  // Public API (no auth required)
  private static publicApi = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
  });

  static async getPublicForm(shareKey: string): Promise<PublicForm> {
    const response = await this.publicApi.get(`/api/public/forms/${shareKey}`);
    return response.data;
  }

  static async submitForm(
    shareKey: string,
    submissionData: {
      submittedData: Record<string, unknown>;
      submitterEmail?: string;
      submitterName?: string;
      submitterPhone?: string;
    }
  ): Promise<FormSubmission> {
    const response = await this.publicApi.post(
      `/api/public/forms/${shareKey}/submit`,
      {
        submitted_data: submissionData.submittedData,
        submitter_email: submissionData.submitterEmail,
        submitter_name: submissionData.submitterName,
        submitter_phone: submissionData.submitterPhone
      }
    );
    return response.data;
  }

  static async validateFormField(
    shareKey: string,
    fieldData: Record<string, unknown>
  ): Promise<{
    valid: boolean;
    errors: Record<string, string>;
  }> {
    const response = await this.publicApi.post(
      `/api/public/forms/${shareKey}/validate`,
      fieldData
    );
    return response.data;
  }

  static async trackFormView(shareKey: string): Promise<{ tracked: boolean }> {
    const response = await this.publicApi.get(`/api/public/forms/${shareKey}/track`);
    return response.data;
  }
}

// Helper functions
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const generateShareUrl = (shareLink: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_FORM_URL || 'http://localhost:3000';
  return `${baseUrl}${shareLink}`;
};

export const generateEmbedCode = (shareLink: string, width = '100%', height = '600px'): string => {
  const url = generateShareUrl(shareLink);
  return `<iframe src="${url}" width="${width}" height="${height}" frameborder="0" style="border: none; border-radius: 8px;"></iframe>`;
};

export default FormBuilderAPI;