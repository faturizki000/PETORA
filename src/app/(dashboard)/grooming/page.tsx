import { Suspense } from 'react';
import { GroomingDashboardClient } from '@/components/domain/grooming/grooming-dashboard';

export default function GroomingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grooming</h1>
        <p className="text-muted-foreground">Kelola layanan grooming</p>
      </div>
      <Suspense fallback={<div>Loading grooming...</div>}>
        <GroomingDashboardClient />
      </Suspense>
    </div>
  );
}
