import { Suspense } from 'react';
import { PetTableClient } from '@/components/domain/pet/pet-table';

export default function PetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pets</h1>
        <p className="text-muted-foreground">Kelola data hewan peliharaan</p>
      </div>
      <Suspense fallback={<div>Loading pets...</div>}>
        <PetTableClient />
      </Suspense>
    </div>
  );
}
