/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LeadsAPI } from '@/lib/api';

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);

    const loadLeads = async () => {
        try {
            const response = await LeadsAPI.getList();
            setLeads((response as any).data || response);
        } catch (error) {
            console.error('Error loading leads:', error);
        }
    };

    useEffect(() => {
        loadLeads();
    }, []);

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Leads</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {leads.map((lead) => (
                    <Card key={lead.id}>
                        <CardHeader>
                            <CardTitle>{lead.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div>
                                    <strong>Email:</strong> {lead.email}
                                </div>
                                <div>
                                    <strong>Status:</strong> <Badge>{lead.status}</Badge>
                                </div>
                                <Button variant="link">View Details</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}