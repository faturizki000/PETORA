import { Suspense } from 'react';
import { ExpenseCategoryTable } from '@/components/domain/expense/expense-category-table';

export default function ExpenseCategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Expense Categories</h1>
        <p className="text-muted-foreground">Kelola kategori pengeluaran</p>
      </div>
      <Suspense fallback={<div>Loading categories...</div>}>
        <ExpenseCategoryTable />
      </Suspense>
    </div>
  );
}
