// components/form-builder/EmptyFormState.tsx

'use client';

import React from 'react';
import { useFormBuilderStore } from '../../stores/form-builder-store';
import { FieldType } from '../../types/form-builder';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/button';

export const EmptyFormState: React.FC = () => {
    const { addField } = useFormBuilderStore();

    const quickStartFields = [
        { type: FieldType.TEXT, label: 'Name', icon: Icons.Type },
        { type: FieldType.EMAIL, label: 'Email', icon: Icons.Mail },
        { type: FieldType.PHONE, label: 'Phone', icon: Icons.Phone },
        { type: FieldType.TEXTAREA, label: 'Message', icon: Icons.AlignLeft }
    ];

    return (
        <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto px-6">
                {/* Empty State Icon */}
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icons.FileText className="w-12 h-12 text-blue-600" />
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Start Building Your Form
                </h3>
                <p className="text-gray-600 mb-8">
                    Drag fields from the left panel or use the quick start options below to begin creating your form.
                </p>

                {/* Quick Start Options */}
                <div className="space-y-4">
                    <div className="text-sm font-medium text-gray-700 mb-3">
                        Quick Start
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {quickStartFields.map((field) => {
                            const IconComponent = field.icon;
                            return (
                                <Button
                                    key={field.type}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addField(field.type)}
                                    className="flex items-center gap-2 p-3 h-auto"
                                >
                                    <IconComponent className="w-4 h-4" />
                                    <span className="text-xs">{field.label}</span>
                                </Button>
                            );
                        })}
                    </div>

                    {/* Helpful Tips */}
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">
                            💡 Pro Tips
                        </h4>
                        <ul className="text-xs text-blue-800 space-y-1">
                            <li>• Drag fields from the palette to add them</li>
                            <li>• Click on any field to edit its properties</li>
                            <li>• Use the preview button to see how users will see it</li>
                            <li>• Don&apos;t forget to publish when you&apos;re ready!</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};