import { Suspense } from 'react';
import { PetHotelBookingTable } from '@/components/domain/pet-hotel/booking-table';

export default function PetHotelBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pet Hotel Bookings</h1>
        <p className="text-muted-foreground">Kelola booking penitipan</p>
      </div>
      <Suspense fallback={<div>Loading bookings...</div>}>
        <PetHotelBookingTable />
      </Suspense>
    </div>
  );
}
