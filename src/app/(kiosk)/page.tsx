'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export default function KioskHome() {
  const { data: appointments } = useQuery({
    queryKey: ['kiosk', 'appointments', 'today'],
    queryFn: async () => {
      const res = await fetch('/api/kiosk/appointments/today');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const services = [
    {
      title: 'Check-in',
      description: 'Check-in menggunakan kode booking',
      icon: QrCode,
      href: '/(kiosk)/check-in',
      color: 'bg-blue-500',
    },
    {
      title: 'Booking Baru',
      description: 'Buat janji temu untuk hewan',
      icon: Calendar,
      href: '/(kiosk)/booking',
      color: 'bg-green-500',
    },
    {
      title: 'Cek Status',
      description: 'Lihat status antrian saat ini',
      icon: Clock,
      href: '/(kiosk)/status',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold mb-2">Selamat Datang di Petora</h1>
        <p className="text-lg text-muted-foreground">
          Self-Service Kiosk - Silakan pilih layanan di bawah ini
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Layanan</h2>
        <div className="grid grid-cols-1 gap-4">
          {services.map((service) => (
            <Link key={service.href} href={service.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/30">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${service.color} text-white`}>
                    <service.icon className="size-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {appointments && appointments.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Antrian Hari Ini</h2>
          <div className="space-y-3">
            {appointments.slice(0, 5).map((apt: { id: string; appointment_number: number; customer_name: string; pet_name: string; status: string }) => (
              <Card key={apt.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">Antrian #{apt.appointment_number}</p>
                    <p className="text-muted-foreground">
                      {apt.customer_name} - {apt.pet_name}
                    </p>
                  </div>
                  <Badge variant={apt.status === 'WAITING' ? 'default' : 'secondary'}>
                    {apt.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
