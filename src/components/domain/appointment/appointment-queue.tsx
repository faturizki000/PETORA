'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Stethoscope } from 'lucide-react';
import type { Appointment } from '@/types/appointment';

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  WAITING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-green-100 text-green-800',
  DONE: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
  NO_SHOW: 'bg-orange-100 text-orange-800',
};

export function AppointmentQueue({ appointments }: { appointments: Appointment[] }) {
  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center">No appointments in queue</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{appointment.appointment_type || 'Appointment'}</h3>
                  <p className="text-sm text-muted-foreground">{appointment.appointment_time}</p>
                </div>
                <Badge className={statusColors[appointment.status] || ''}>{appointment.status}</Badge>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Customer: {appointment.customer_id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  <span>Pet: {appointment.pet_id}</span>
                </div>
                {appointment.doctor_id && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Doctor: {appointment.doctor_id}</span>
                  </div>
                )}
              </div>
              {appointment.queue_number && (
                <div className="mt-4 pt-3 border-t">
                  <span className="text-sm font-medium">Queue #{appointment.queue_number}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
