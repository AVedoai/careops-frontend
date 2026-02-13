/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { Clock, MapPin, DollarSign, Calendar, Link as LinkIcon, Copy, CheckCircle } from 'lucide-react';
import { servicesApi } from '../../lib/api';
import { getErrorMessage, copyToClipboard } from '../../lib/utils';

interface ServiceAvailability {
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

interface ServicesStepProps {
    onComplete: () => void;
    onNext: () => void;
}

export default function ServicesStep({ onComplete, onNext }: ServicesStepProps) {
    const [serviceData, setServiceData] = useState({
        name: '60-Min Massage',
        description: 'Relaxing full-body massage therapy session',
        duration: 60, // minutes
        price: 120,
        location: '123 Main St, Austin, TX',
        availability: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true }, // Monday
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true }, // Tuesday
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: false }, // Wednesday - Closed
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true }, // Thursday
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isAvailable: true }, // Friday
            { dayOfWeek: 6, startTime: '10:00', endTime: '15:00', isAvailable: false }, // Saturday
            { dayOfWeek: 0, startTime: '10:00', endTime: '15:00', isAvailable: false }, // Sunday
        ] as ServiceAvailability[]
    });

    const [generatedLink, setGeneratedLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const timeOptions = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return `${hour}:00`;
    });

    const updateAvailability = (dayIndex: number, field: keyof ServiceAvailability, value: any) => {
        setServiceData(prev => ({
            ...prev,
            availability: prev.availability.map((day, index) =>
                index === dayIndex ? { ...day, [field]: value } : day
            )
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await servicesApi.create({
                name: serviceData.name,
                description: serviceData.description,
                duration: serviceData.duration,
                price: serviceData.price,
                location: serviceData.location,
                availability: serviceData.availability,
                isActive: true,
            });

            if (response.success && response.data) {
                // Generate the shareable booking link
                const workspaceSlug = 'wellness-spa'; // This should come from the workspace
                const serviceSlug = '60-min-massage'; // This should be generated from the service name
                const link = `${window.location.origin}/b/${workspaceSlug}/${serviceSlug}`;
                setGeneratedLink(link);
                onComplete();
            } else {
                setError(response.message || 'Failed to create service');
            }
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyLink = async () => {
        const success = await copyToClipboard(generatedLink);
        if (success) {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        }
    };

    if (generatedLink) {
        return (
            <div className="text-center space-y-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">
                    Service Created Successfully!
                </h2>
                <p className="text-gray-600">
                    Your "{serviceData.name}" service is ready for bookings. Share this link:
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <LinkIcon className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={generatedLink}
                            readOnly
                            className="flex-1 bg-transparent text-sm text-gray-700 focus:outline-none"
                        />
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                            <Copy className="w-4 h-4" />
                            <span className="text-sm">{linkCopied ? 'Copied!' : 'Copy'}</span>
                        </button>
                    </div>
                </div>

                <p className="text-sm text-gray-500">
                    Customers can visit this link to book appointments with you.
                    Confirmations and reminders will be sent automatically!
                </p>

                <button
                    onClick={onNext}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                    Continue to Forms Setup
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">
                    Set Up Your First Service
                </h2>
                <p className="text-gray-600 mt-2">
                    Create a service that customers can book online
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <div className="space-y-6">
                {/* Service Name */}
                <div>
                    <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-2">
                        Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="serviceName"
                        value={serviceData.name}
                        onChange={(e) => setServiceData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="60-Min Massage"
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={serviceData.description}
                        onChange={(e) => setServiceData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Describe your service..."
                    />
                </div>

                {/* Duration and Price */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                            Duration (minutes) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="number"
                                id="duration"
                                value={serviceData.duration}
                                onChange={(e) => setServiceData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="60"
                                min="15"
                                max="480"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                            Price (optional)
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="number"
                                id="price"
                                value={serviceData.price}
                                onChange={(e) => setServiceData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="120"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            id="location"
                            value={serviceData.location}
                            onChange={(e) => setServiceData(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="123 Main St, Austin, TX"
                        />
                    </div>
                </div>

                {/* Availability */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                        Availability <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                        {serviceData.availability.map((day, index) => (
                            <div key={day.dayOfWeek} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                                <div className="w-24">
                                    <span className="text-sm font-medium text-gray-700">
                                        {dayNames[day.dayOfWeek]}
                                    </span>
                                </div>

                                <div className="flex-1 flex items-center space-x-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={day.isAvailable}
                                            onChange={(e) => updateAvailability(index, 'isAvailable', e.target.checked)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm text-gray-600">Available</span>
                                    </label>

                                    {day.isAvailable && (
                                        <>
                                            <select
                                                value={day.startTime}
                                                onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                                                className="px-2 py-1 text-sm border border-gray-300 rounded"
                                            >
                                                {timeOptions.map(time => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                            <span className="text-gray-500">to</span>
                                            <select
                                                value={day.endTime}
                                                onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                                                className="px-2 py-1 text-sm border border-gray-300 rounded"
                                            >
                                                {timeOptions.map(time => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !serviceData.name || !serviceData.duration}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creating Service...' : 'Save Service'}
                </button>
            </div>
        </div>
    );
}