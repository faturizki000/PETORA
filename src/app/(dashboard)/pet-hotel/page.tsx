import { Suspense } from 'react';
import { PetHotelDashboard } from '@/components/domain/pet-hotel/pet-hotel-dashboard';

export default function PetHotelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pet Hotel</h1>
        <p className="text-muted-foreground">Kelola penitipan hewan</p>
      </div>
      <Suspense fallback={<div>Loading pet hotel...</div>}>
        <PetHotelDashboard />
      </Suspense>
    </div>
  );
}
