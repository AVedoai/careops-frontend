// stores/form-builder-store.ts

import { create } from 'zustand';
import { devtools, createJSONStorage } from 'zustand/middleware';
import type {
  Form,
  FormField,
  FormSettings,
  FormBuilderState,
  DraggedField
} from '../types/form-builder';
import { FieldType } from '../types/form-builder';
import { v4 as uuidv4 } from 'uuid';

interface FormBuilderStore extends FormBuilderState {
  // State
  form: Partial<Form>;
  fields: FormField[];
  selectedFieldId?: string;
  isDragging: boolean;
  draggedField?: DraggedField;
  previewMode: boolean;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  errors: Record<string, string>;

  // Actions
  initializeForm: (form?: Partial<Form>) => void;
  updateForm: (updates: Partial<Form>) => void;
  updateFormSettings: (settings: Partial<FormSettings>) => void;
  
  // Field Management
  addField: (fieldType: FieldType, position?: number) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  removeField: (fieldId: string) => void;
  moveField: (fromIndex: number, toIndex: number) => void;
  duplicateField: (fieldId: string) => void;
  selectField: (fieldId?: string) => void;
  
  // Drag & Drop
  setDraggedField: (field?: DraggedField) => void;
  setIsDragging: (isDragging: boolean) => void;
  
  // UI State
  setPreviewMode: (previewMode: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (fieldId: string, error: string) => void;
  clearError: (fieldId: string) => void;
  clearAllErrors: () => void;
  
  // Form Validation
  validateForm: () => boolean;
  validateField: (field: FormField) => string | null;
  
  // Reset
  resetForm: () => void;
  markSaved: () => void;
}

const createDefaultField = (type: FieldType, order: number): FormField => {
  const baseField: FormField = {
    id: uuidv4(),
    type,
    label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
    required: false,
    validation: [],
    options: [],
    conditionalLogic: [],
    order,
    properties: {}
  };

  // Add type-specific defaults
  switch (type) {
    case FieldType.TEXT:
      return {
        ...baseField,
        label: 'Text Input',
        placeholder: 'Enter text...'
      };
    case FieldType.EMAIL:
      return {
        ...baseField,
        label: 'Email Address',
        placeholder: 'Enter email address...',
        validation: [
          { type: 'pattern', value: '^[^\s@]+@[^\s@]+\.[^\s@]+$', message: 'Please enter a valid email address' }
        ]
      };
    case FieldType.PHONE:
      return {
        ...baseField,
        label: 'Phone Number',
        placeholder: 'Enter phone number...'
      };
    case FieldType.TEXTAREA:
      return {
        ...baseField,
        label: 'Message',
        placeholder: 'Enter your message...',
        properties: { rows: 4 }
      };
    case FieldType.NUMBER:
      return {
        ...baseField,
        label: 'Number',
        placeholder: 'Enter number...'
      };
    case FieldType.DATE:
      return {
        ...baseField,
        label: 'Date',
        properties: { format: 'yyyy-MM-dd' }
      };
    case FieldType.TIME:
      return {
        ...baseField,
        label: 'Time',
        properties: { format: 'HH:mm' }
      };
    case FieldType.SELECT:
      return {
        ...baseField,
        label: 'Select Option',
        options: ['Option 1', 'Option 2', 'Option 3']
      };
    case FieldType.RADIO:
      return {
        ...baseField,
        label: 'Choose One',
        options: ['Option 1', 'Option 2', 'Option 3']
      };
    case FieldType.CHECKBOX:
      return {
        ...baseField,
        label: 'Select All That Apply',
        options: ['Option 1', 'Option 2', 'Option 3']
      };
    case FieldType.FILE:
      return {
        ...baseField,
        label: 'Upload File',
        properties: {
          accept: '.pdf,.jpg,.png',
          maxSize: 5, // MB
          maxFiles: 1
        }
      };
    case FieldType.SIGNATURE:
      return {
        ...baseField,
        label: 'Digital Signature',
        properties: {
          backgroundColor: '#ffffff',
          penColor: '#000000',
          width: 400,
          height: 200
        }
      };
    case FieldType.RATING:
      return {
        ...baseField,
        label: 'Rating',
        properties: {
          max: 5,
          icon: 'star',
          allowHalf: false
        }
      };
    case FieldType.SECTION:
      return {
        ...baseField,
        label: 'Section Title',
        properties: {
          description: 'Section description'
        }
      };
    default:
      return baseField;
  }
};

export const useFormBuilderStore = create<FormBuilderStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      form: {},
      fields: [],
      selectedFieldId: undefined,
      isDragging: false,
      draggedField: undefined,
      previewMode: false,
      hasUnsavedChanges: false,
      isLoading: false,
      errors: {},

      // Form Management
      initializeForm: (form = {}) => {
        set({
          form,
          fields: form.fields || [],
          selectedFieldId: undefined,
          hasUnsavedChanges: false,
          previewMode: false,
          errors: {}
        });
      },

      updateForm: (updates) => {
        set(state => ({
          form: { ...state.form, ...updates },
          hasUnsavedChanges: true
        }));
      },

