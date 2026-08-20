'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createRoomSchema } from '@/schemas/pet-hotel';
import { createRoomAction } from '@/app/actions/pet-hotel.actions';
import { useToast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const formSchema = createRoomSchema;

type FormValues = z.infer<typeof formSchema>;

const statusOptions = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'OCCUPIED', label: 'Occupied' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'RESERVED', label: 'Reserved' },
];

export function RoomForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      capacity: 1,
      price_per_night: 0,
      amenities: [],
      status: 'AVAILABLE',
      branch_id: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const result = await createRoomAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Room created successfully');
      onSuccess?.();
      router.push('/dashboard/pet-hotel/rooms');
    } else {
      toast.error(result.message || 'An error occurred');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input id="capacity" type="number" {...form.register('capacity')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price_per_night">Price per Night</Label>
            <Input id="price_per_night" type="number" {...form.register('price_per_night')} />
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
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...form.register('description')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amenities">Amenities (comma separated)</Label>
          <Input id="amenities" {...form.register('amenities')} />
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
