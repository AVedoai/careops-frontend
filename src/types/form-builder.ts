// types/form-builder.ts

export enum FormType {
  CUSTOM = "CUSTOM",
  DOCUMENT = "DOCUMENT",
  EXTERNAL_LINK = "EXTERNAL_LINK"
}

export enum FieldType {
  TEXT = 'TEXT',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  TEXTAREA = 'TEXTAREA',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  TIME = 'TIME',
  SELECT = 'SELECT',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  FILE = 'FILE',
  SIGNATURE = 'SIGNATURE',
  RATING = 'RATING',
  SECTION = 'SECTION',
}

export enum SubmissionStatus {
  NEW = "NEW",
  REVIEWED = "REVIEWED",
  CONTACTED = "CONTACTED",
  CONVERTED = "CONVERTED"
}

export interface ValidationRule {
  type: 'min' | 'max' | 'pattern' | 'custom';
  value: unknown; // Replace 'any' with 'unknown'
  message: string;
}

export interface ConditionalRule {
  condition: 'show' | 'hide' | 'require';
  when: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than';
    value: unknown; // Replace 'any' with 'unknown'
  };
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  validation: ValidationRule[];
  options: string[]; // For select, radio, checkbox
  conditionalLogic: ConditionalRule[];
  order: number;
  properties: Record<string, unknown>; // Replace 'any' with 'unknown'
}

export interface FormSettings {
  notifications: {
    email: boolean;
    emailTo: string;
  };
  redirect: {
    enabled: boolean;
    url: string;
  };
  thankYouMessage: string;
  allowMultipleSubmissions: boolean;
  requireEmail: boolean;
  enableCaptcha: boolean;
  expiryDate?: Date;
}

export interface Form {
  id: number;
  workspaceId: number;
  createdBy?: number;
  name: string;
  description?: string;
  type: FormType;
  fileUrl?: string;
  externalUrl?: string;
  fields?: FormField[];
  settings?: FormSettings;
  isActive: boolean;
  isPublished: boolean;
  shareLink?: string;
  embedCode?: string;
  viewsCount: number;
  submissionsCount: number;
  createdAt: Date;
}

export interface PublicForm {
  id: number;
  name: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  workspaceName?: string;
}

export interface FormSubmission {
  id: number;
  formId: number;
  workspaceId: number;
  submittedData: Record<string, unknown>; // Replace 'any' with 'unknown'
  submitterEmail?: string;
  submitterName?: string;
  submitterPhone?: string;
  status: SubmissionStatus;
  isRead: boolean;
  notes?: string;
  assignedTo?: number;
  convertedToBookingId?: number;
  createdAt: Date;
  updatedAt: Date;
  formName?: string;
  assignedUserName?: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  category?: string;
  previewImage?: string;
}

export interface FormAnalytics {
  formId: number;
  views: number;
  submissions: number;
  completionRate: number;
  averageTime?: number;
  topExitFields: string[];
}

// API Response Types
export interface FormListResponse {
  forms: Form[];
  total: number;
  page: number;
  perPage: number;
}

export interface SubmissionListResponse {
  submissions: FormSubmission[];
  total: number;
  page: number;
  perPage: number;
}

// Form Builder UI Types
export interface DraggedField {
  id: string;
  type: FieldType;
  label: string;
  fromPalette: boolean;
}

export interface FieldPaletteItem {
  type: FieldType;
  label: string;
  icon: string;
  description: string;
  category: 'basic' | 'advanced' | 'layout';
}

export interface FormBuilderState {
  form: Partial<Form>;
  selectedFieldId?: string;
  isDragging: boolean;
  draggedField?: DraggedField;
  previewMode: boolean;
  hasUnsavedChanges: boolean;
}

// Form Rendering Types
export interface FieldComponentProps {
  field: FormField;
  value: unknown; // Replace 'any' with 'unknown'
  onChange: (value: unknown) => void;
  error?: string;
  disabled?: boolean;
}

