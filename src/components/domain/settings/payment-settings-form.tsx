'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { paymentSettingsSchema } from '@/schemas/settings';
import { updatePaymentSettingsAction } from '@/app/actions/settings.actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

type FormValues = z.input<typeof paymentSettingsSchema>;

export function PaymentSettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      methods: ['CASH', 'QRIS', 'TRANSFER'],
      gateway_enabled: false,
      gateway_provider: 'manual',
      split_payment: false,
      partial_payment: false,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const result = await updatePaymentSettingsAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Payment settings updated successfully');
    } else {
      toast.error(result.message || 'Failed to update settings');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Payment Methods</h3>
          <div className="flex flex-wrap gap-4">
            {(['CASH', 'QRIS', 'TRANSFER', 'E_WALLET', 'CREDIT_CARD', 'DEBIT_CARD', 'GIFT_CARD', 'LOYALTY_POINTS'] as const).map((method) => (
              <label key={method} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={method}
                  checked={form.watch('methods').includes(method)}
                  onChange={(e) => {
                    const current = form.getValues('methods');
                    if (e.target.checked) {
                      form.setValue('methods', [...current, method]);
                    } else {
                      form.setValue('methods', current.filter((m) => m !== method));
                    }
                  }}
                  className="rounded border-border"
                />
                <span className="text-sm">{method}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Switch id="gateway_enabled" checked={form.watch('gateway_enabled')} onCheckedChange={(checked) => form.setValue('gateway_enabled', checked)} />
            <Label htmlFor="gateway_enabled">Enable Payment Gateway</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="split_payment" checked={form.watch('split_payment')} onCheckedChange={(checked) => form.setValue('split_payment', checked)} />
            <Label htmlFor="split_payment">Allow Split Payment</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="partial_payment" checked={form.watch('partial_payment')} onCheckedChange={(checked) => form.setValue('partial_payment', checked)} />
            <Label htmlFor="partial_payment">Allow Partial Payment</Label>
          </div>
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
