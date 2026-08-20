'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

const employeeFormSchema = z.object({
  username: z.string().min(1).max(100),
  full_name: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  role: z.string().min(1),
  branch_id: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  emergency_contact: z.string().optional().or(z.literal('')),
  hire_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  salary: z.number().nonnegative().optional(),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof employeeFormSchema>;

const roleOptions = [
  { value: 'OWNER', label: 'Owner' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'DOKTER', label: 'Dokter' },
  { value: 'KASIR', label: 'Kasir' },
  { value: 'GROOMER', label: 'Groomer' },
  { value: 'COURIER', label: 'Courier' },
  { value: 'CUSTOMER', label: 'Customer' },
];

export function EmployeeForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      username: '',
      full_name: '',
      email: '',
      phone: '',
      role: 'KASIR',
      branch_id: '',
      address: '',
      emergency_contact: '',
      hire_date: '',
      salary: 0,
      is_active: true,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    setIsSubmitting(false);
    toast.success('Employee created successfully');
    onSuccess?.();
    form.reset();
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...form.register('username')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" {...form.register('full_name')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register('email')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...form.register('phone')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select id="role" {...form.register('role')}>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch_id">Branch ID</Label>
            <Input id="branch_id" {...form.register('branch_id')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input id="salary" type="number" {...form.register('salary', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hire_date">Hire Date</Label>
            <Input id="hire_date" type="date" {...form.register('hire_date')} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" {...form.register('address')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergency_contact">Emergency Contact</Label>
          <Input id="emergency_contact" {...form.register('emergency_contact')} />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="is_active" checked={form.watch('is_active')} onCheckedChange={(checked) => form.setValue('is_active', checked)} />
          <Label htmlFor="is_active">Active</Label>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