      updateFormSettings: (settings: Partial<FormSettings>) => {
        set(state => {
          const currentSettings = state.form.settings || {};
          return {
            ...state,
            form: {
              ...state.form,
              settings: { ...currentSettings, ...settings } as FormSettings
            },
            hasUnsavedChanges: true
          };
        });
      },

      // Field Management
      addField: (fieldType, position) => {
        const { fields } = get();
        const order = position !== undefined ? position : fields.length;
        const newField = createDefaultField(fieldType, order);
        
        // Adjust order of existing fields if inserting in middle
        const updatedFields = position !== undefined 
          ? [
              ...fields.slice(0, position),
              newField,
              ...fields.slice(position).map(f => ({ ...f, order: f.order + 1 }))
            ]
          : [...fields, newField];

        set({
          fields: updatedFields,
          selectedFieldId: newField.id,
          hasUnsavedChanges: true
        });
      },

      updateField: (fieldId, updates) => {
        set(state => ({
          fields: state.fields.map(field =>
            field.id === fieldId ? { ...field, ...updates } : field
          ),
          hasUnsavedChanges: true
        }));
      },

      removeField: (fieldId) => {
        set(state => ({
          fields: state.fields.filter(field => field.id !== fieldId),
          selectedFieldId: state.selectedFieldId === fieldId ? undefined : state.selectedFieldId,
          hasUnsavedChanges: true
        }));
      },

      moveField: (fromIndex, toIndex) => {
        const { fields } = get();
        const updatedFields = [...fields];
        const [movedField] = updatedFields.splice(fromIndex, 1);
        updatedFields.splice(toIndex, 0, movedField);
        
        // Update order property
        const finalFields = updatedFields.map((field, index) => ({
          ...field,
          order: index
        }));

        set({
          fields: finalFields,
          hasUnsavedChanges: true
        });
      },

      duplicateField: (fieldId) => {
        const { fields } = get();
        const fieldToDuplicate = fields.find(f => f.id === fieldId);
        if (!fieldToDuplicate) return;

        const duplicatedField = {
          ...fieldToDuplicate,
          id: uuidv4(),
          label: `${fieldToDuplicate.label} (Copy)`,
          order: fieldToDuplicate.order + 1
        };

        const updatedFields = [
          ...fields.slice(0, fieldToDuplicate.order + 1),
          duplicatedField,
          ...fields.slice(fieldToDuplicate.order + 1).map(f => ({ ...f, order: f.order + 1 }))
        ];

        set({
          fields: updatedFields,
          selectedFieldId: duplicatedField.id,
          hasUnsavedChanges: true
        });
      },

      selectField: (fieldId) => {
        set({ selectedFieldId: fieldId });
      },

      // Drag & Drop
      setDraggedField: (field) => {
        set({ draggedField: field });
      },

      setIsDragging: (isDragging) => {
        set({ isDragging });
      },

      // UI State
      setPreviewMode: (previewMode) => {
        set({ previewMode, selectedFieldId: previewMode ? undefined : get().selectedFieldId });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (fieldId, error) => {
        set(state => ({
          errors: { ...state.errors, [fieldId]: error }
        }));
      },

      clearError: (fieldId) => {
        set(state => {
          const newErrors = { ...state.errors };
          delete newErrors[fieldId];
          return { errors: newErrors };
        });
      },

      clearAllErrors: () => {
        set({ errors: {} });
      },

      // Form Validation
      validateForm: () => {
        const { fields } = get();
        let isValid = true;
        const newErrors: Record<string, string> = {};

        fields.forEach(field => {
          const error = get().validateField(field);
          if (error) {
            newErrors[field.id] = error;
            isValid = false;
          }
        });

        set({ errors: newErrors });
        return isValid;
      },

      validateField: (field) => {
        // Required field validation
        if (field.required && !field.label.trim()) {
          return 'Field label is required';
        }

        // Type-specific validation
        switch (field.type) {
          case FieldType.SELECT:
          case FieldType.RADIO:
          case FieldType.CHECKBOX:
            if (field.options.length === 0) {
              return 'At least one option is required';
            }
            break;
        }

        return null;
      },

      // Reset
      resetForm: () => {
        set({
          form: {},
          fields: [],
          selectedFieldId: undefined,
          isDragging: false,
          draggedField: undefined,
          previewMode: false,
          hasUnsavedChanges: false,
          isLoading: false,
          errors: {}
        });
      },

      markSaved: () => {
        set({ hasUnsavedChanges: false });
      }
    }),
    {
      name: 'form-builder-store'
    }
  )
);

// Selectors (for computed values)
export const useFormBuilderSelectors = () => {
  const store = useFormBuilderStore();
  
  return {
    // Get selected field
    selectedField: store.fields.find(f => f.id === store.selectedFieldId),
    
    // Get fields by order
    orderedFields: store.fields.sort((a, b) => a.order - b.order),
    
    // Check if form is valid
    isFormValid: store.fields.length > 0 && Object.keys(store.errors).length === 0,
    
    // Check if form can be published
    canPublish: store.fields.length > 0 && store.form.name && !store.hasUnsavedChanges,
    
    // Get form with current fields
    formWithFields: {
      ...store.form,
      fields: store.fields.sort((a, b) => a.order - b.order)
    }
  };
};