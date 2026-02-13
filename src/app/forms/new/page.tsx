/* eslint-disable @typescript-eslint/no-explicit-any */
// app/forms/new/page.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/form-builder/FormBuilder';
import { FormBuilderAPI } from '@/lib/api/form-builder';
import type { Form } from '@/types/form-builder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Eye, Share, Settings } from 'lucide-react';

export default function NewFormPage() {
    const router = useRouter();
    const [form, setForm] = React.useState<Partial<Form>>({
        name: 'Untitled Form',
        description: '',
        type: 'CUSTOM' as any
    });
    const [isSaving, setIsSaving] = React.useState(false);
    const [isPublishing, setIsPublishing] = React.useState(false);
    const [formId, setFormId] = React.useState<number | null>(null);

    const handleSave = async (formData: Partial<Form>) => {
        setIsSaving(true);
        try {
            let savedForm: Form;

            if (formId) {
                // Update existing form
                savedForm = await FormBuilderAPI.updateForm(formId, {
                    ...formData,
                    fields: formData.fields as any[],
                    settings: formData.settings as unknown as Record<string, unknown>
                });
            } else {
                // Create new form
                savedForm = await FormBuilderAPI.createCustomForm({
                    name: formData.name || 'Untitled Form',
                    description: formData.description,
                    fields: formData.fields as any[],
                    settings: formData.settings as unknown as Record<string, unknown>
                });
                setFormId(savedForm.id);
            }

            setForm(savedForm);
            console.log('Form saved successfully!');
        } catch (error) {
            console.error('Error saving form:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async (formData: Partial<Form>) => {
        if (!formId) {
            // Save first if not saved
            await handleSave(formData);
            return;
        }

        setIsPublishing(true);
        try {
            const publishedForm = await FormBuilderAPI.publishForm(formId);
            setForm(publishedForm);
            console.log('Form published successfully!');
        } catch (error) {
            console.error('Error publishing form:', error);
        } finally {
            setIsPublishing(false);
        }
    };

    const handlePreview = () => {
        // Implement preview logic
        console.log('Preview form');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/forms')}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Forms
                            </Button>

                            <div className="h-6 border-l border-gray-300" />

                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    {form.name || 'Untitled Form'}
                                </h1>
                                <div className="text-sm text-gray-500 mt-1">
                                    {form.isPublished ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Published
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            Draft
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Button variant="outline" size="sm" onClick={handlePreview}>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isSaving}
                                onClick={() => handleSave(form)}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>

                            <Button
                                size="sm"
                                disabled={isPublishing}
                                onClick={() => handlePublish(form)}
                            >
                                <Share className="w-4 h-4 mr-2" />
                                {isPublishing ? 'Publishing...' : form.isPublished ? 'Update' : 'Publish'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Builder */}
            <div className="flex-1" style={{ height: 'calc(100vh - 80px)' }}>
                <FormBuilder
                    form={form}
                    onSave={handleSave}
                    onPublish={handlePublish}
                />
            </div>
        </div>
    );
}