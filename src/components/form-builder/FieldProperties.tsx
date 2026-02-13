'use client';

import React from 'react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { useFormBuilderStore } from '../../stores/form-builder-store';
import type { FormField } from '../../types/form-builder';

export function FieldProperties() {
    const {
        selectedFieldId,
        fields,
        updateField,
        removeField
    } = useFormBuilderStore();

    const selectedField = selectedFieldId
        ? fields.find(f => f.id === selectedFieldId)
        : null;

    if (!selectedField) {
        return (
            <div className="p-4 text-center text-gray-500">
                Select a field to edit its properties
            </div>
        );
    }

    const handleFieldUpdate = (updates: Partial<FormField>) => {
        if (selectedFieldId) {
            updateField(selectedFieldId, updates);
        }
    };

    const handleAddOption = () => {
        if (selectedField) {
            const currentOptions = selectedField.options || [];
            const newOptions = [...currentOptions, ''];
            handleFieldUpdate({ options: newOptions });
        }
    };

    const handleRemoveOption = (index: number) => {
        if (selectedField) {
            const currentOptions = selectedField.options || [];
            const newOptions = currentOptions.filter((_, i) => i !== index);
            handleFieldUpdate({ options: newOptions });
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        if (selectedField && selectedField.options) {
            const newOptions = [...selectedField.options];
            newOptions[index] = value;
            handleFieldUpdate({ options: newOptions });
        }
    };

    const showOptions = ['SELECT', 'RADIO', 'CHECKBOX'].includes(selectedField.type);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Field Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="field-label">Label</Label>
                    <Input
                        id="field-label"
                        value={selectedField.label || ''}
                        onChange={(e) => handleFieldUpdate({ label: e.target.value })}
                        placeholder="Field label"
                    />
                </div>

                <div>
                    <Label htmlFor="field-placeholder">Placeholder</Label>
                    <Input
                        id="field-placeholder"
                        value={selectedField.placeholder || ''}
                        onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
                        placeholder="Placeholder text"
                    />
                </div>

                <div>
                    <Label htmlFor="field-description">Help Text</Label>
                    <Input
                        id="field-description"
                        value={selectedField.helpText || ''}
                        onChange={(e) => handleFieldUpdate({ helpText: e.target.value })}
                        placeholder="Field help text"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="field-required"
                        checked={selectedField.required || false}
                        onChange={(e) => handleFieldUpdate({ required: e.target.checked })}
                        className="rounded"
                    />
                    <Label htmlFor="field-required">Required</Label>
                </div>

                {showOptions && (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label>Options</Label>
                            <Button onClick={handleAddOption} size="sm" variant="outline">
                                <Plus className="w-4 h-4 mr-1" />
                                Add Option
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {(selectedField.options || []).map((option, index) => (
                                <div key={index} className="flex space-x-2">
                                    <Input
                                        placeholder="Option text"
                                        value={String(option || '')}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={() => handleRemoveOption(index)}
                                        size="sm"
                                        variant="outline"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <Button
                        onClick={() => selectedFieldId && removeField(selectedFieldId)}
                        variant="destructive"
                        className="w-full"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Field
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}