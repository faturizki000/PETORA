'use client';

import { AppointmentForm } from '@/components/domain/appointment/appointment-form';

export default function NewAppointmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Appointment</h1>
        <p className="text-muted-foreground">Schedule a new appointment</p>
      </div>
      <AppointmentForm />
    </div>
  );
}