export interface FormRendererProps {
  form: PublicForm;
  onSubmit: (data: Record<string, unknown>) => void;
  loading?: boolean;
  preview?: boolean;
}

// Field Configuration Types
export interface TextFieldConfig {
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface SelectFieldConfig {
  options: string[];
  allowOther?: boolean;
}

export interface NumberFieldConfig {
  min?: number;
  max?: number;
  step?: number;
}

export interface DateFieldConfig {
  minDate?: string;
  maxDate?: string;
  format?: string;
}

export interface FileFieldConfig {
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  allowedTypes?: string[];
}

export interface SignatureFieldConfig {
  backgroundColor?: string;
  penColor?: string;
  width?: number;
  height?: number;
}

export interface RatingFieldConfig {
  max?: number;
  icon?: 'star' | 'heart' | 'thumbs' | 'number';
  allowHalf?: boolean;
}

// Export/Import Types
export interface ExportOptions {
  format: 'csv' | 'excel' | 'json' | 'pdf';
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeFields?: string[];
  filters?: Record<string, unknown>; // Replace 'any' with 'unknown'
}

// Webhook Types
export interface WebhookConfig {
  url: string;
  events: ('form.submitted' | 'form.updated' | 'submission.status_changed')[];
  secret?: string;
  enabled: boolean;
}

// Integration Types
export interface FormIntegration {
  id: string;
  type: 'zapier' | 'webhook' | 'email' | 'calendar';
  name: string;
  config: Record<string, unknown>; // Replace 'any' with 'unknown'
  enabled: boolean;
}

// Error Types
export interface FormValidationError {
  fieldId: string;
  message: string;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// Constants
export const FIELD_PALETTE: FieldPaletteItem[] = [
  // Basic Fields
  {
    type: FieldType.TEXT,
    label: "Text Input",
    icon: "Type",
    description: "Single line text input",
    category: "basic"
  },
  {
    type: FieldType.EMAIL,
    label: "Email",
    icon: "Mail",
    description: "Email address input with validation",
    category: "basic"
  },
  {
    type: FieldType.PHONE,
    label: "Phone",
    icon: "Phone",
    description: "Phone number input",
    category: "basic"
  },
  {
    type: FieldType.TEXTAREA,
    label: "Textarea",
    icon: "AlignLeft",
    description: "Multi-line text input",
    category: "basic"
  },
  {
    type: FieldType.NUMBER,
    label: "Number",
    icon: "Hash",
    description: "Numeric input",
    category: "basic"
  },
  {
    type: FieldType.DATE,
    label: "Date",
    icon: "Calendar",
    description: "Date picker",
    category: "basic"
  },
  {
    type: FieldType.TIME,
    label: "Time",
    icon: "Clock",
    description: "Time picker",
    category: "basic"
  },

  // Choice Fields
  {
    type: FieldType.SELECT,
    label: "Dropdown",
    icon: "ChevronDown",
    description: "Dropdown selection",
    category: "basic"
  },
  {
    type: FieldType.RADIO,
    label: "Radio Buttons",
    icon: "Circle",
    description: "Single choice from multiple options",
    category: "basic"
  },
  {
    type: FieldType.CHECKBOX,
    label: "Checkboxes",
    icon: "CheckSquare",
    description: "Multiple choice selection",
    category: "basic"
  },

  // Advanced Fields
  {
    type: FieldType.FILE,
    label: "File Upload",
    icon: "Upload",
    description: "File upload with drag & drop",
    category: "advanced"
  },
  {
    type: FieldType.SIGNATURE,
    label: "Signature",
    icon: "Edit",
    description: "Digital signature pad",
    category: "advanced"
  },
  {
    type: FieldType.RATING,
    label: "Rating",
    icon: "Star",
    description: "Star rating or numeric rating",
    category: "advanced"
  },

  // Layout Fields
  {
    type: FieldType.SECTION,
    label: "Section",
    icon: "Minus",
    description: "Section divider with title",
    category: "layout"
  }
];