'use client';

import { useState } from 'react';
import { Users, Plus, Mail, UserCheck } from 'lucide-react';
import { onboardingApi } from '../../lib/api';
import { getErrorMessage } from '../../lib/utils';

interface StaffInvite {
    id: string;
    email: string;
    role: 'staff';
    permissions: string[];
    sent: boolean;
}

interface StaffStepProps {
    onComplete: () => void;
    onNext: () => void;
}

export default function StaffStep({ onComplete, onNext }: StaffStepProps) {
    const [invites, setInvites] = useState<StaffInvite[]>([
        {
            id: '1',
            email: 'jessica@wellnessspa.com',
            role: 'staff',
            permissions: ['manage_inbox', 'manage_bookings', 'view_forms'],
            sent: false
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const availablePermissions = [
        { id: 'manage_inbox', label: 'Manage Inbox', description: 'View and respond to customer messages' },
        { id: 'manage_bookings', label: 'Manage Bookings', description: 'View, edit, and confirm bookings' },
        { id: 'view_forms', label: 'View Forms', description: 'Access customer form submissions' },
        { id: 'manage_inventory', label: 'Manage Inventory', description: 'Update stock levels and items' },
    ];

    const addInvite = () => {
        const newInvite: StaffInvite = {
            id: Date.now().toString(),
            email: '',
            role: 'staff',
            permissions: ['manage_inbox', 'manage_bookings'],
            sent: false,
        };
        setInvites(prev => [...prev, newInvite]);
    };

    // const removeInvite = (id: string) => {
    //     setInviteList(prev => prev.filter(invite => invite.id !== id));
    // };

    const updateInvite = (id: string, updates: Partial<StaffInvite>) => {
        setInvites(prev => prev.map(invite =>
            invite.id === id ? { ...invite, ...updates } : invite
        ));
    };

    const togglePermission = (inviteId: string, permissionId: string) => {
        setInvites(prev => prev.map(invite => {
            if (invite.id === inviteId) {
                const permissions = invite.permissions.includes(permissionId)
                    ? invite.permissions.filter(p => p !== permissionId)
                    : [...invite.permissions, permissionId];
                return { ...invite, permissions };
            }
            return invite;
        }));
    };

    const sendInvites = async () => {
        setIsLoading(true);
        setError('');

        try {
            for (const invite of invites) {
                if (invite.email && !invite.sent) {
                    await onboardingApi.inviteStaff({
                        email: invite.email,
                        role: invite.role,
                        permissions: invite.permissions,
                    });
                    updateInvite(invite.id, { sent: true });
                }
            }
            onComplete();
            onNext();
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        onComplete();
        onNext();
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">
                    Invite Your Team
                </h2>
                <p className="text-gray-600 mt-2">
                    Add staff members to help manage your operations (optional)
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Staff Invitations</h3>
                    <button
                        onClick={addInvite}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">Add Staff</span>
                    </button>
                </div>

                {invites.map((invite) => (
                    <div key={invite.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="email"
                                            value={invite.email}
                                            onChange={(e) => updateInvite(invite.id, { email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="jessica@wellnessspa.com"
                                            disabled={invite.sent}
                                        />
                                    </div>
                                </div>
                                {invite.sent && (
                                    <div className="flex items-center text-green-600">
                                        <UserCheck className="w-4 h-4 mr-1" />
                                        <span className="text-sm">Invited</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Permissions
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {availablePermissions.map((permission) => (
                                        <label key={permission.id} className="flex items-start space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={invite.permissions.includes(permission.id)}
                                                onChange={() => togglePermission(invite.id, permission.id)}
                                                className="mt-1"
                                                disabled={invite.sent}
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-gray-700">
                                                    {permission.label}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {permission.description}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Note:</h3>
                <p className="text-sm text-blue-800">
                    Staff members will receive an email invitation to join your workspace.
                    You can manage their permissions later from the team settings.
                </p>
            </div>

            <div className="pt-6 flex space-x-4">
                <button
                    onClick={handleSkip}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300"
                >
                    Skip Team Setup
                </button>
                <button
                    onClick={sendInvites}
                    disabled={isLoading || invites.every(i => !i.email || i.sent)}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? 'Sending...' : 'Send Invitations'}
                </button>
            </div>
        </div>
    );
}