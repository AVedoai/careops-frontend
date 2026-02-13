'use client';

import { Rocket, CheckCircle, X, AlertTriangle } from 'lucide-react';

interface ActivationStepProps {
    onComplete?: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
    canActivate?: () => boolean;
    onActivate: () => void;
    isLastStep?: boolean;
    isLoading: boolean;
}

export default function ActivationStep({ onActivate, isLoading }: ActivationStepProps) {
    const requirements = [
        {
            id: 'business-info',
            label: 'Business Information',
            description: 'Basic business details completed',
            completed: true, // This should come from props or context
            required: true,
        },
        {
            id: 'communication',
            label: 'Email Provider',
            description: 'Connected and verified',
            completed: true, // This should come from props or context
            required: true,
        },
        {
            id: 'services',
            label: 'At Least One Service',
            description: 'Service created with availability',
            completed: true, // This should come from props or context
            required: true,
        },
        {
            id: 'contact-form',
            label: 'Contact Form',
            description: 'Customer inquiry form created',
            completed: true, // This should come from props or context
            required: false,
        },
        {
            id: 'forms',
            label: 'Required Forms',
            description: 'Document forms uploaded',
            completed: false, // This should come from props or context
            required: false,
        },
        {
            id: 'inventory',
            label: 'Inventory Setup',
            description: 'Stock items configured',
            completed: false, // This should come from props or context
            required: false,
        },
        {
            id: 'staff',
            label: 'Team Members',
            description: 'Staff invitations sent',
            completed: true, // This should come from props or context
            required: false,
        },
    ];

    const requiredCompleted = requirements.filter(req => req.required).every(req => req.completed);
    const optionalCompleted = requirements.filter(req => !req.required && req.completed).length;
    const totalOptional = requirements.filter(req => !req.required).length;

    return (
        <div className="space-y-6">
            <div className="text-center">
                <Rocket className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900">
                    Activate Your Workspace
                </h2>
                <p className="text-gray-600 mt-2 text-lg">
                    You&apos;re almost ready to go live!
                </p>
            </div>

            {/* Setup Progress */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Progress</h3>

                {/* Required Items */}
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Required Setup</h4>
                    <div className="space-y-2">
                        {requirements.filter(req => req.required).map((req) => (
                            <div key={req.id} className="flex items-center space-x-3">
                                {req.completed ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <X className="w-5 h-5 text-red-500" />
                                )}
                                <div className="flex-1">
                                    <div className={`text-sm font-medium ${req.completed ? 'text-gray-900' : 'text-red-600'
                                        }`}>
                                        {req.label}
                                    </div>
                                    <div className="text-xs text-gray-500">{req.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Optional Items */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Optional Setup ({optionalCompleted}/{totalOptional} completed)
                    </h4>
                    <div className="space-y-2">
                        {requirements.filter(req => !req.required).map((req) => (
                            <div key={req.id} className="flex items-center space-x-3">
                                {req.completed ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                )}
                                <div className="flex-1">
                                    <div className={`text-sm font-medium ${req.completed ? 'text-gray-900' : 'text-gray-600'
                                        }`}>
                                        {req.label}
                                    </div>
                                    <div className="text-xs text-gray-500">{req.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Activation Status */}
            {requiredCompleted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-semibold text-green-900">
                                Ready to Activate!
                            </h3>
                            <p className="text-green-800 mt-1">
                                All required setup is complete. Click the button below to activate your workspace
                                and start accepting bookings and customer inquiries.
                            </p>
                            <div className="mt-4">
                                <h4 className="font-medium text-green-900 mb-2">What happens next:</h4>
                                <ul className="text-sm text-green-800 space-y-1">
                                    <li>• Your booking links go live</li>
                                    <li>• Contact forms start accepting submissions</li>
                                    <li>• Automated messages begin working</li>
                                    <li>• Your dashboard becomes active</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-6 h-6 text-yellow-500 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-900">
                                Complete Required Setup
                            </h3>
                            <p className="text-yellow-800 mt-1">
                                Please complete all required setup steps before activating your workspace.
                                Use the navigation buttons to go back and finish the remaining items.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Activation Button */}
            <div className="pt-6">
                <button
                    onClick={onActivate}
                    disabled={!requiredCompleted || isLoading}
                    className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        'Activating Workspace...'
                    ) : requiredCompleted ? (
                        'Activate Workspace & Go Live! 🚀'
                    ) : (
                        'Complete Required Setup First'
                    )}
                </button>

                {requiredCompleted && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                        Once activated, customers can start booking services immediately
                    </p>
                )}
            </div>
        </div>
    );
}