import { Suspense } from 'react';
import { AppointmentTableClient } from '@/components/domain/appointment/appointment-table';

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p className="text-muted-foreground">Kelola janji temu</p>
      </div>
      <Suspense fallback={<div>Loading appointments...</div>}>
        <AppointmentTableClient />
      </Suspense>
    </div>
  );
}
