'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useFormBuilderStore } from '@/stores/form-builder-store';

interface FormSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FormSettingsModal({ open, onOpenChange }: FormSettingsModalProps) {
    const { form, updateForm } = useFormBuilderStore();

    const [localForm, setLocalForm] = useState({
        name: form.name || '',
        description: form.description || '',
        settings: {
            thankYouMessage: form.settings?.thankYouMessage || 'Thank you for your submission!',
            allowMultipleSubmissions: form.settings?.allowMultipleSubmissions || false,
            requireEmail: form.settings?.requireEmail || false,
            enableCaptcha: form.settings?.enableCaptcha || false,
            notifications: form.settings?.notifications || { email: false, emailTo: '' },
            redirect: form.settings?.redirect || { enabled: false, url: '' }
        }
    });

    const handleSave = () => {
        updateForm({
            name: localForm.name,
            description: localForm.description,
            settings: localForm.settings
        });
        onOpenChange(false);
    };

    const handleCancel = () => {
        // Reset to original values
        setLocalForm({
            name: form.name || '',
            description: form.description || '',
            settings: {
                thankYouMessage: form.settings?.thankYouMessage || 'Thank you for your submission!',
                allowMultipleSubmissions: form.settings?.allowMultipleSubmissions || false,
                requireEmail: form.settings?.requireEmail || false,
                enableCaptcha: form.settings?.enableCaptcha || false,
                notifications: form.settings?.notifications || { email: false, emailTo: '' },
                redirect: form.settings?.redirect || { enabled: false, url: '' }
            }
        });
        onOpenChange(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden z-50">
                    <div className="flex items-center justify-between p-6 border-b">
                        <Dialog.Title className="text-lg font-semibold">
                            Form Settings
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <Button variant="outline" size="sm" onClick={handleCancel}>
                                <X className="w-4 h-4" />
                            </Button>
                        </Dialog.Close>
                    </div>

                    <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-160px)]">
                        <div>
                            <Label htmlFor="form-title">Form Title</Label>
                            <Input
                                id="form-title"
                                value={String(localForm.name || '')}
                                onChange={(e) => setLocalForm({ ...localForm, name: e.target.value })}
                                placeholder="Enter form title"
                            />
                        </div>

                        <div>
                            <Label htmlFor="form-description">Form Description</Label>
                            <Textarea
                                id="form-description"
                                value={String(localForm.description || '')}
                                onChange={(e) => setLocalForm({ ...localForm, description: e.target.value })}
                                placeholder="Enter form description"
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="success-message">Thank You Message</Label>
                            <Textarea
                                id="success-message"
                                value={String(localForm.settings.thankYouMessage || '')}
                                onChange={(e) => setLocalForm({
                                    ...localForm,
                                    settings: { ...localForm.settings, thankYouMessage: e.target.value }
                                })}
                                placeholder="Message shown after successful submission"
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label htmlFor="notification-email">Notification Email</Label>
                            <Input
                                id="notification-email"
                                type="email"
                                value={String(localForm.settings.notifications?.emailTo || '')}
                                onChange={(e) => setLocalForm({
                                    ...localForm,
                                    settings: {
                                        ...localForm.settings,
                                        notifications: { ...localForm.settings.notifications, emailTo: e.target.value }
                                    }
                                })}
                                placeholder="Email to receive notifications"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="require-email"
                                    checked={localForm.settings.requireEmail}
                                    onChange={(e) => setLocalForm({
                                        ...localForm,
                                        settings: { ...localForm.settings, requireEmail: e.target.checked }
                                    })}
                                    className="rounded"
                                />
                                <Label htmlFor="require-email">Require email</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="multiple-submissions"
                                    checked={localForm.settings.allowMultipleSubmissions}
                                    onChange={(e) => setLocalForm({
                                        ...localForm,
                                        settings: { ...localForm.settings, allowMultipleSubmissions: e.target.checked }
                                    })}
                                    className="rounded"
                                />
                                <Label htmlFor="multiple-submissions">Allow multiple submissions</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="enable-captcha"
                                    checked={localForm.settings.enableCaptcha}
                                    onChange={(e) => setLocalForm({
                                        ...localForm,
                                        settings: { ...localForm.settings, enableCaptcha: e.target.checked }
                                    })}
                                    className="rounded"
                                />
                                <Label htmlFor="enable-captcha">Enable CAPTCHA</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="enable-redirect"
                                    checked={localForm.settings.redirect?.enabled || false}
                                    onChange={(e) => setLocalForm({
                                        ...localForm,
                                        settings: {
                                            ...localForm.settings,
                                            redirect: { ...localForm.settings.redirect, enabled: e.target.checked }
                                        }
                                    })}
                                    className="rounded"
                                />
                                <Label htmlFor="enable-redirect">Redirect after submission</Label>
                            </div>

                            {localForm.settings.redirect?.enabled && (
                                <div className="ml-6">
                                    <Label htmlFor="redirect-url">Redirect URL</Label>
                                    <Input
                                        id="redirect-url"
                                        type="url"
                                        value={String(localForm.settings.redirect?.url || '')}
                                        onChange={(e) => setLocalForm({
                                            ...localForm,
                                            settings: {
                                                ...localForm.settings,
                                                redirect: { ...localForm.settings.redirect, url: e.target.value }
                                            }
                                        })}
                                        placeholder="https://example.com"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 p-6 border-t">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            Save Settings
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}