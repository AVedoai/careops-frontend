'use client';

import { useState } from 'react';
import { FileText, Plus, Trash2, Link as LinkIcon, Copy, CheckCircle } from 'lucide-react';
import { onboardingApi } from '../..//lib/api';
import { getErrorMessage, copyToClipboard } from '../../lib/utils';

interface FormField {
    id: string;
    name: string;
    type: 'text' | 'email' | 'phone' | 'textarea';
    label: string;
    required: boolean;
    placeholder?: string;
}

interface ContactFormStepProps {
    onComplete: () => void;
    onNext: () => void;
}

export default function ContactFormStep({ onComplete, onNext }: ContactFormStepProps) {
    const [formData, setFormData] = useState({
        name: 'New Client Inquiry',
        fields: [
            { id: '1', name: 'name', type: 'text' as const, label: 'Full Name', required: true, placeholder: 'Enter your full name' },
            { id: '2', name: 'email', type: 'email' as const, label: 'Email', required: true, placeholder: 'your@email.com' },
            { id: '3', name: 'phone', type: 'phone' as const, label: 'Phone', required: false, placeholder: '+1 (555) 123-4567' },
            { id: '4', name: 'message', type: 'textarea' as const, label: 'Message', required: false, placeholder: 'How can we help you?' },
        ] as FormField[]
    });

    const [generatedLink, setGeneratedLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);

    const fieldTypes = [
        { value: 'text', label: 'Text' },
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone' },
        { value: 'textarea', label: 'Textarea' },
    ];

    const addField = () => {
        const newField: FormField = {
            id: Date.now().toString(),
            name: `field_${formData.fields.length + 1}`,
            type: 'text',
            label: `Field ${formData.fields.length + 1}`,
            required: false,
            placeholder: '',
        };
        setFormData(prev => ({
            ...prev,
            fields: [...prev.fields, newField]
        }));
    };

    const removeField = (id: string) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.filter(field => field.id !== id)
        }));
    };

    const updateField = (id: string, updates: Partial<FormField>) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.map(field =>
                field.id === id ? { ...field, ...updates } : field
            )
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await onboardingApi.createContactForm({
                name: formData.name,
                fields: formData.fields,
            });

            if (response.success && response.data) {
                // Generate the shareable link
                const workspaceSlug = 'wellness-spa'; // This should come from the workspace
                const link = `${window.location.origin}/f/${workspaceSlug}`;
                setGeneratedLink(link);
                onComplete();
            } else {
                setError(response.message || 'Failed to create contact form');
            }
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyLink = async () => {
        const success = await copyToClipboard(generatedLink);
        if (success) {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        }
    };

    if (generatedLink) {
        return (
            <div className="text-center space-y-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">
                    Contact Form Created Successfully!
                </h2>
                <p className="text-gray-600">
                    Your contact form is ready to use. Share this link on your website:
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <LinkIcon className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={generatedLink}
                            readOnly
                            className="flex-1 bg-transparent text-sm text-gray-700 focus:outline-none"
                        />
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                            <Copy className="w-4 h-4" />
                            <span className="text-sm">{linkCopied ? 'Copied!' : 'Copy'}</span>
                        </button>
                    </div>
                </div>

                <p className="text-sm text-gray-500">
                    When customers fill out this form, you&apos;ll automatically receive their information
                    and can respond through your CareOps inbox.
                </p>

                <button
                    onClick={onNext}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                    Continue to Services Setup
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">
                    Create Your Contact Form
                </h2>
                <p className="text-gray-600 mt-2">
                    Build a form for potential customers to reach out to you
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <div className="space-y-6">
                {/* Form Name */}
                <div>
                    <label htmlFor="formName" className="block text-sm font-medium text-gray-700 mb-2">
                        Form Name
                    </label>
                    <input
                        type="text"
                        id="formName"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="New Client Inquiry"
                    />
                </div>

                {/* Form Fields */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Form Fields
                        </label>
                        <button
                            onClick={addField}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm">Add Field</span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.fields.map((field) => (
                            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Field Label
                                        </label>
                                        <input
                                            type="text"
                                            value={field.label}
                                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Field Type
                                        </label>
                                        <select
                                            value={field.type}
                                            onChange={(e) => updateField(field.id, { type: e.target.value as FormField['type'] })}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            {fieldTypes.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Placeholder
                                        </label>
                                        <input
                                            type="text"
                                            value={field.placeholder || ''}
                                            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                className="mr-2"
                                            />
                                            <span className="text-xs font-medium text-gray-700">Required</span>
                                        </label>
                                        {formData.fields.length > 1 && (
                                            <button
                                                onClick={() => removeField(field.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preview */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h4 className="text-xl font-semibold text-gray-900 mb-4">{formData.name}</h4>
                        <div className="space-y-4">
                            {formData.fields.map((field) => (
                                <div key={field.id}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            placeholder={field.placeholder}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                            rows={3}
                                            disabled
                                        />
                                    ) : (
                                        <input
                                            type={field.type === 'phone' ? 'tel' : field.type}
                                            placeholder={field.placeholder}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                            disabled
                                        />
                                    )}
                                </div>
                            ))}
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.name || formData.fields.length === 0}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creating Form...' : 'Save & Generate Link'}
                </button>
            </div>
        </div>
    );
}