/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesAPI } from '@/lib/api';

export default function InboxPage() {
    const [messages, setMessages] = useState<any[]>([]);

    const loadMessages = async () => {
        try {
            const response = await MessagesAPI.getList();
            setMessages((response as any).data || response);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Inbox</h1>
            <div className="space-y-4">
                {messages.map((message) => (
                    <Card key={message.id}>
                        <CardHeader>
                            <CardTitle>{message.subject}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{message.body}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}