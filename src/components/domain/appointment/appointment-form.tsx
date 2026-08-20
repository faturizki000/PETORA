'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createAppointmentSchema } from '@/schemas/appointment';
import { createAppointmentAction } from '@/app/actions/appointment.actions';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const formSchema = createAppointmentSchema;

type FormValues = z.infer<typeof formSchema>;

const appointmentTypeOptions = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'checkup', label: 'Checkup' },
  { value: 'emergency', label: 'Emergency' },
];

export function AppointmentForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: '',
      pet_id: '',
      doctor_id: '',
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '09:00',
      duration_minutes: 30,
      appointment_type: undefined,
      complaint: '',
      notes: '',
      is_from_portal: false,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const result = await createAppointmentAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Appointment created successfully');
      onSuccess?.();
      router.push('/dashboard/appointments');
    } else {
      toast.error(result.message || 'An error occurred');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Label htmlFor="doctor_id">Doctor ID</Label>
            <Input id="doctor_id" {...form.register('doctor_id')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appointment_date">Date</Label>
            <Input id="appointment_date" type="date" {...form.register('appointment_date')} />
            {form.formState.errors.appointment_date && (
              <p className="text-sm text-destructive">{form.formState.errors.appointment_date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="appointment_time">Time</Label>
            <Input id="appointment_time" type="time" {...form.register('appointment_time')} />
            {form.formState.errors.appointment_time && (
              <p className="text-sm text-destructive">{form.formState.errors.appointment_time.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration_minutes">Duration (minutes)</Label>
            <Input id="duration_minutes" type="number" {...form.register('duration_minutes')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appointment_type">Type</Label>
            <select id="appointment_type" {...form.register('appointment_type')} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm">
              <option value="">Select type</option>
              {appointmentTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="complaint">Complaint</Label>
          <Textarea id="complaint" {...form.register('complaint')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...form.register('notes')} />
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
