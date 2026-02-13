// components/form-builder/SortableFormField.tsx

'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFormBuilderStore } from '../../stores/form-builder-store';
import { cn } from '@/lib/utils';
import { FieldRenderer } from './FieldRenderer';
import { FieldToolbar } from './FieldToolbar';
import type { FormField } from '../../types/form-builder';
import * as Icons from 'lucide-react';

interface SortableFormFieldProps {
    field: FormField;
    isSelected: boolean;
    index: number;
}

export const SortableFormField: React.FC<SortableFormFieldProps> = ({
    field,
    isSelected,
    index
}) => {
    const { selectField, removeField, duplicateField } = useFormBuilderStore();
    const [showToolbar, setShowToolbar] = React.useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: field.id,
        data: {
            type: 'form-field',
            field
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectField(field.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeField(field.id);
    };

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        duplicateField(field.id);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative group border-2 border-transparent rounded-lg transition-all duration-200",
                isSelected && "border-blue-500 bg-blue-50",
                !isSelected && "hover:border-gray-300",
                isDragging && "opacity-50 scale-95 z-50"
            )}
            onMouseEnter={() => setShowToolbar(true)}
            onMouseLeave={() => setShowToolbar(false)}
            onClick={handleClick}
        >
            {/* Field Content */}
            <div className="relative bg-white rounded-lg border border-gray-200 p-4">
                {/* Drag Handle */}
                <div
                    {...listeners}
                    {...attributes}
                    className={cn(
                        "absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing",
                        isSelected && "opacity-100"
                    )}
                >
                    <Icons.GripVertical className="w-4 h-4 text-gray-400" />
                </div>

                {/* Field Number */}
                <div className="absolute top-2 right-2 text-xs text-gray-400 font-medium">
                    {index + 1}
                </div>

                {/* Required Indicator */}
                {field.required && (
                    <div className="absolute top-2 right-8 text-red-500 text-sm">*</div>
                )}

                {/* Field Content */}
                <div className="pt-2">
                    <FieldRenderer field={field} preview={true} />
                </div>

                {/* Field Info */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <span className="capitalize">{field.type}</span>
                            {field.required && <span className="text-red-500">Required</span>}
                            {field.validation.length > 0 && (
                                <span className="text-blue-500">Validated</span>
                            )}
                        </div>
                        <div className="text-gray-400">ID: {field.id.slice(-6)}</div>
                    </div>
                </div>
            </div>

            {/* Field Toolbar */}
            {(showToolbar || isSelected) && (
                <FieldToolbar
                    fieldId={field.id}
                    onEdit={() => selectField(field.id)}
                />
            )}

            {/* Selection Overlay */}
            {isSelected && (
                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                    <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Selected
                    </div>
                </div>
            )}
        </div>
    );
};