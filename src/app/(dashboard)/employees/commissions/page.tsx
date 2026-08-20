import { Suspense } from 'react';
import { CommissionTable } from '@/components/domain/employee/commission-table';

export default function CommissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Commissions</h1>
        <p className="text-muted-foreground">Kelola komisi karyawan</p>
      </div>
      <Suspense fallback={<div>Loading commissions...</div>}>
        <CommissionTable />
      </Suspense>
    </div>
  );
}
