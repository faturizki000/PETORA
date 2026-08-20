import { Suspense } from 'react';
import { SegmentTable } from '@/components/domain/marketing/segment-table';

export default function SegmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Segments</h1>
        <p className="text-muted-foreground">Kelola segmen pelanggan</p>
      </div>
      <Suspense fallback={<div>Loading segments...</div>}>
        <SegmentTable />
      </Suspense>
    </div>
  );
}
