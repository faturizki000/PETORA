'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPetHotelBookingSchema } from '@/schemas/pet-hotel';
import { createPetHotelBookingAction } from '@/app/actions/pet-hotel.actions';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const formSchema = createPetHotelBookingSchema;

type FormValues = z.infer<typeof formSchema>;

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CHECKED_IN', label: 'Checked In' },
  { value: 'CHECKED_OUT', label: 'Checked Out' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function BookingForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      room_id: '',
      pet_id: '',
      customer_id: '',
      check_in_date: new Date().toISOString().split('T')[0],
      check_out_date: '',
      status: 'PENDING',
      notes: '',
      special_requirements: '',
      branch_id: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const result = await createPetHotelBookingAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Booking created successfully');
      onSuccess?.();
      router.push('/dashboard/pet-hotel/bookings');
    } else {
      toast.error(result.message || 'An error occurred');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="room_id">Room ID</Label>
            <Input id="room_id" {...form.register('room_id')} />
            {form.formState.errors.room_id && (
              <p className="text-sm text-destructive">{form.formState.errors.room_id.message}</p>
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
            <Label htmlFor="customer_id">Customer ID</Label>
            <Input id="customer_id" {...form.register('customer_id')} />
            {form.formState.errors.customer_id && (
              <p className="text-sm text-destructive">{form.formState.errors.customer_id.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="check_in_date">Check-in Date</Label>
            <Input id="check_in_date" type="date" {...form.register('check_in_date')} />
            {form.formState.errors.check_in_date && (
              <p className="text-sm text-destructive">{form.formState.errors.check_in_date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="check_out_date">Check-out Date</Label>
            <Input id="check_out_date" type="date" {...form.register('check_out_date')} />
            {form.formState.errors.check_out_date && (
              <p className="text-sm text-destructive">{form.formState.errors.check_out_date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" {...form.register('status')} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm">
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch_id">Branch ID</Label>
            <Input id="branch_id" {...form.register('branch_id')} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...form.register('notes')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="special_requirements">Special Requirements</Label>
          <Textarea id="special_requirements" {...form.register('special_requirements')} />
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
