'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useFormBuilderStore } from '@/stores/form-builder-store';
import { FieldRenderer } from './FieldRenderer';

interface FormPreviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FormPreviewModal({ open, onOpenChange }: FormPreviewModalProps) {
    const { form, fields } = useFormBuilderStore();

    const sortedFields = fields.sort((a, b) => a.order - b.order);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden z-50">
                    <div className="flex items-center justify-between p-6 border-b">
                        <Dialog.Title className="text-lg font-semibold">
                            Form Preview
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <Button variant="outline" size="sm">
                                <X className="w-4 h-4" />
                            </Button>
                        </Dialog.Close>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        <div className="space-y-6">
                            {form.name && (
                                <h1 className="text-2xl font-bold">{form.name}</h1>
                            )}

                            {form.description && (
                                <p className="text-gray-600">{form.description}</p>
                            )}

                            <form className="space-y-6">
                                {sortedFields.map((field) => (
                                    <div key={field.id} className="space-y-2">
                                        <FieldRenderer
                                            field={field}
                                            value={''}
                                            onChange={() => { }}
                                            preview={true}
                                        />
                                    </div>
                                ))}

                                {fields.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        No fields to preview. Add some fields to see the preview.
                                    </div>
                                )}

                                {fields.length > 0 && (
                                    <Button type="button" className="w-full">
                                        Submit (Preview)
                                    </Button>
                                )}
                            </form>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}