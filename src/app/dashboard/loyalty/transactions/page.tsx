import { Suspense } from 'react';
import { LoyaltyTransactionsTable } from '@/components/domain/loyalty/loyalty-transactions-table';

export default function LoyaltyTransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Loyalty Transactions</h1>
        <p className="text-muted-foreground">Riwayat transaksi poin loyalitas</p>
      </div>
      <Suspense fallback={<div>Loading transactions...</div>}>
        <LoyaltyTransactionsTable />
      </Suspense>
    </div>
  );
}
