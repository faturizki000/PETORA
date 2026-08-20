import { Suspense } from 'react';
import { DeliveryZoneTable } from '@/components/domain/delivery/delivery-zone-table';

export default function DeliveryZonesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Delivery Zones</h1>
        <p className="text-muted-foreground">Kelola zona pengiriman</p>
      </div>
      <Suspense fallback={<div>Loading zones...</div>}>
        <DeliveryZoneTable />
      </Suspense>
    </div>
  );
}
