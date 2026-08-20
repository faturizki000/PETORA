'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PawPrint, Calendar, User, CheckCircle } from 'lucide-react';

const serviceTypes = [
  'Konsultasi Umum',
  'Vaksinasi',
  'Sterilisasi',
  'Grooming',
  'Pet Hotel',
  'Kontrol',
  'Operasi',
  'Lab',
  'Radiologi',
];

export default function QuickBookingPage() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    pet_name: '',
    pet_species: '',
    pet_breed: '',
    service_type: '',
    appointment_date: '',
    appointment_time: '',
    complaint: '',
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/kiosk/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      setStep('success');
      queryClient.invalidateQueries({ queryKey: ['kiosk'] });
    },
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (step === 'success') {
    return (
      <div className="max-w-xl mx-auto">
        <Card className="p-8 text-center">
          <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Booking Berhasil!</h2>
          <p className="text-muted-foreground mb-6">
            Booking Anda telah dibuat. Simpan kode booking untuk check-in di kiosk.
          </p>
          <Button size="lg" onClick={() => setStep('form')} className="h-14 px-8">
            Booking Lagi
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Booking Baru</h1>
        <p className="text-lg text-muted-foreground">
          Isi form di bawah untuk membuat janji temu
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="size-5" />
            Data Pemilik
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name" className="text-base">Nama Lengkap</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => updateField('customer_name', e.target.value)}
                className="h-12 text-base"
                placeholder="Nama sesuai KTP"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_phone" className="text-base">Nomor Telepon</Label>
              <Input
                id="customer_phone"
                value={formData.customer_phone}
                onChange={(e) => updateField('customer_phone', e.target.value)}
                className="h-12 text-base"
                placeholder="0812-3456-7890"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PawPrint className="size-5" />
            Data Pet
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pet_name" className="text-base">Nama Pet</Label>
              <Input
                id="pet_name"
                value={formData.pet_name}
                onChange={(e) => updateField('pet_name', e.target.value)}
                className="h-12 text-base"
                placeholder="Nama hewan"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pet_species" className="text-base">Jenis</Label>
                <Input
                  id="pet_species"
                  value={formData.pet_species}
                  onChange={(e) => updateField('pet_species', e.target.value)}
                  className="h-12 text-base"
                  placeholder="Anjing, Kucing, dll"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pet_breed" className="text-base">Ras</Label>
                <Input
                  id="pet_breed"
                  value={formData.pet_breed}
                  onChange={(e) => updateField('pet_breed', e.target.value)}
                  className="h-12 text-base"
                  placeholder="Ras (opsional)"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="size-5" />
            Detail Booking
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service_type" className="text-base">Jenis Layanan</Label>
              <select
                id="service_type"
                value={formData.service_type}
                onChange={(e) => updateField('service_type', e.target.value)}
                className="h-12 w-full rounded-lg border border-input bg-transparent px-3 text-base"
              >
                <option value="">Pilih layanan</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointment_date" className="text-base">Tanggal</Label>
                <Input
                  id="appointment_date"
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => updateField('appointment_date', e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment_time" className="text-base">Waktu</Label>
                <Input
                  id="appointment_time"
                  type="time"
                  value={formData.appointment_time}
                  onChange={(e) => updateField('appointment_time', e.target.value)}
                  className="h-12 text-base"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="complaint" className="text-base">Keluhan (Opsional)</Label>
              <Textarea
                id="complaint"
                value={formData.complaint}
                onChange={(e) => updateField('complaint', e.target.value)}
                className="min-h-[100px] text-base"
                placeholder="Jelaskan keluhan atau alasan kunjungan"
              />
            </div>
          </div>
        </section>

        <Button
          size="lg"
          className="w-full h-14 text-lg"
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending || !formData.customer_name || !formData.pet_name || !formData.service_type}
        >
          {createMutation.isPending ? 'Memproses...' : 'Buat Booking'}
        </Button>
      </Card>
    </div>
  );
}
