import { Suspense } from 'react';
import { ReportsDashboard } from '@/components/domain/reports/reports-dashboard';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Laporan dan analytics bisnis</p>
      </div>
      <Suspense fallback={<div>Loading reports...</div>}>
        <ReportsDashboard />
      </Suspense>
    </div>
  );
}
