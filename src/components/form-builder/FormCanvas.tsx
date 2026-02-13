// components/form-builder/FormCanvas.tsx

'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useFormBuilderStore, useFormBuilderSelectors } from '../../stores/form-builder-store';
import { SortableFormField } from './SortableFormField';
import { EmptyFormState } from './EmptyFormState';
import { cn } from '@/lib/utils';

interface DropZoneProps {
    position: number;
    children?: React.ReactNode;
}

const DropZone: React.FC<DropZoneProps> = ({ position, children }) => {
    const { isDragging } = useFormBuilderStore();
    const { setNodeRef, isOver } = useDroppable({
        id: `drop-zone-${position}`,
        data: {
            type: 'form-canvas',
            position
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "relative transition-all duration-200",
                isDragging && "min-h-15",
                isOver && isDragging && "bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg"
            )}
        >
            {children}
            {isDragging && isOver && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-sm text-blue-600 font-medium">
                        Drop field here
                    </div>
                </div>
            )}
        </div>
    );
};

export const FormCanvas: React.FC = () => {
    const { selectedFieldId } = useFormBuilderStore();
    const { orderedFields } = useFormBuilderSelectors();

    const { setNodeRef } = useDroppable({
        id: 'form-canvas',
        data: {
            type: 'form-canvas',
            position: orderedFields.length
        }
    });

    if (orderedFields.length === 0) {
        return (
            <div ref={setNodeRef} className="h-full">
                <EmptyFormState />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-white">
            {/* Form Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
                <div className="max-w-2xl">
                    <div className="text-lg font-semibold text-gray-900">Form Preview</div>
                    <div className="text-sm text-gray-500 mt-1">
                        Drag fields to reorder • Click to edit • {orderedFields.length} fields
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div ref={setNodeRef} className="px-6 py-6">
                <div className="max-w-2xl mx-auto space-y-4">
                    <SortableContext
                        items={orderedFields.map(f => f.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {orderedFields.map((field, index) => (
                            <React.Fragment key={field.id}>
                                <DropZone position={index}>
                                    <SortableFormField
                                        field={field}
                                        isSelected={selectedFieldId === field.id}
                                        index={index}
                                    />
                                </DropZone>
                            </React.Fragment>
                        ))}
                    </SortableContext>

                    {/* Final drop zone */}
                    <DropZone position={orderedFields.length} />
                </div>
            </div>

            {/* Form Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="max-w-2xl mx-auto">
                    <button
                        type="button"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        disabled
                    >
                        Submit Form
                    </button>
                    <div className="text-xs text-gray-500 mt-2">
                        Preview only - form submission is disabled
                    </div>
                </div>
            </div>
        </div>
    );
};