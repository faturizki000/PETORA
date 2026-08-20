import { Suspense } from 'react';
import { KioskTable } from '@/components/domain/kiosk/kiosk-table';

export default function KioskPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kiosk Management</h1>
        <p className="text-muted-foreground">Kelola self-service kiosk</p>
      </div>
      <Suspense fallback={<div>Loading kiosks...</div>}>
        <KioskTable />
      </Suspense>
    </div>
  );
}
