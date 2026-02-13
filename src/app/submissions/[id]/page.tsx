/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SubmissionsAPI } from '@/lib/api';

export default function SubmissionDetailsPage() {
    const router = useRouter();
    const { id } = router.query;
    const [submission, setSubmission] = useState<any>(null);

    const loadSubmission = async () => {
        try {
            const data = await SubmissionsAPI.getById(id as string);
            setSubmission(data);
        } catch (error) {
            console.error('Error loading submission:', error);
        }
    };

    useEffect(() => {
        if (id) {
            loadSubmission();
        }
    }, [id]);

    if (!submission) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Submission Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <strong>Name:</strong> {submission.submitter_name || 'Unknown'}
                        </div>
                        <div>
                            <strong>Email:</strong> {submission.submitter_email}
                        </div>
                        <div>
                            <strong>Status:</strong> <Badge>{submission.status}</Badge>
                        </div>
                        <div>
                            <strong>Submitted At:</strong> {new Date(submission.created_at).toLocaleString()}
                        </div>
                        <div>
                            <strong>Data:</strong>
                            <pre>{JSON.stringify(submission.submitted_data, null, 2)}</pre>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}