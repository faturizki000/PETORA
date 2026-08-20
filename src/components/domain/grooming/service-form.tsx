'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createGroomingServiceSchema } from '@/schemas/grooming';
import { createGroomingServiceAction } from '@/app/actions/grooming.actions';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const formSchema = createGroomingServiceSchema;

type FormValues = z.input<typeof formSchema>;

const categoryOptions = [
  { value: 'BASIC', label: 'Basic' },
  { value: 'PREMIUM', label: 'Premium' },
  { value: 'MEDICAL', label: 'Medical' },
  { value: 'SPECIAL', label: 'Special' },
];

export function ServiceForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'BASIC',
      price: 0,
      duration_minutes: 60,
      is_active: true,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const result = await createGroomingServiceAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Service created successfully');
      onSuccess?.();
      router.push('/dashboard/grooming/services');
    } else {
      toast.error(result.message || 'An error occurred');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select id="category" {...form.register('category')} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm">
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" {...form.register('price')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration_minutes">Duration (minutes)</Label>
            <Input id="duration_minutes" type="number" {...form.register('duration_minutes')} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...form.register('description')} />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            {...form.register('is_active')}
            className="rounded border-border"
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Create'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
