import { Suspense } from 'react';
import { TelemedicineSessionTable } from '@/components/domain/telemedicine/telemedicine-session-table';

export default function TelemedicinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Telemedicine</h1>
        <p className="text-muted-foreground">Kelola sesi telemedicine</p>
      </div>
      <Suspense fallback={<div>Loading telemedicine sessions...</div>}>
        <TelemedicineSessionTable />
      </Suspense>
    </div>
  );
}
