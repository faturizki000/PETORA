'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  DONE: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export function GroomingBookingCard({ booking }: { booking: Record<string, unknown> }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold">Grooming Booking</h3>
          <p className="text-sm text-muted-foreground">Service: {(booking.service_id as string)?.slice(0, 8)}</p>
        </div>
        <Badge className={statusColors[booking.status as string] || ''}>{(booking.status as string) || 'SCHEDULED'}</Badge>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{(booking.appointment_date as string) || '-'} • {(booking.appointment_time as string) || '-'}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Pet: {(booking.pet_id as string)?.slice(0, 8)}</span>
        </div>
      </div>
    </Card>
  );
}
