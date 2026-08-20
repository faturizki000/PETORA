'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createMedicalRecordAction } from '@/app/actions/medical-record.actions';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const formSchema = z.object({
  appointment_id: z.string().uuid(),
  doctor_id: z.string().uuid(),
  branch_id: z.string().uuid().optional(),
  chief_complaint: z.string().optional(),
  history: z.string().optional(),
  physical_exam: z.string().optional(),
  weight_kg: z.number().nonnegative().optional(),
  temperature_c: z.number().nonnegative().optional(),
  heart_rate_bpm: z.number().int().nonnegative().optional(),
  respiratory_rate_bpm: z.number().int().nonnegative().optional(),
  diagnosis: z.string().optional(),
  diagnosis_code: z.string().optional(),
  treatment: z.string().optional(),
  prescription: z.string().optional(),
  lab_results: z.string().optional(),
  additional_notes: z.string().optional(),
  attachments: z.array(z.string().url()).optional(),
  status: z.enum(['OPEN', 'CLOSED']).default('OPEN'),
});

type FormValues = z.input<typeof formSchema>;

export function MedicalRecordForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointment_id: '',
      doctor_id: '',
      branch_id: '',
      chief_complaint: '',
      history: '',
      physical_exam: '',
      weight_kg: undefined,
      temperature_c: undefined,
      heart_rate_bpm: undefined,
      respiratory_rate_bpm: undefined,
      diagnosis: '',
      diagnosis_code: '',
      treatment: '',
      prescription: '',
      lab_results: '',
      additional_notes: '',
      attachments: [],
      status: 'OPEN',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const result = await createMedicalRecordAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Medical record created successfully');
      onSuccess?.();
      router.push('/dashboard/medical-records');
    } else {
      toast.error(result.message || 'An error occurred');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="appointment_id">Appointment ID</Label>
            <Input id="appointment_id" {...form.register('appointment_id')} />
            {form.formState.errors.appointment_id && (
              <p className="text-sm text-destructive">{form.formState.errors.appointment_id.message}</p>
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
            <Label htmlFor="weight_kg">Weight (kg)</Label>
            <Input id="weight_kg" type="number" step="0.1" {...form.register('weight_kg')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperature_c">Temperature (C)</Label>
            <Input id="temperature_c" type="number" step="0.1" {...form.register('temperature_c')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heart_rate_bpm">Heart Rate (bpm)</Label>
            <Input id="heart_rate_bpm" type="number" {...form.register('heart_rate_bpm')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="respiratory_rate_bpm">Respiratory Rate (bpm)</Label>
            <Input id="respiratory_rate_bpm" type="number" {...form.register('respiratory_rate_bpm')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diagnosis_code">Diagnosis Code</Label>
            <Input id="diagnosis_code" {...form.register('diagnosis_code')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" {...form.register('status')} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm">
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="chief_complaint">Chief Complaint</Label>
          <Textarea id="chief_complaint" {...form.register('chief_complaint')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="history">History</Label>
          <Textarea id="history" {...form.register('history')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="physical_exam">Physical Exam</Label>
          <Textarea id="physical_exam" {...form.register('physical_exam')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diagnosis">Diagnosis</Label>
          <Textarea id="diagnosis" {...form.register('diagnosis')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="treatment">Treatment</Label>
          <Textarea id="treatment" {...form.register('treatment')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prescription">Prescription</Label>
          <Textarea id="prescription" {...form.register('prescription')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lab_results">Lab Results</Label>
          <Textarea id="lab_results" {...form.register('lab_results')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="additional_notes">Additional Notes</Label>
          <Textarea id="additional_notes" {...form.register('additional_notes')} />
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
