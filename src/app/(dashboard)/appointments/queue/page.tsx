'use client';

import { useQuery } from '@tanstack/react-query';
import { AppointmentService } from '@/lib/services/appointment.service';
import { AppointmentQueue } from '@/components/domain/appointment/appointment-queue';
import { Card } from '@/components/ui/card';

export function AppointmentQueuePage() {
  const today = new Date().toISOString().split('T')[0];

  const { data, isLoading } = useQuery({
    queryKey: ['appointments', 'byDate', today],
    queryFn: () => AppointmentService.list({ appointment_date: today }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Appointment Queue</h1>
        <p className="text-muted-foreground">Today&apos;s queue - {today}</p>
      </div>
      {isLoading ? (
        <Card className="p-6"><p className="text-muted-foreground">Loading...</p></Card>
      ) : (
        <AppointmentQueue appointments={data?.data || []} />
      )}
    </div>
  );
}
