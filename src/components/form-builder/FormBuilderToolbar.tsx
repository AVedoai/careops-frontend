'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Eye, Settings, Undo, Redo, Trash2 } from 'lucide-react';
import { useFormBuilderStore } from '@/stores/form-builder-store';

interface FormBuilderToolbarProps {
    onSave: () => void;
    onPreview: () => void;
    onSettings: () => void;
}

export function FormBuilderToolbar({
    onSave,
    onPreview,
    onSettings
}: FormBuilderToolbarProps) {
    const {
        hasUnsavedChanges,
        isLoading,
        fields,
        resetForm
    } = useFormBuilderStore();

    return (
        <div className="flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold">Form Builder</h1>
                {hasUnsavedChanges && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                        Unsaved changes
                    </span>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    onClick={onSave}
                    disabled={isLoading || !hasUnsavedChanges}
                    className="flex items-center space-x-1"
                >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                </Button>

                <Button
                    onClick={onPreview}
                    variant="outline"
                    disabled={fields.length === 0}
                    className="flex items-center space-x-1"
                >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                </Button>

                <Button
                    onClick={onSettings}
                    variant="outline"
                    className="flex items-center space-x-1"
                >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                </Button>

                <div className="h-4 w-px bg-gray-300" />

                <Button
                    onClick={resetForm}
                    variant="outline"
                    disabled={fields.length === 0}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear</span>
                </Button>
            </div>
        </div>
    );
}