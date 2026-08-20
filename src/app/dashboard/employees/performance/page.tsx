import { Suspense } from 'react';
import { PerformanceTable } from '@/components/domain/employee/performance-table';

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Performance</h1>
        <p className="text-muted-foreground">Monitor performa karyawan</p>
      </div>
      <Suspense fallback={<div>Loading performance...</div>}>
        <PerformanceTable />
      </Suspense>
    </div>
  );
}
