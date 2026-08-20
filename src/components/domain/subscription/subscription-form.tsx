'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createSubscriptionSchema } from '@/schemas/subscription';
import { createSubscriptionAction } from '@/app/actions/subscription.actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

type FormValues = z.input<typeof createSubscriptionSchema>;

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'EXPIRED', label: 'Expired' },
];

const paymentMethodOptions = [
  { value: 'CASH', label: 'Cash' },
  { value: 'QRIS', label: 'QRIS' },
  { value: 'TRANSFER', label: 'Transfer' },
  { value: 'E_WALLET', label: 'E-Wallet' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'GIFT_CARD', label: 'Gift Card' },
  { value: 'LOYALTY_POINTS', label: 'Loyalty Points' },
  { value: 'MIXED', label: 'Mixed' },
  { value: 'OTHER', label: 'Other' },
];

export function SubscriptionForm({ subscription, onSuccess }: { subscription?: Record<string, unknown>; onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: {
      customer_id: (subscription?.customer_id as string) || '',
      plan_id: (subscription?.plan_id as string) || '',
      pet_id: (subscription?.pet_id as string) || '',
      status: (subscription?.status as 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED') || 'ACTIVE',
      start_date: (subscription?.start_date as string) || new Date().toISOString().split('T')[0],
      end_date: (subscription?.end_date as string) || '',
      next_billing_date: (subscription?.next_billing_date as string) || '',
      auto_renew: (subscription?.auto_renew as boolean) ?? true,
      payment_method: (subscription?.payment_method as 'CASH' | 'QRIS' | 'TRANSFER' | 'E_WALLET' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'GIFT_CARD' | 'LOYALTY_POINTS' | 'MIXED' | 'OTHER') || undefined,
      notes: (subscription?.notes as string) || '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const result = await createSubscriptionAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Subscription created successfully');
      onSuccess?.();
      form.reset();
    } else {
      toast.error(result.message || 'Failed to create subscription');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer_id">Customer ID</Label>
            <Input id="customer_id" {...form.register('customer_id')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan_id">Plan ID</Label>
            <Input id="plan_id" {...form.register('plan_id')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pet_id">Pet ID (Optional)</Label>
            <Input id="pet_id" {...form.register('pet_id')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select id="status" {...form.register('status')}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input id="start_date" type="date" {...form.register('start_date')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input id="end_date" type="date" {...form.register('end_date')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next_billing_date">Next Billing Date</Label>
            <Input id="next_billing_date" type="date" {...form.register('next_billing_date')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method</Label>
            <Select id="payment_method" {...form.register('payment_method')}>
              <option value="">Select method</option>
              {paymentMethodOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea id="notes" {...form.register('notes')} className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm" rows={3} />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="auto_renew" checked={form.watch('auto_renew')} onCheckedChange={(checked) => form.setValue('auto_renew', checked)} />
          <Label htmlFor="auto_renew">Auto Renew</Label>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Subscription'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
