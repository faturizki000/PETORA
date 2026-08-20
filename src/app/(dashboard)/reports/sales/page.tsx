import { Suspense } from 'react';
import { SalesReport } from '@/components/domain/reports/sales-report';

export default function SalesReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Report</h1>
        <p className="text-muted-foreground">Laporan penjualan</p>
      </div>
      <Suspense fallback={<div>Loading sales report...</div>}>
        <SalesReport />
      </Suspense>
    </div>
  );
}
