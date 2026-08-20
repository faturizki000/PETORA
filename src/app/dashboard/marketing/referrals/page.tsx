import { Suspense } from 'react';
import { ReferralTable } from '@/components/domain/marketing/referral-table';

export default function ReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Referrals</h1>
        <p className="text-muted-foreground">Kelola program referral</p>
      </div>
      <Suspense fallback={<div>Loading referrals...</div>}>
        <ReferralTable />
      </Suspense>
    </div>
  );
}
