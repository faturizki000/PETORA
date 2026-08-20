import { Suspense } from 'react';
import { EmployeeTable } from '@/components/domain/employee/employee-table';

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Employees</h1>
        <p className="text-muted-foreground">Kelola data karyawan</p>
      </div>
      <Suspense fallback={<div>Loading employees...</div>}>
        <EmployeeTable />
      </Suspense>
    </div>
  );
}
