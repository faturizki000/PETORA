'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createExpenseSchema } from '@/schemas/expense';
import { createExpenseAction } from '@/app/actions/expense.actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

type FormValues = z.infer<typeof createExpenseSchema>;

export function ExpenseForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      branch_id: '',
      category: '',
      amount: 0,
      description: '',
      expense_date: new Date().toISOString().split('T')[0],
      receipt_url: '',
      status: 'PENDING',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const result = await createExpenseAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Expense created successfully');
      onSuccess?.();
      form.reset();
    } else {
      toast.error(result.message || 'Failed to create expense');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...form.register('category')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (IDR)</Label>
            <Input id="amount" type="number" {...form.register('amount', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expense_date">Expense Date</Label>
            <Input id="expense_date" type="date" {...form.register('expense_date')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch_id">Branch ID</Label>
            <Input id="branch_id" {...form.register('branch_id')} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...form.register('description')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="receipt_url">Receipt URL</Label>
          <Input id="receipt_url" {...form.register('receipt_url')} />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Expense'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
