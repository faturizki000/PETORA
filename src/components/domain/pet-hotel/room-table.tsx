'use client';

import { useQuery } from '@tanstack/react-query';
import { PetHotelService } from '@/lib/services/pet-hotel.service';
import { PetHotelRoomCard } from '@/components/domain/pet-hotel/room-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PetHotelRoomTable() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['pet-hotel', 'rooms'],
    queryFn: () => PetHotelService.listRooms(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1" />
        <Button onClick={() => router.push('/dashboard/pet-hotel/rooms/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>
      {isLoading ? (
        <Card className="p-6"><p className="text-muted-foreground">Loading...</p></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(data || []).map((room: Record<string, unknown>) => (
            <PetHotelRoomCard key={room.id as string} room={room} />
          ))}
          {(!data || data.length === 0) && (
            <Card className="p-6 col-span-full">
              <p className="text-muted-foreground text-center">No rooms found</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
