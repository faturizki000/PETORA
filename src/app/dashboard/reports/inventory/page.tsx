import { Suspense } from 'react';
import { InventoryReport } from '@/components/domain/reports/inventory-report';

export default function InventoryReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Report</h1>
        <p className="text-muted-foreground">Laporan inventori</p>
      </div>
      <Suspense fallback={<div>Loading inventory report...</div>}>
        <InventoryReport />
      </Suspense>
    </div>
  );
}
