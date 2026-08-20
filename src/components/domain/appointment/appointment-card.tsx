'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Stethoscope } from 'lucide-react';
import type { Appointment } from '@/types/appointment';

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  WAITING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-green-100 text-green-800',
  DONE: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
  NO_SHOW: 'bg-orange-100 text-orange-800',
};

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold">{appointment.appointment_type || 'Appointment'}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(appointment.appointment_date).toLocaleDateString('id-ID')} • {appointment.appointment_time}
          </p>
        </div>
        <Badge className={statusColors[appointment.status] || ''}>{appointment.status}</Badge>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Customer ID: {appointment.customer_id}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Pet ID: {appointment.pet_id}</span>
        </div>
        {appointment.doctor_id && (
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span>Doctor ID: {appointment.doctor_id}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{appointment.duration_minutes} minutes</span>
        </div>
      </div>
      {appointment.complaint && (
        <p className="text-sm mt-3 pt-3 border-t">{appointment.complaint}</p>
      )}
    </Card>
  );
}
