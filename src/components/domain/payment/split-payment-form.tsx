'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { splitPaymentSchema } from '@/schemas/payment';
import { splitPaymentAction } from '@/app/actions/payment.actions';
import { PaymentMethodSelector } from '@/components/domain/payment/payment-method-selector';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

type FormValues = z.infer<typeof splitPaymentSchema>;
type PaymentMethodLiteral = FormValues['payments'][number]['payment_method'];

export function SplitPaymentForm({
  invoiceId,
  totalAmount,
  onCompleted,
}: {
  invoiceId: string;
  totalAmount: number;
  onCompleted?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(splitPaymentSchema),
    defaultValues: {
      invoice_id: invoiceId,
      payments: [
        { payment_method: 'CASH' as PaymentMethodLiteral, amount: totalAmount / 2 },
        { payment_method: 'QRIS' as PaymentMethodLiteral, amount: totalAmount / 2 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'payments' });
  const watched = useWatch({ control: form.control, name: 'payments' });
  const totalEntered = watched.reduce((sum, p) => sum + (p.amount || 0), 0);

  function addPayment() {
    append({ payment_method: 'CASH' as PaymentMethodLiteral, amount: 0, reference_number: '' });
  }

  async function onSubmit(data: FormValues) {
    const sum = data.payments.reduce((s, p) => s + p.amount, 0);
    if (Math.abs(sum - totalAmount) > 0.01) {
      toast.error(`Total split payments (${sum}) must equal ${totalAmount}`);
      return;
    }
    if (invoiceId) {
      setIsSubmitting(true);
      const result = await splitPaymentAction({
        invoice_id: invoiceId,
        payments: data.payments,
      });
      setIsSubmitting(false);
      if (result.success) {
        toast.success('Split payments recorded');
        onCompleted?.();
      } else {
        toast.error(result.message || 'Failed to record split payments');
      }
    } else {
      toast.success('Split payments configured');
      onCompleted?.();
    }
  }

  return (
    <Card className="p-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Split Payment</h4>
          <span className="text-sm text-muted-foreground">
            Total: {totalAmount.toLocaleString()} | Entered: {totalEntered.toLocaleString()}
          </span>
        </div>
        <div className="space-y-3">
          {fields.map((_, index) => (
            <div key={fields[index]?.id || index} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <PaymentMethodSelector
                  value={watched[index]?.payment_method || 'CASH'}
                  onChange={(m) => form.setValue(`payments.${index}.payment_method`, m as PaymentMethodLiteral)}
                />
              </div>
              <div className="col-span-3 space-y-1">
                <Label className="text-xs text-muted-foreground">{'Amount'}</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  {...form.register(`payments.${index}.amount` as const, { valueAsNumber: true })}
                />
              </div>
              <div className="col-span-3 space-y-1">
                <Label className="text-xs text-muted-foreground">{'Reference'}</Label>
                <Input {...form.register(`payments.${index}.reference_number` as const)} />
              </div>
              <div className="col-span-1">
                <Button variant="ghost" size="sm" onClick={() => remove(index)} className="h-7 w-7 p-1">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" size="sm" onClick={addPayment}>
            <Plus className="h-4 w-4 mr-2" />
            Add Method
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Confirm Split Payment'}
          </Button>
        </div>
        </form>
    </Card>
  );
}
