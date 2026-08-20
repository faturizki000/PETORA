import { Suspense } from 'react';
import { PrescriptionTable } from '@/components/domain/prescription/prescription-table';

export default function PrescriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Prescriptions</h1>
        <p className="text-muted-foreground">Kelola resep obat</p>
      </div>
      <Suspense fallback={<div>Loading prescriptions...</div>}>
        <PrescriptionTable />
      </Suspense>
    </div>
  );
}
