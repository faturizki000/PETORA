import { Suspense } from 'react';
import { SubscriptionTable } from '@/components/domain/subscription/subscription-table';

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <p className="text-muted-foreground">Kelola langganan pelanggan</p>
      </div>
      <Suspense fallback={<div>Loading subscriptions...</div>}>
        <SubscriptionTable />
      </Suspense>
    </div>
  );
}
