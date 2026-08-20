'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createCustomerSchema } from '@/schemas/customer';
import { createCustomerAction, updateCustomerAction } from '@/app/actions/customer.actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

type FormValues = z.infer<typeof createCustomerSchema>;

const tagOptions = [
  { value: 'VIP', label: 'VIP' },
  { value: 'REGULAR', label: 'Regular' },
  { value: 'NEW', label: 'New' },
  { value: 'BLACKLIST', label: 'Blacklist' },
  { value: 'WHOLESALE', label: 'Wholesale' },
  { value: 'BREEDER', label: 'Breeder' },
];

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

interface CustomerFormProps {
  id?: string;
  customer?: Partial<FormValues>;
  onSuccess?: () => void;
}

export function CustomerForm({ id, customer, onSuccess }: CustomerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: customer?.name || '',
      phone: customer?.phone || '',
      email: customer?.email || '',
      address: customer?.address || '',
      city: customer?.city || '',
      postal_code: customer?.postal_code || '',
      emergency_contact: customer?.emergency_contact || '',
      emergency_phone: customer?.emergency_phone || '',
      notes: customer?.notes || '',
      is_guest: customer?.is_guest || false,
      tags: customer?.tags || [],
      custom_fields: customer?.custom_fields || {},
      referred_by: customer?.referred_by || '',
      birth_date: customer?.birth_date || '',
      gender: customer?.gender,
      id_number: customer?.id_number || '',
      create_account: customer?.create_account || false,
      username: customer?.username || '',
      pin: customer?.pin || '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const result = id
        ? await updateCustomerAction(id, data)
        : await createCustomerAction(data);
      setIsSubmitting(false);
      if (result.success) {
        toast.success(id ? 'Customer updated successfully' : 'Customer created successfully');
        onSuccess?.();
        if (!id) {
          router.push('/dashboard/customers');
        }
      } else {
        toast.error(result.message || 'Operation failed');
      }
    } catch {
      setIsSubmitting(false);
      toast.error('Operation failed');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...form.register('phone')} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register('email')} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...form.register('city')} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
