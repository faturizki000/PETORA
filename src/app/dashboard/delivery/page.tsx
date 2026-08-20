import { Suspense } from 'react';
import { DeliveryTable } from '@/components/domain/delivery/delivery-table';

export default function DeliveriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deliveries</h1>
        <p className="text-muted-foreground">Kelola pengiriman</p>
      </div>
      <Suspense fallback={<div>Loading deliveries...</div>}>
        <DeliveryTable />
      </Suspense>
    </div>
  );
}
