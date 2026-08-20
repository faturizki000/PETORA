'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { storeSettingsSchema } from '@/schemas/settings';
import { updateStoreSettingsAction } from '@/app/actions/settings.actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

type FormValues = z.input<typeof storeSettingsSchema>;

export function StoreSettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      store_name: '',
      address: '',
      phone: '',
      email: '',
      logo_url: '',
      operating_hours: { open: '08:00', close: '20:00', days: [1, 2, 3, 4, 5, 6] },
      timezone: 'Asia/Jakarta',
      currency: 'IDR',
      language: 'id',
      google_maps_url: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const result = await updateStoreSettingsAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Settings updated successfully');
    } else {
      toast.error(result.message || 'Failed to update settings');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="store_name">Store Name</Label>
            <Input id="store_name" {...form.register('store_name')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...form.register('phone')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register('email')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" {...form.register('timezone')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" {...form.register('currency')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input id="language" {...form.register('language')} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" {...form.register('address')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input id="logo_url" {...form.register('logo_url')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="google_maps_url">Google Maps URL</Label>
          <Input id="google_maps_url" {...form.register('google_maps_url')} />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
