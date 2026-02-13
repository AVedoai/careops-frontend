import React from 'react';
import { Calendar } from '@/components/ui/calendar';

export default function BookingCalendarPage() {
    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Booking Calendar</h1>
            <Calendar />
        </div>
    );
}