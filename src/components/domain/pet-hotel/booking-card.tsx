'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

export function PetHotelBookingCard({ booking }: { booking: Record<string, unknown> }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold">Booking {(booking.id as string)?.slice(0, 8)}</h3>
          <p className="text-sm text-muted-foreground">Room: {(booking.room_id as string)?.slice(0, 8)}</p>
        </div>
        <Badge variant="secondary">{(booking.status as string) || 'PENDING'}</Badge>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Pet: {(booking.pet_id as string)?.slice(0, 8)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Check-in: {(booking.check_in_date as string) || '-'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Check-out: {(booking.check_out_date as string) || '-'}</span>
        </div>
      </div>
    </Card>
  );
}
