'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { AppointmentService } from '@/lib/services/appointment.service';
import type { Appointment } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Clock, MapPin, X, Phone } from 'lucide-react';

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  SCHEDULED: 'outline',
  WAITING: 'default',
  IN_PROGRESS: 'secondary',
  DONE: 'default',
  CANCELLED: 'destructive',
  NO_SHOW: 'destructive',
};

export default function BookingsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['portal', 'bookings'],
    queryFn: () => AppointmentService.list({}),
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <h1 className="text-xl font-bold">Booking Saya</h1>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 h-24 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-destructive">Gagal memuat data booking.</p>
      </div>
    );
  }

  const bookings = data?.data ?? [];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Booking Saya</h1>

      {bookings.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="size-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Belum ada booking</p>
          <Button className="mt-4">Buat Booking Baru</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((apt: Appointment) => (
            <Card key={apt.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold">{apt.appointment_type || 'Kunjungan Umum'}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(apt.appointment_date), 'EEEE, dd MMMM yyyy', { locale: id })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {apt.appointment_time}
                  </p>
                </div>
                <Badge variant={statusVariant[apt.status] || 'outline'}>
                  {apt.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {apt.complaint && (
                  <span className="flex items-center gap-1">
                    <Phone className="size-3" />
                    {apt.complaint}
                  </span>
                )}
                {apt.notes && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {apt.notes}
                  </span>
                )}
                {apt.queue_number && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    Antrian #{apt.queue_number}
                  </span>
                )}
              </div>
              {apt.status === 'SCHEDULED' && (
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="size-4 mr-1" />
                    Reschedule
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1">
                    <X className="size-4 mr-1" />
                    Batalkan
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
