/* eslint-disable @typescript-eslint/no-explicit-any */
// components/form-builder/FieldRenderer.tsx

'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import type { FormField } from '@/types/form-builder';
import { FieldType } from '@/types/form-builder';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldRendererProps {
    field: FormField;
    value?: unknown;
    onChange?: (value: unknown) => void;
    error?: string;
    disabled?: boolean;
    preview?: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
    field,
    value,
    onChange,
    error,
    disabled = false,
    preview = false
}) => {
    const baseClasses = "w-full";
    const errorClasses = error ? "border-red-500 focus:border-red-500" : "";

    const renderField = () => {
        switch (field.type) {
            case FieldType.TEXT:
                return (
                    <Input
                        type="text"
                        placeholder={field.placeholder || 'Enter text...'}
                        value={String(value || '')}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={disabled || preview}
                        className={cn(baseClasses, errorClasses)}
                    />
                );

            case FieldType.EMAIL:
                return (
                    <Input
                        type="email"
                        placeholder={field.placeholder || 'Enter email address...'}
                        value={String(value || '')}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={disabled || preview}
                        className={cn(baseClasses, errorClasses)}
                    />
                );

            case FieldType.PHONE:
                return (
                    <Input
                        type="tel"
                        placeholder={field.placeholder || 'Enter phone number...'}
                        value={String(value || '')}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={disabled || preview}
                        className={cn(baseClasses, errorClasses)}
                    />
                );

            case FieldType.TEXTAREA:
                return (
                    <Textarea
                        placeholder={field.placeholder || 'Enter your message...'}
                        value={String(value || '')}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={disabled || preview}
                        rows={Number(field.properties?.rows) || 4}
                        className={cn(baseClasses, errorClasses)}
                    />
                );

            case FieldType.NUMBER:
                return (
                    <Input
                        type="number"
                        placeholder={field.placeholder || 'Enter number...'}
                        value={String(value || '')}
                        onChange={(e) => onChange?.(Number(e.target.value))}
                        disabled={disabled || preview}
                        min={field.properties?.min as string | number | undefined}
                        max={field.properties?.max as string | number | undefined}
                        step={field.properties?.step as string | number | undefined}
                        className={cn(baseClasses, errorClasses)}
                    />
                );

            case FieldType.DATE:
                return (
                    <Input
                        type="date"
                        value={String(value || '')}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={disabled || preview}
                        min={field.properties?.minDate as string | number | undefined}
                        max={field.properties?.maxDate as string | number | undefined}
                        className={cn(baseClasses, errorClasses)}
                    />
                );

            case FieldType.TIME:
                return (
                    <Input
                        type="time"
                        value={String(value || '')}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={disabled || preview}
                        className={cn(baseClasses, errorClasses)}
                    />
                );

            case FieldType.SELECT:
                return (
                    <Select
                        value={String(value || '')}
                        onValueChange={(val) => onChange?.(val)}
                        disabled={disabled || preview}
                    >
                        <SelectTrigger className={cn(baseClasses, errorClasses)}>
                            <SelectValue placeholder="Select an option..." />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options.map((option, index) => (
                                <SelectItem key={index} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case FieldType.RADIO:
                return (
                    <RadioGroup
                        value={String(value || '')}
                        onValueChange={(val) => onChange?.(val)}
                        disabled={disabled || preview}
                        className="space-y-2"
                    >
                        {field.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );

            case FieldType.CHECKBOX:
                const checkboxValue = Array.isArray(value) ? value : [];
                return (
                    <div className="space-y-2">
                        {field.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${field.id}-${index}`}
                                    checked={checkboxValue.includes(option)}
                                    onCheckedChange={(checked) => {
                                        if (onChange) {
                                            const newValue = checked
                                                ? [...checkboxValue, option]
                                                : checkboxValue.filter(v => v !== option);
                                            onChange(newValue);
                                        }
                                    }}
                                    disabled={disabled || preview}
                                />
                                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                            </div>
                        ))}
                    </div>
                );

            case FieldType.FILE:
                return (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Icons.Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">
                            {preview ? 'File upload area' : 'Drag files here or click to browse'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {(field.properties as any)?.accept || 'All file types accepted'}
                        </div>
                        {!preview && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                disabled={disabled}
                            >
                                Choose Files
                            </Button>
                        )}
                    </div>
                );

            case FieldType.SIGNATURE:
                return (
                    <div className="border border-gray-300 rounded-lg">
                        <div
                            className="bg-white rounded-lg flex items-center justify-center text-gray-500"
                            style={{
                                width: (field.properties as any)?.width || 400,
                                height: (field.properties as any)?.height || 200
                            }}
                        >
                            {preview ? (
                                <div className="text-center">
                                    <Icons.Edit className="w-8 h-8 mx-auto mb-2" />
                                    <div className="text-sm">Signature area</div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Icons.PenTool className="w-8 h-8 mx-auto mb-2" />
                                    <div className="text-sm">Sign here</div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case FieldType.RATING:
                const max = field.properties?.max || 5;
                const icon = field.properties?.icon || 'star';
                const ratingValue = value || 0;

                return (
                    <div className="flex items-center space-x-1">
                        {Array.from({ length: (field.properties as any)?.max || 5 }).map((_, index) => {
                            const filled = index < Number(ratingValue || 0);
                            const IconComponent = icon === 'star' ? Icons.Star :
                                icon === 'heart' ? Icons.Heart :
                                    Icons.ThumbsUp;

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => !preview && !disabled && onChange?.(index + 1)}
                                    disabled={disabled || preview}
                                    className={cn(
                                        "p-1 rounded transition-colors",
                                        filled ? "text-yellow-400" : "text-gray-300",
                                        !preview && !disabled && "hover:text-yellow-300"
                                    )}
                                >
                                    <IconComponent
                                        className="w-6 h-6"
                                        fill={filled ? "currentColor" : "none"}
                                    />
                                </button>
                            );
                        })}
                        {!preview && (
                            <span className="ml-2 text-sm text-gray-600">
                                {String(ratingValue || 0)} of {String((field.properties as any)?.max || 5)}
                            </span>
                        )}
                    </div>
                );

            case FieldType.SECTION:
                return (
                    <div className="py-4">
                        <div className="border-b border-gray-200 pb-2">
                            <h3 className="text-lg font-medium text-gray-900">{field.label}</h3>
                            {(field.properties as any)?.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {(field.properties as any).description}
                                </p>
                            )}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="p-4 bg-gray-100 rounded border-2 border-dashed border-gray-300">
                        <div className="text-center text-gray-500">
                            <Icons.AlertCircle className="w-8 h-8 mx-auto mb-2" />
                            <div className="text-sm">Unknown field type: {field.type}</div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-2">
            {/* Field Label */}
            {field.type !== FieldType.SECTION && (
                <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}

            {/* Help Text */}
            {field.helpText && (
                <div className="text-xs text-gray-500">{field.helpText}</div>
            )}

            {/* Field Input */}
            {renderField()}

            {/* Error Message */}
            {error && (
                <div className="text-xs text-red-500 flex items-center gap-1">
                    <Icons.AlertCircle className="w-3 h-3" />
                    {error}
                </div>
            )}
        </div>
    );
};