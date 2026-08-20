import { Suspense } from 'react';
import { LoyaltyMembersTable } from '@/components/domain/loyalty/loyalty-members-table';

export default function LoyaltyMembersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Loyalty Members</h1>
        <p className="text-muted-foreground">Daftar member loyalitas</p>
      </div>
      <Suspense fallback={<div>Loading members...</div>}>
        <LoyaltyMembersTable />
      </Suspense>
    </div>
  );
}
