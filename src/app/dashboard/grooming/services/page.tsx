import { Suspense } from 'react';
import { GroomingServiceTable } from '@/components/domain/grooming/service-table';

export default function GroomingServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grooming Services</h1>
        <p className="text-muted-foreground">Kelola layanan grooming</p>
      </div>
      <Suspense fallback={<div>Loading services...</div>}>
        <GroomingServiceTable />
      </Suspense>
    </div>
  );
}
