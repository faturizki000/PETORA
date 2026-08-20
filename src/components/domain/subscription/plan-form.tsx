'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

const planFormSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  price: z.number().positive(),
  billing_cycle: z.string().min(1),
  features: z.record(z.any()).optional(),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof planFormSchema>;

export function PlanForm({ plan, onSuccess }: { plan?: Record<string, unknown>; onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: (plan?.name as string) || '',
      description: (plan?.description as string) || '',
      price: (plan?.price as number) || 0,
      billing_cycle: (plan?.billing_cycle as string) || 'MONTHLY',
      features: (plan?.features as Record<string, unknown>) || {},
      is_active: (plan?.is_active as boolean) ?? true,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    onSuccess?.();
    setIsSubmitting(false);
    toast.success(plan ? 'Plan updated successfully' : 'Plan created successfully');
    form.reset();
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input id="name" {...form.register('name')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (IDR)</Label>
            <Input id="price" type="number" {...form.register('price', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billing_cycle">Billing Cycle</Label>
            <Input id="billing_cycle" {...form.register('billing_cycle')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...form.register('description')} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="is_active" checked={form.watch('is_active')} onCheckedChange={(checked) => form.setValue('is_active', checked)} />
          <Label htmlFor="is_active">Active</Label>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (plan ? 'Update' : 'Create') + ' Plan'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
