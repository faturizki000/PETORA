import { Suspense } from 'react';
import { CustomerTable } from '@/components/domain/customer/customer-table';

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Kelola data pelanggan</p>
      </div>
      <Suspense fallback={<div>Loading customers...</div>}>
        <CustomerTable />
      </Suspense>
    </div>
  );
}
