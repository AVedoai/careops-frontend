/* eslint-disable @typescript-eslint/no-explicit-any */
// app/f/[shareId]/page.tsx

'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PublicFormAPI } from '@/lib/api/form-builder';
import { FieldRenderer } from '@/components/form-builder/FieldRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { PublicForm } from '@/types/form-builder';
import { useForm } from 'react-hook-form';
import { Loader2, CheckCircle } from 'lucide-react';

export default function PublicFormPage() {
    const params = useParams();
    const shareId = params.shareId as string;

    const [form, setForm] = React.useState<PublicForm | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const { handleSubmit, setValue, watch } = useForm();

    // Load form data
    React.useEffect(() => {
        const loadForm = async () => {
            try {
                // Track form view
                await PublicFormAPI.trackFormView(shareId);

                // Load form
                const formData = await PublicFormAPI.getPublicForm(shareId);
                setForm(formData);
            } catch (error) {
                console.error('Error loading form:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (shareId) {
            loadForm();
        }
    }, [shareId]);

    const onSubmit = async (data: Record<string, unknown>) => {
        if (!form) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            // Transform form data to match API expectations
            const submissionData = {
                submittedData: data,
                submitterEmail: data.email as string | undefined,
                submitterName: (data.name || data.full_name) as string | undefined,
                submitterPhone: data.phone as string | undefined
            };

            await PublicFormAPI.submitForm(shareId, submissionData);
            setIsSubmitted(true);
        } catch (error: unknown) {
            console.error('Error submitting form:', error);
            if ((error as any).response?.data?.errors) {
                setErrors((error as any).response.data.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                    <div className="text-gray-600 mt-2">Loading form...</div>
                </div>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="text-gray-600">
                        Form not found or no longer available.
                    </div>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="max-w-md mx-auto">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Thank you!
                            </h2>
                            <p className="text-gray-600">
                                {form.settings?.thankYouMessage || 'Your form has been submitted successfully.'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const orderedFields = form.fields.sort((a, b) => a.order - b.order);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Form Header */}
                <div className="text-center mb-8">
                    {form.workspaceName && (
                        <div className="text-sm text-gray-500 mb-2">{form.workspaceName}</div>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.name}</h1>
                    {form.description && (
                        <p className="text-gray-600">{form.description}</p>
                    )}
                </div>

                {/* Form */}
                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {orderedFields.map((field) => (
                                <div key={field.id}>
                                    <FieldRenderer
                                        field={field}
                                        value={watch(field.id)}
                                        onChange={(value) => setValue(field.id, value)}
                                        error={errors[field.id]}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            ))}

                            <div className="pt-4 border-t border-gray-200">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                    size="lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Form'
                                    )}
                                </Button>
                            </div>

                            {/* Form Footer */}
                            <div className="text-center text-xs text-gray-500">
                                This form is powered by CareOps
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}