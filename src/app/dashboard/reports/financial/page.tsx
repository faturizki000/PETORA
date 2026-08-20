import { Suspense } from 'react';
import { FinancialReport } from '@/components/domain/reports/financial-report';

export default function FinancialReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Report</h1>
        <p className="text-muted-foreground">Laporan keuangan</p>
      </div>
      <Suspense fallback={<div>Loading financial report...</div>}>
        <FinancialReport />
      </Suspense>
    </div>
  );
}
