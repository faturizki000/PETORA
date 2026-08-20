import { Suspense } from 'react';
import { GroomingBookingTable } from '@/components/domain/grooming/booking-table';

export default function GroomingBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grooming Bookings</h1>
        <p className="text-muted-foreground">Kelola booking grooming</p>
      </div>
      <Suspense fallback={<div>Loading grooming bookings...</div>}>
        <GroomingBookingTable />
      </Suspense>
    </div>
  );
}
