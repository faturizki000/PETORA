'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, DollarSign, Users } from 'lucide-react';

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800',
  OCCUPIED: 'bg-red-100 text-red-800',
  MAINTENANCE: 'bg-yellow-100 text-yellow-800',
  RESERVED: 'bg-blue-100 text-blue-800',
};

export function PetHotelRoomCard({ room }: { room: Record<string, unknown> }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Bed className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">{room.name as string}</h3>
            <p className="text-sm text-muted-foreground">{(room.description as string) || 'No description'}</p>
          </div>
        </div>
        <Badge className={statusColors[room.status as string] || ''}>{(room.status as string) || 'AVAILABLE'}</Badge>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <span>Rp {(room.price_per_night as number)?.toLocaleString('id-ID') || 0}/night</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Capacity: {(room.capacity as number) || 1}</span>
        </div>
      </div>
    </Card>
  );
}
