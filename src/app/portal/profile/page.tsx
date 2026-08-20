'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Customer } from '@/types';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const { data: customer, isLoading } = useQuery({
    queryKey: ['portal', 'profile'],
    queryFn: async (): Promise<Customer> => {
      const res = await fetch('/api/portal/profile');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({});

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <h1 className="text-xl font-bold">Profil</h1>
        <Card className="p-6 h-48 animate-pulse bg-muted" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-4">
        <p className="text-destructive">Gagal memuat profil.</p>
      </div>
    );
  }

  const updateField = (field: keyof Customer, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Profil</h1>
        <Button
          variant={isEditing ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <Save className="size-4 mr-1" />
              Simpan
            </>
          ) : (
            'Edit'
          )}
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="size-24 rounded-full bg-muted flex items-center justify-center overflow-hidden mb-3">
            {customer.photo_url ? (
              <img src={customer.photo_url} alt={customer.name} className="size-full object-cover" />
            ) : (
              <User className="size-10 text-muted-foreground" />
            )}
          </div>
          {isEditing && (
            <Button variant="outline" size="sm">
              <Camera className="size-4 mr-1" />
              Ganti Foto
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name ?? customer.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            ) : (
              <p className="text-sm flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                {customer.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email ?? customer.email ?? ''}
                onChange={(e) => updateField('email', e.target.value)}
              />
            ) : (
              <p className="text-sm flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                {customer.email ?? '-'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telepon</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={formData.phone ?? customer.phone ?? ''}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            ) : (
              <p className="text-sm flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                {customer.phone ?? '-'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            {isEditing ? (
              <Input
                id="address"
                value={formData.address ?? customer.address ?? ''}
                onChange={(e) => updateField('address', e.target.value)}
              />
            ) : (
              <p className="text-sm flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                {customer.address ?? '-'}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
