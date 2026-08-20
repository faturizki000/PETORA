'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QrCode, Search, CheckCircle, XCircle, Clock, User, PawPrint } from 'lucide-react';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }> = {
  SCHEDULED: { label: 'Dijadwalkan', variant: 'outline', icon: Clock },
  WAITING: { label: 'Menunggu', variant: 'default', icon: Clock },
  IN_PROGRESS: { label: 'Sedang Dilayani', variant: 'secondary', icon: User },
  DONE: { label: 'Selesai', variant: 'default', icon: CheckCircle },
  CANCELLED: { label: 'Dibatalkan', variant: 'destructive', icon: XCircle },
  NO_SHOW: { label: 'Tidak Hadir', variant: 'destructive', icon: XCircle },
};

export default function CheckInPage() {
  const [code, setCode] = useState('');

  const queryClient = useQueryClient();

  const { data: appointment, isLoading, error } = useQuery({
    queryKey: ['kiosk', 'check-in', code],
    queryFn: async () => {
      const res = await fetch(`/api/kiosk/check-in?code=${encodeURIComponent(code)}`);
      if (!res.ok) throw new Error('Not found');
      return res.json();
    },
    enabled: code.length > 0,
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/kiosk/check-in/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_id: appointment?.id }),
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kiosk'] });
      setCode('');
    },
  });

  const handleScan = () => {
    if (code.trim().length > 0) {
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Check-in</h1>
        <p className="text-lg text-muted-foreground">
          Masukkan kode booking atau scan QR code
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-lg">Kode Booking</Label>
            <div className="flex gap-3">
              <Input
                id="code"
                placeholder="Contoh: BK-20240101-001"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
                className="h-14 text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              />
              <Button
                size="lg"
                className="h-14 px-6"
                onClick={handleScan}
              >
                <Search className="size-5 mr-2" />
                Cari
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Mencari booking...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <XCircle className="size-12 text-destructive mx-auto mb-2" />
              <p className="text-destructive font-medium">Booking tidak ditemukan</p>
              <p className="text-sm text-muted-foreground">Periksa kembali kode booking Anda</p>
            </div>
          )}

          {appointment && (
            <div className="border-t border-border pt-4 mt-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-lg font-semibold">Booking #{appointment.appointment_number}</p>
                  <p className="text-muted-foreground">
                    {new Date(appointment.appointment_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-muted-foreground">
                    {appointment.appointment_time} WIB
                  </p>
                </div>
                {appointment.status && statusConfig[appointment.status] && (
                  <Badge variant={statusConfig[appointment.status].variant}>
                    {statusConfig[appointment.status].label}
                  </Badge>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <User className="size-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{appointment.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{appointment.customer_phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PawPrint className="size-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{appointment.pet_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.pet_species}{appointment.pet_breed ? ` - ${appointment.pet_breed}` : ''}
                    </p>
                  </div>
                </div>
                {appointment.queue_number && (
                  <div className="flex items-center gap-3">
                    <QrCode className="size-5 text-muted-foreground" />
                    <p className="font-medium">Nomor Antrian: {appointment.queue_number}</p>
                  </div>
                )}
              </div>

              {appointment.status === 'SCHEDULED' && (
                <Button
                  size="lg"
                  className="w-full h-14 text-lg"
                  onClick={() => checkInMutation.mutate()}
                  disabled={checkInMutation.isPending}
                >
                  {checkInMutation.isPending ? 'Memproses...' : 'Check-in Sekarang'}
                </Button>
              )}
              {appointment.status === 'WAITING' && (
                <div className="bg-primary/10 rounded-xl p-4 text-center">
                  <Clock className="size-8 text-primary mx-auto mb-2" />
                  <p className="text-lg font-semibold">Sedang Menunggu</p>
                  <p className="text-muted-foreground">Mohon tunggu hingga dipanggil</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
