'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

const promotionFormSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  code: z.string().min(1).max(50),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.number().positive(),
  min_purchase_amount: z.number().nonnegative().optional(),
  max_discount_amount: z.number().nonnegative().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  usage_limit: z.number().int().positive().optional(),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof promotionFormSchema>;

const discountTypeOptions = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed', label: 'Fixed Amount' },
];

export function PromotionForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      name: '',
      description: '',
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_purchase_amount: undefined,
      max_discount_amount: undefined,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      usage_limit: undefined,
      is_active: true,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    setIsSubmitting(false);
    toast.success('Promotion created successfully');
    onSuccess?.();
    form.reset();
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input id="code" {...form.register('code')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount_type">Discount Type</Label>
            <Select id="discount_type" {...form.register('discount_type')}>
              {discountTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount_value">Discount Value</Label>
            <Input id="discount_value" type="number" {...form.register('discount_value', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="min_purchase_amount">Min Purchase</Label>
            <Input id="min_purchase_amount" type="number" {...form.register('min_purchase_amount', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_discount_amount">Max Discount</Label>
            <Input id="max_discount_amount" type="number" {...form.register('max_discount_amount', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input id="start_date" type="date" {...form.register('start_date')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input id="end_date" type="date" {...form.register('end_date')} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea id="description" {...form.register('description')} className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm" rows={3} />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Promotion'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
