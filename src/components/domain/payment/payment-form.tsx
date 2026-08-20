'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { manualPaymentSchema } from '@/schemas/payment';
import { recordManualPaymentAction } from '@/app/actions/payment.actions';
import { PaymentMethodSelector } from '@/components/domain/payment/payment-method-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

type FormValues = z.infer<typeof manualPaymentSchema>;

export function PaymentForm({
  invoiceId,
  maxAmount,
  onSuccess,
}: {
  invoiceId: string;
  maxAmount?: number;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(manualPaymentSchema),
    defaultValues: {
      invoice_id: invoiceId,
      payment_method: 'CASH',
      amount: maxAmount ?? 0,
      reference_number: '',
      proof_url: '',
      notes: '',
    },
  });

  const paymentMethod = useWatch({ control: form.control, name: 'payment_method' });

  async function onSubmit(data: FormValues) {
    if (maxAmount && data.amount > maxAmount) {
      toast.error(`Amount cannot exceed ${maxAmount}`);
      return;
    }
    setIsSubmitting(true);
    const result = await recordManualPaymentAction(data);
    setIsSubmitting(false);
    if (result.success) {
      toast.success('Payment recorded successfully');
      onSuccess?.();
      form.reset();
      router.refresh();
    } else {
      toast.error(result.message || 'Failed to record payment');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label>Payment Method</Label>
              <PaymentMethodSelector
                value={paymentMethod}
                onChange={(m) => form.setValue('payment_method', m)}
              />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" min={0} step="0.01" {...form.register('amount', { valueAsNumber: true })} />
            {form.formState.errors.amount && (
              <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reference_number">Reference Number</Label>
            <Input id="reference_number" {...form.register('reference_number')} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="proof_url">Proof URL</Label>
          <Input id="proof_url" {...form.register('proof_url')} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...form.register('notes')} />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Record Payment'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
