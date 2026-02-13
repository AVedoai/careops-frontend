/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SubmissionsAPI } from '@/lib/api';

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        try {
            const response = await SubmissionsAPI.getList();
            setSubmissions((response as any).data || response);
        } catch (error) {
            console.error('Error loading submissions:', error);
        }
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Submissions</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                            <TableCell>{submission.submitter_name || 'Unknown'}</TableCell>
                            <TableCell>{submission.submitter_email}</TableCell>
                            <TableCell>
                                <Badge>{submission.status}</Badge>
                            </TableCell>
                            <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Button variant="link">View</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}