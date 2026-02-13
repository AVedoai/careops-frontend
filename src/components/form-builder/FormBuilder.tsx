// components/form-builder/FormBuilder.tsx

'use client';

import React from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core/dist/types';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useFormBuilderStore } from '@/stores/form-builder-store';
import { FieldPalette } from './FieldPalette';
import { FormCanvas } from './FormCanvas';
import { FieldProperties } from './FieldProperties';
import { FormBuilderToolbar } from './FormBuilderToolbar';
import { FormPreviewModal } from './FormPreviewModal';
import { FormSettingsModal } from './FormSettingsModal';
// Ensure all imports are defined
import type { Form } from '@/types/form-builder';

interface FormBuilderProps {
    form?: Partial<Form>;
    onSave: (form: Partial<Form>) => void;
    onPublish?: (form: Partial<Form>) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
    form,
    onSave,
    onPublish
}) => {
    const {
        fields,
        isDragging,
        draggedField,
        previewMode,
        initializeForm,
        addField,
        moveField,
        setDraggedField,
        setIsDragging,
        setPreviewMode
    } = useFormBuilderStore();

    const [showPreview, setShowPreview] = React.useState(false);
    const [showSettings, setShowSettings] = React.useState(false);

    // Initialize form when component mounts or form prop changes
    React.useEffect(() => {
        if (form) {
            initializeForm(form);
        }
    }, [form, initializeForm]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;

        if (active.data.current?.type === 'field-palette') {
            // Dragging from palette
            setDraggedField({
                id: active.id as string,
                type: active.data.current.fieldType,
                label: active.data.current.label,
                fromPalette: true
            });
        } else if (active.data.current?.type === 'form-field') {
            // Dragging existing field
            const field = fields.find(f => f.id === active.id);
            if (field) {
                setDraggedField({
                    id: field.id,
                    type: field.type,
                    label: field.label,
                    fromPalette: false
                });
            }
        }

        setIsDragging(true);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setIsDragging(false);
        setDraggedField(undefined);

        if (!over) return;

        if (active.data.current?.type === 'field-palette' && over.data.current?.type === 'form-canvas') {
            // Adding new field from palette
            const fieldType = active.data.current.fieldType;
            const position = over.data.current.position;
            addField(fieldType, position);
        } else if (active.data.current?.type === 'form-field' && over.data.current?.type === 'form-field') {
            // Reordering existing fields
            const fromIndex = fields.findIndex(f => f.id === active.id);
            const toIndex = fields.findIndex(f => f.id === over.id);

            if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
                moveField(fromIndex, toIndex);
            }
        }
    };

    const handleSave = async () => {
        const formData = {
            ...form,
            fields: fields.sort((a, b) => a.order - b.order)
        };
        await onSave(formData);
    };

    const handlePublish = async () => {
        if (onPublish) {
            const formData = {
                ...form,
                fields: fields.sort((a, b) => a.order - b.order)
            };
            await onPublish(formData);
        }
    };

    const handlePreview = () => {
        setPreviewMode(!previewMode);
    };

    const handleSettings = () => {
        // settings logic will be handled by the parent component
    };

    if (previewMode) {
        return (
            <div className="h-full">
                <FormPreviewModal
                    open={true}
                    onOpenChange={() => setPreviewMode(false)}
                />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-50">
            <FormBuilderToolbar
                onSave={handleSave}
                onPreview={handlePreview}
                onSettings={handleSettings}
            />

            <div className="flex-1 flex overflow-hidden">
                <DndContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {/* Left Sidebar - Field Palette */}
                    <div className="w-64 bg-white border-r border-gray-200 shrink-0">
                        <FieldPalette />
                    </div>

                    {/* Center Canvas - Form Builder */}
                    <div className="flex-1 overflow-auto">
                        <SortableContext
                            items={fields.map(f => f.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <FormCanvas />
                        </SortableContext>
                    </div>

                    {/* Drag Overlay */}
                    <DragOverlay>
                        {isDragging && draggedField ? (
                            <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
                                <div className="text-sm font-medium text-gray-700">
                                    {draggedField.label}
                                </div>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                {/* Right Sidebar - Field Properties */}
                <div className="w-80 bg-white border-l border-gray-200 shrink-0">
                    <FieldProperties />
                </div>
            </div>

            {/* Modals */}
            <FormPreviewModal
                open={showPreview}
                onOpenChange={setShowPreview}
            />

            <FormSettingsModal
                open={showSettings}
                onOpenChange={setShowSettings}
            />
        </div>
    );
};