import { Suspense } from 'react';
import { PetHotelRoomTable } from '@/components/domain/pet-hotel/room-table';

export default function PetHotelRoomsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pet Hotel Rooms</h1>
        <p className="text-muted-foreground">Kelola kamar penitipan</p>
      </div>
      <Suspense fallback={<div>Loading rooms...</div>}>
        <PetHotelRoomTable />
      </Suspense>
    </div>
  );
}
