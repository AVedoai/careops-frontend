/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '@/components/ui/button';
import { StaffAPI } from '@/lib/api';

export default function StaffPage() {
    const [staff, setStaff] = useState<any[]>([]);

    const loadStaff = async () => {
        try {
            const response = await StaffAPI.getList();
            setStaff((response as any).data || response);
        } catch (error) {
            console.error('Error loading staff:', error);
        }
    };

    useEffect(() => {
        loadStaff();
    }, []);

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Staff</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {staff.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell>{member.name}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>{member.role}</TableCell>
                            <TableCell>
                                <Button variant="link">Edit</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}