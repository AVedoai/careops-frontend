'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Settings } from 'lucide-react';
import { useFormBuilderStore } from '@/stores/form-builder-store';

interface FieldToolbarProps {
    fieldId: string;
    onEdit?: () => void;
}

export function FieldToolbar({ fieldId, onEdit }: FieldToolbarProps) {
    const {
        duplicateField,
        removeField,
        selectField
    } = useFormBuilderStore();

    const handleDuplicate = () => {
        duplicateField(fieldId);
    };

    const handleDelete = () => {
        removeField(fieldId);
    };

    const handleEdit = () => {
        selectField(fieldId);
        if (onEdit) {
            onEdit();
        }
    };

    return (
        <div className="flex items-center space-x-1 bg-white border rounded-md p-1 shadow-sm">
            <Button
                onClick={handleEdit}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                title="Edit field"
            >
                <Settings className="h-3 w-3" />
            </Button>

            <Button
                onClick={handleDuplicate}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                title="Duplicate field"
            >
                <Copy className="h-3 w-3" />
            </Button>

            <Button
                onClick={handleDelete}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                title="Delete field"
            >
                <Trash2 className="h-3 w-3" />
            </Button>
        </div>
    );
}