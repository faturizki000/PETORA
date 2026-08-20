'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPetSchema } from '@/schemas/pet';
import { createPetAction } from '@/app/actions/pet.actions';
import { useToast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const formSchema = createPetSchema;

type FormValues = z.infer<typeof formSchema>;

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unknown', label: 'Unknown' },
];

export function PetForm({ customerId, onSuccess }: { customerId?: string; onSuccess?: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: customerId || '',
      name: '',
      species: '',
      breed: '',
      birth_date: '',
      gender: '',
      color: '',
      photo_url: '',
      microchip_number: '',
      pedigree_number: '',
      temperament: '',
      special_needs: '',
      diet_notes: '',
      behavior_notes: '',
      custom_fields: {},
      is_neutered: false,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const result = await createPetAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Pet created successfully');
      onSuccess?.();
      if (!customerId) {
        router.push('/dashboard/pets');
      }
    } else {
      toast.error(result.message || 'An error occurred');
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="species">Species</Label>
            <Input id="species" {...form.register('species')} />
            {form.formState.errors.species && (
              <p className="text-sm text-destructive">{form.formState.errors.species.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="breed">Breed</Label>
            <Input id="breed" {...form.register('breed')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select id="gender" {...form.register('gender')} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm">
              <option value="">Select gender</option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birth_date">Birth Date</Label>
            <Input id="birth_date" type="date" {...form.register('birth_date')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input id="color" {...form.register('color')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="microchip_number">Microchip Number</Label>
            <Input id="microchip_number" {...form.register('microchip_number')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pedigree_number">Pedigree Number</Label>
            <Input id="pedigree_number" {...form.register('pedigree_number')} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="temperament">Temperament</Label>
          <Textarea id="temperament" {...form.register('temperament')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="special_needs">Special Needs</Label>
          <Textarea id="special_needs" {...form.register('special_needs')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diet_notes">Diet Notes</Label>
          <Textarea id="diet_notes" {...form.register('diet_notes')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="behavior_notes">Behavior Notes</Label>
          <Textarea id="behavior_notes" {...form.register('behavior_notes')} />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_neutered"
            {...form.register('is_neutered')}
            className="rounded border-border"
          />
          <Label htmlFor="is_neutered">Neutered</Label>
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
