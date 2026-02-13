'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { onboardingApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import BusinessInfoStep from '@/components/onboarding/BusinessInfoStep';
import CommunicationStep from '@/components/onboarding/CommunicationStep';
import ContactFormStep from '@/components/onboarding/ContactFormStep';
import ServicesStep from '@/components/onboarding/ServicesStep';
import FormsStep from '@/components/onboarding/FormsStep';
import InventoryStep from '@/components/onboarding/InventoryStep';
import StaffStep from '@/components/onboarding/StaffStep';
import ActivationStep from '@/components/onboarding/ActivationStep';

interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    required: boolean;
}

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<OnboardingStep[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    const stepComponents = [
        BusinessInfoStep,
        CommunicationStep,
        ContactFormStep,
        ServicesStep,
        FormsStep,
        InventoryStep,
        StaffStep,
        ActivationStep,
    ];

    const stepTitles = [
        'Business Information',
        'Communication Channels',
        'Contact Form',
        'Services Setup',
        'Forms Management',
        'Inventory Setup',
        'Team Members',
        'Activate Workspace'
    ];

    useEffect(() => {
        loadOnboardingSteps();
    }, []);

    const loadOnboardingSteps = async () => {
        try {
            const response = await onboardingApi.getSteps();
            if (response.success && response.data) {
                setSteps(response.data);
            }
        } catch (error) {
            console.error('Failed to load onboarding steps:', error);
            // Initialize with default steps if API fails
            setSteps([
                { id: 'business-info', title: 'Business Information', description: 'Basic business details', completed: false, required: true },
                { id: 'communication', title: 'Communication', description: 'Email and SMS setup', completed: false, required: true },
                { id: 'contact-form', title: 'Contact Form', description: 'Customer inquiry form', completed: false, required: false },
                { id: 'services', title: 'Services', description: 'Business services', completed: false, required: true },
                { id: 'forms', title: 'Forms', description: 'Required documents', completed: false, required: false },
                { id: 'inventory', title: 'Inventory', description: 'Stock management', completed: false, required: false },
                { id: 'staff', title: 'Staff', description: 'Team members', completed: false, required: false },
                { id: 'activation', title: 'Activation', description: 'Go live', completed: false, required: true },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const markStepCompleted = (stepIndex: number) => {
        const newSteps = [...steps];
        newSteps[stepIndex] = { ...newSteps[stepIndex], completed: true };
        setSteps(newSteps);
    };

    const goToNextStep = () => {
        if (currentStep < stepComponents.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const canActivate = () => {
        // Check if all required steps are completed
        const requiredSteps = steps.filter(step => step.required);
        return requiredSteps.every(step => step.completed);
    };

    const handleActivateWorkspace = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await onboardingApi.activateWorkspace();
            if (response.success) {
                router.push('/dashboard');
            } else {
                setError(response.message || 'Failed to activate workspace');
            }
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading onboarding...</p>
                </div>
            </div>
        );
    }

    const CurrentStepComponent = stepComponents[currentStep];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome to CareOps
                        </h1>
                        <div className="text-sm text-gray-600">
                            Step {currentStep + 1} of {stepComponents.length}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${((currentStep + 1) / stepComponents.length) * 100}%` }}
                        />
                    </div>

                    {/* Steps Overview */}
                    <div className="flex justify-between mt-6 text-xs">
                        {stepTitles.map((title, index) => (
                            <div
                                key={index}
                                className={`flex flex-col items-center ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${index < currentStep
                                        ? 'bg-green-500 text-white'
                                        : index === currentStep
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-300'
                                    }`}>
                                    {index < currentStep ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>
                                <span className="text-center max-w-20">{title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <CurrentStepComponent
                        onComplete={() => markStepCompleted(currentStep)}
                        onNext={goToNextStep}
                        onPrevious={goToPreviousStep}
                        canActivate={canActivate}
                        onActivate={handleActivateWorkspace}
                        isLastStep={currentStep === stepComponents.length - 1}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="max-w-4xl mx-auto px-4 pb-8">
                <div className="flex justify-between">
                    <button
                        onClick={goToPreviousStep}
                        disabled={currentStep === 0}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                    </button>

                    {currentStep < stepComponents.length - 1 && (
                        <button
                            onClick={goToNextStep}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                        >
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}