'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPrescriptionAction } from '@/app/actions/prescription.actions';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const formSchema = z.object({
  medical_record_id: z.string().uuid(),
  doctor_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  pet_id: z.string().uuid(),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']).default('DRAFT'),
  instructions: z.string().optional(),
  dosage: z.string().optional(),
  duration_days: z.number().int().positive().optional(),
  refills_allowed: z.number().int().nonnegative().default(0),
  refills_used: z.number().int().nonnegative().default(0),
  valid_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

type FormValues = z.input<typeof formSchema>;

const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function PrescriptionForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medical_record_id: '',
      doctor_id: '',
      customer_id: '',
      pet_id: '',
      status: 'DRAFT',
      instructions: '',
      dosage: '',
      duration_days: undefined,
      refills_allowed: 0,
      refills_used: 0,
      valid_until: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const result = await createPrescriptionAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Prescription created successfully');
      onSuccess?.();
      router.push('/dashboard/prescriptions');
    } else {
      toast.error(result.message || 'An error occurred');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="medical_record_id">Medical Record ID</Label>
            <Input id="medical_record_id" {...form.register('medical_record_id')} />
            {form.formState.errors.medical_record_id && (
              <p className="text-sm text-destructive">{form.formState.errors.medical_record_id.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor_id">Doctor ID</Label>
            <Input id="doctor_id" {...form.register('doctor_id')} />
            {form.formState.errors.doctor_id && (
              <p className="text-sm text-destructive">{form.formState.errors.doctor_id.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer_id">Customer ID</Label>
            <Input id="customer_id" {...form.register('customer_id')} />
            {form.formState.errors.customer_id && (
              <p className="text-sm text-destructive">{form.formState.errors.customer_id.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pet_id">Pet ID</Label>
            <Input id="pet_id" {...form.register('pet_id')} />
            {form.formState.errors.pet_id && (
              <p className="text-sm text-destructive">{form.formState.errors.pet_id.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input id="dosage" {...form.register('dosage')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration_days">Duration (days)</Label>
            <Input id="duration_days" type="number" {...form.register('duration_days')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="refills_allowed">Refills Allowed</Label>
            <Input id="refills_allowed" type="number" {...form.register('refills_allowed')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valid_until">Valid Until</Label>
            <Input id="valid_until" type="date" {...form.register('valid_until')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" {...form.register('status')} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm">
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea id="instructions" {...form.register('instructions')} />
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
