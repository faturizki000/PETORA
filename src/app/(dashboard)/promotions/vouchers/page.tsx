import { Suspense } from 'react';
import { VoucherTable } from '@/components/domain/promotion/voucher-table';

export default function VouchersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vouchers</h1>
        <p className="text-muted-foreground">Kelola voucher pelanggan</p>
      </div>
      <Suspense fallback={<div>Loading vouchers...</div>}>
        <VoucherTable />
      </Suspense>
    </div>
  );
}
