import { Suspense } from 'react';
import { ExpenseTable } from '@/components/domain/expense/expense-table';

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Expenses</h1>
        <p className="text-muted-foreground">Kelola pengeluaran bisnis</p>
      </div>
      <Suspense fallback={<div>Loading expenses...</div>}>
        <ExpenseTable />
      </Suspense>
    </div>
  );
}
