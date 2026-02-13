// components/form-builder/FieldPalette.tsx

'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { FIELD_PALETTE } from "../../types/form-builder";
import * as Icons from 'lucide-react';

interface DraggableFieldProps {
    fieldType: string;
    label: string;
    icon: string;
    description: string;
}

const DraggableField: React.FC<DraggableFieldProps> = ({
    fieldType,
    label,
    icon,
    description
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging
    } = useDraggable({
        id: `palette-${fieldType}`,
        data: {
            type: 'field-palette',
            fieldType,
            label
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    // Get the icon component
    const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[icon] || Icons.Square;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-grab transition-all",
                "hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm",
                "active:cursor-grabbing",
                isDragging && "opacity-50 scale-95"
            )}
        >
            <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
                <IconComponent className="w-4 h-4 text-gray-600" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{label}</div>
                <div className="text-xs text-gray-500 truncate">{description}</div>
            </div>
        </div>
    );
};

interface FieldCategoryProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const FieldCategory: React.FC<FieldCategoryProps> = ({
    title,
    children,
    defaultOpen = true
}) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    return (
        <div className="border-b border-gray-100">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
            >
                {title}
                <Icons.ChevronDown
                    className={cn(
                        "w-4 h-4 transition-transform",
                        isOpen && "transform rotate-180"
                    )}
                />
            </button>

            {isOpen && (
                <div className="px-4 pb-4 space-y-2">
                    {children}
                </div>
            )}
        </div>
    );
};

export const FieldPalette: React.FC = () => {
    // Group fields by category
    const basicFields = FIELD_PALETTE.filter(f => f.category === 'basic');
    const advancedFields = FIELD_PALETTE.filter(f => f.category === 'advanced');
    const layoutFields = FIELD_PALETTE.filter(f => f.category === 'layout');

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Form Fields</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Drag fields to add them to your form
                </p>
            </div>

            <div className="flex-1 overflow-y-auto">
                <FieldCategory title="Basic Fields" defaultOpen={true}>
                    {basicFields.map((field) => (
                        <DraggableField
                            key={field.type}
                            fieldType={field.type}
                            label={field.label}
                            icon={field.icon}
                            description={field.description}
                        />
                    ))}
                </FieldCategory>

                <FieldCategory title="Advanced Fields" defaultOpen={false}>
                    {advancedFields.map((field) => (
                        <DraggableField
                            key={field.type}
                            fieldType={field.type}
                            label={field.label}
                            icon={field.icon}
                            description={field.description}
                        />
                    ))}
                </FieldCategory>

                <FieldCategory title="Layout" defaultOpen={false}>
                    {layoutFields.map((field) => (
                        <DraggableField
                            key={field.type}
                            fieldType={field.type}
                            label={field.label}
                            icon={field.icon}
                            description={field.description}
                        />
                    ))}
                </FieldCategory>
            </div>

            {/* Quick Add Buttons */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="text-xs font-medium text-gray-700 mb-2">Quick Add</div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            // Add text field directly without drag
                            // This could integrate with your form builder store
                        }}
                        className="flex-1 px-3 py-2 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50"
                    >
                        Text
                    </button>
                    <button
                        onClick={() => {
                            // Add email field directly
                        }}
                        className="flex-1 px-3 py-2 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50"
                    >
                        Email
                    </button>
                </div>
            </div>
        </div>
    );
};