import { Suspense } from 'react';
import { MedicalRecordTable } from '@/components/domain/medical-record/medical-record-table';

export default function MedicalRecordsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Medical Records</h1>
        <p className="text-muted-foreground">Kelola rekam medis</p>
      </div>
      <Suspense fallback={<div>Loading medical records...</div>}>
        <MedicalRecordTable />
      </Suspense>
    </div>
  );
}