import { Suspense } from 'react';
import { ExpenseApprovalTable } from '@/components/domain/expense/expense-approval-table';

export default function ExpenseApprovalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Expense Approval</h1>
        <p className="text-muted-foreground">Review and approve expenses</p>
      </div>
      <Suspense fallback={<div>Loading approvals...</div>}>
        <ExpenseApprovalTable />
      </Suspense>
    </div>
  );
}
