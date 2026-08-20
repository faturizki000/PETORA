import { Suspense } from 'react';
import { FeedbackTable } from '@/components/domain/feedback/feedback-table';

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customer Feedback</h1>
        <p className="text-muted-foreground">Kelola umpan balik pelanggan</p>
      </div>
      <Suspense fallback={<div>Loading feedback...</div>}>
        <FeedbackTable />
      </Suspense>
    </div>
  );
}
