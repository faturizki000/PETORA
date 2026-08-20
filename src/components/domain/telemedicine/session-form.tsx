'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createSessionAction } from '@/app/actions/telemedicine.actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

const sessionFormSchema = z.object({
  customer_id: z.string().uuid(),
  pet_id: z.string().uuid(),
  doctor_id: z.string().uuid(),
  scheduled_at: z.string().datetime(),
  duration_minutes: z.number().int().positive().default(30),
  notes: z.string().optional(),
  fee: z.number().nonnegative().optional(),
});

type FormValues = z.infer<typeof sessionFormSchema>;

export function SessionForm({ onSuccess }: { onSuccess?: () => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      customer_id: '',
      pet_id: '',
      doctor_id: '',
      scheduled_at: new Date().toISOString().slice(0, 16),
      duration_minutes: 30,
      notes: '',
      fee: undefined,
    },
  });

  async function onSubmit(data: FormValues) {
    const result = await createSessionAction(data);
    if (result.success) {
      toast.success('Session created successfully');
      onSuccess?.();
      form.reset();
    } else {
      toast.error(result.message || 'Failed to create session');
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
            <Label htmlFor="pet_id">Pet ID</Label>
            <Input id="pet_id" {...form.register('pet_id')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor_id">Doctor ID</Label>
            <Input id="doctor_id" {...form.register('doctor_id')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scheduled_at">Scheduled At</Label>
            <Input id="scheduled_at" type="datetime-local" {...form.register('scheduled_at')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration_minutes">Duration (minutes)</Label>
            <Input id="duration_minutes" type="number" {...form.register('duration_minutes', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fee">Fee (IDR)</Label>
            <Input id="fee" type="number" {...form.register('fee', { valueAsNumber: true })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea id="notes" {...form.register('notes')} className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm" rows={3} />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit">Create Session</Button>
        </div>
      </form>
    </Card>
  );
}
