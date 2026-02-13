'use client';

import { useState } from 'react';
import { File, CheckCircle, X } from 'lucide-react';
import { formsApi } from '../../lib/api';
import { getErrorMessage } from '../../lib/utils';

interface FormsStepProps {
    onComplete: () => void;
    onNext: () => void;
}

export default function FormsStep({ onComplete, onNext }: FormsStepProps) {
    const [uploadedForms, setUploadedForms] = useState<{
        id: string;
        name: string;
        file?: File;
        uploaded: boolean;
    }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileUpload = async (name: string, file: File) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await formsApi.uploadDocument(file, name);
            if (response.success) {
                setUploadedForms(prev =>
                    prev.map(form =>
                        form.name === name
                            ? { ...form, file, uploaded: true }
                            : form
                    )
                );
            } else {
                setError(response.message || 'Failed to upload form');
            }
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const addForm = (name: string) => {
        if (!uploadedForms.find(form => form.name === name)) {
            setUploadedForms(prev => [...prev, {
                id: Date.now().toString(),
                name,
                uploaded: false,
            }]);
        }
    };

    const removeForm = (id: string) => {
        setUploadedForms(prev => prev.filter(form => form.id !== id));
    };

    const handleContinue = () => {
        onComplete();
        onNext();
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <File className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">
                    Upload Required Forms
                </h2>
                <p className="text-gray-600 mt-2">
                    Add forms that customers need to complete before their appointment (optional)
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Quick Add Forms */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => addForm('Health Intake Form')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                    <div className="text-center">
                        <File className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">Health Intake Form</p>
                    </div>
                </button>

                <button
                    onClick={() => addForm('Liability Waiver')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                    <div className="text-center">
                        <File className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">Liability Waiver</p>
                    </div>
                </button>
            </div>

            {/* Uploaded Forms */}
            {uploadedForms.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Your Forms</h3>
                    {uploadedForms.map((form) => (
                        <div key={form.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{form.name}</h4>
                                    {form.uploaded ? (
                                        <div className="flex items-center text-green-600 text-sm mt-1">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Uploaded successfully
                                        </div>
                                    ) : (
                                        <div className="mt-2">
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleFileUpload(form.name, file);
                                                    }
                                                }}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeForm(form.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Upload PDF or Word documents</li>
                    <li>• Forms are automatically sent to customers when they book</li>
                    <li>• You&apos;ll be notified when forms are completed</li>
                    <li>• Track completion status on your dashboard</li>
                </ul>
            </div>

            <div className="pt-6">
                <button
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {uploadedForms.length > 0 ? 'Continue with Forms' : 'Skip Forms Setup'}
                </button>
            </div>
        </div>
    );
}