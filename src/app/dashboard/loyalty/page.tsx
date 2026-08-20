import { Suspense } from 'react';
import { LoyaltyDashboard } from '@/components/domain/loyalty/loyalty-dashboard';

export default function LoyaltyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Loyalty</h1>
        <p className="text-muted-foreground">Kelola program loyalitas pelanggan</p>
      </div>
      <Suspense fallback={<div>Loading loyalty data...</div>}>
        <LoyaltyDashboard />
      </Suspense>
    </div>
  );
}
