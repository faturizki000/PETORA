import { Suspense } from 'react';
import { GiftCardTable } from '@/components/domain/promotion/gift-card-table';

export default function GiftCardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gift Cards</h1>
        <p className="text-muted-foreground">Kelola gift card</p>
      </div>
      <Suspense fallback={<div>Loading gift cards...</div>}>
        <GiftCardTable />
      </Suspense>
    </div>
  );
}
