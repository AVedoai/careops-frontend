/* eslint-disable @typescript-eslint/prefer-as-const */
'use client';

import { useState } from 'react';
import { Mail, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import { onboardingApi } from '../../lib/api';
import { getErrorMessage } from '../../lib/utils';

interface CommunicationStepProps {
    onComplete: () => void;
    onNext: () => void;
}

export default function CommunicationStep({ onComplete, onNext }: CommunicationStepProps) {
    const [emailProvider, setEmailProvider] = useState({
        type: 'sendgrid' as 'sendgrid' | 'mailgun',
        apiKey: '',
        verified: false,
        testing: false,
    });

    const [smsProvider, setSmsProvider] = useState({
        type: 'twilio' as 'twilio',
        accountSid: '',
        authToken: '',
        phoneNumber: '',
        verified: false,
        testing: false,
    });

    const [error, setError] = useState('');
    // const [isLoading, setIsLoading] = useState(false);
    // const [setIsLoading] = useState(false); // Commented out unused state

    const handleEmailSetup = async () => {
        if (!emailProvider.apiKey) return;

        setEmailProvider(prev => ({ ...prev, testing: true }));
        setError('');

        try {
            const setupResponse = await onboardingApi.setupEmailProvider({
                type: emailProvider.type,
                apiKey: emailProvider.apiKey,
            });

            if (setupResponse.success) {
                // Test the connection
                const testResponse = await onboardingApi.testConnection('email');
                if (testResponse.success) {
                    setEmailProvider(prev => ({ ...prev, verified: true }));
                } else {
                    setError('Email connection failed. Please check your API key.');
                }
            } else {
                setError(setupResponse.message || 'Failed to setup email provider');
            }
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setEmailProvider(prev => ({ ...prev, testing: false }));
        }
    };

    const handleSmsSetup = async () => {
        if (!smsProvider.accountSid || !smsProvider.authToken || !smsProvider.phoneNumber) return;

        setSmsProvider(prev => ({ ...prev, testing: true }));
        setError('');

        try {
            const setupResponse = await onboardingApi.setupSmsProvider({
                type: smsProvider.type,
                accountSid: smsProvider.accountSid,
                authToken: smsProvider.authToken,
                phoneNumber: smsProvider.phoneNumber,
            });

            if (setupResponse.success) {
                // Test the connection
                const testResponse = await onboardingApi.testConnection('sms');
                if (testResponse.success) {
                    setSmsProvider(prev => ({ ...prev, verified: true }));
                } else {
                    setError('SMS connection failed. Please check your Twilio credentials.');
                }
            } else {
                setError(setupResponse.message || 'Failed to setup SMS provider');
            }
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setSmsProvider(prev => ({ ...prev, testing: false }));
        }
    };

    const handleContinue = () => {
        if (emailProvider.verified) {
            onComplete();
            onNext();
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <Mail className="w-8 h-8 text-blue-600 mr-2" />
                    <MessageSquare className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Connect Communication Channels
                </h2>
                <p className="text-gray-600 mt-2">
                    Set up email and SMS to communicate with your customers automatically
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Email Provider Setup */}
            <div className="border border-gray-300 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <Mail className="w-6 h-6 text-blue-600 mr-3" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Email Provider <span className="text-red-500">*</span>
                            </h3>
                            <p className="text-sm text-gray-600">Required for customer communications</p>
                        </div>
                    </div>
                    {emailProvider.verified && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                </div>

                <div className="space-y-4">
                    {/* Provider Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Choose Provider
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="emailProvider"
                                    value="sendgrid"
                                    checked={emailProvider.type === 'sendgrid'}
                                    onChange={() => setEmailProvider(prev => ({ ...prev, type: 'sendgrid' }))}
                                    className="mr-2"
                                />
                                SendGrid
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="emailProvider"
                                    value="mailgun"
                                    checked={emailProvider.type === 'mailgun'}
                                    onChange={() => setEmailProvider(prev => ({ ...prev, type: 'mailgun' }))}
                                    className="mr-2"
                                />
                                Mailgun
                            </label>
                        </div>
                    </div>

                    {/* API Key Input */}
                    <div>
                        <label htmlFor="emailApiKey" className="block text-sm font-medium text-gray-700 mb-2">
                            API Key
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="password"
                                id="emailApiKey"
                                value={emailProvider.apiKey}
                                onChange={(e) => setEmailProvider(prev => ({ ...prev, apiKey: e.target.value }))}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={emailProvider.type === 'sendgrid' ? 'SG.xxxxxxxxxx' : 'key-xxxxxxxxxx'}
                                disabled={emailProvider.verified}
                            />
                            <button
                                type="button"
                                onClick={handleEmailSetup}
                                disabled={!emailProvider.apiKey || emailProvider.testing || emailProvider.verified}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {emailProvider.testing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : emailProvider.verified ? (
                                    'Connected'
                                ) : (
                                    'Test Connection'
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Get your API key from your {emailProvider.type === 'sendgrid' ? 'SendGrid' : 'Mailgun'} dashboard
                        </p>
                    </div>
                </div>
            </div>

            {/* SMS Provider Setup */}
            <div className="border border-gray-300 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <MessageSquare className="w-6 h-6 text-green-600 mr-3" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                SMS Provider <span className="text-gray-500">(Optional)</span>
                            </h3>
                            <p className="text-sm text-gray-600">For SMS notifications and reminders</p>
                        </div>
                    </div>
                    {smsProvider.verified && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                </div>

                <div className="space-y-4">
                    {/* Account SID */}
                    <div>
                        <label htmlFor="accountSid" className="block text-sm font-medium text-gray-700 mb-2">
                            Account SID
                        </label>
                        <input
                            type="text"
                            id="accountSid"
                            value={smsProvider.accountSid}
                            onChange={(e) => setSmsProvider(prev => ({ ...prev, accountSid: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            disabled={smsProvider.verified}
                        />
                    </div>

                    {/* Auth Token */}
                    <div>
                        <label htmlFor="authToken" className="block text-sm font-medium text-gray-700 mb-2">
                            Auth Token
                        </label>
                        <input
                            type="password"
                            id="authToken"
                            value={smsProvider.authToken}
                            onChange={(e) => setSmsProvider(prev => ({ ...prev, authToken: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Your Twilio Auth Token"
                            disabled={smsProvider.verified}
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            Twilio Phone Number
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="tel"
                                id="phoneNumber"
                                value={smsProvider.phoneNumber}
                                onChange={(e) => setSmsProvider(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="+1234567890"
                                disabled={smsProvider.verified}
                            />
                            <button
                                type="button"
                                onClick={handleSmsSetup}
                                disabled={!smsProvider.accountSid || !smsProvider.authToken || !smsProvider.phoneNumber || smsProvider.testing || smsProvider.verified}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {smsProvider.testing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : smsProvider.verified ? (
                                    'Connected'
                                ) : (
                                    'Test Connection'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Continue Button */}
            <div className="pt-6">
                <button
                    onClick={handleContinue}
                    disabled={!emailProvider.verified}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {emailProvider.verified ? 'Continue to Next Step' : 'Connect Email Provider to Continue'}
                </button>
            </div>
        </div>
    );
}