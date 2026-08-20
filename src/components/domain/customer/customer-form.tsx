'use client';

import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createCustomerSchema } from '@/schemas/customer';
import { createCustomerAction } from '@/app/actions/customer.actions';
import { useToast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

const formSchema = createCustomerSchema.extend({
  tags: z.array(z.enum(['VIP', 'REGULAR', 'NEW', 'BLACKLIST', 'WHOLESALE', 'BREEDER'])).default([]),
});

type FormValues = z.infer<typeof formSchema>;

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

export function CustomerForm({ customer, onSuccess }: { customer?: Record<string, unknown>; onSuccess?: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
      gender: customer?.gender || '',
      id_number: customer?.id_number || '',
      create_account: customer?.create_account || false,
      username: customer?.username || '',
      pin: customer?.pin || '',
    },
  });

  const selectedTags = useWatch({ control: form.control, name: 'tags' });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const result = await createCustomerAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(customer ? 'Customer updated successfully' : 'Customer created successfully');
      onSuccess?.();
      if (!customer) {
        router.push('/dashboard/customers');
      }
    } else {
      toast.error(result.message || 'An error occurred');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...form.register('phone')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register('email')} />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...form.register('city')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input id="postal_code" {...form.register('postal_code')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select id="gender" {...form.register('gender')} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm">
              <option value="">Select gender</option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birth_date">Birth Date</Label>
            <Input id="birth_date" type="date" {...form.register('birth_date')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency_contact">Emergency Contact</Label>
            <Input id="emergency_contact" {...form.register('emergency_contact')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency_phone">Emergency Phone</Label>
            <Input id="emergency_phone" {...form.register('emergency_phone')} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" {...form.register('address')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...form.register('notes')} />
        </div>
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => (
              <label key={tag.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={tag.value}
                  checked={selectedTags.includes(tag.value)}
                  onChange={(e) => {
                    const current = form.getValues('tags');
                    if (e.target.checked) {
                      form.setValue('tags', [...current, tag.value]);
                    } else {
                      form.setValue('tags', current.filter((t) => t !== tag.value));
                    }
                  }}
                  className="rounded border-border"
                />
                <span className="text-sm">{tag.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : customer ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
