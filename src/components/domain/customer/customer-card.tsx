'use client';

import { Card } from '@/components/ui/card';
import { MapPin, Phone, Mail, User } from 'lucide-react';

export function CustomerCard({ customer }: { customer: Record<string, unknown> }) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{customer.name as string}</h3>
          <p className="text-sm text-muted-foreground">Customer</p>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        {(customer.phone as string) && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {customer.phone as string}
          </div>
        )}
        {(customer.email as string) && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {customer.email as string}
          </div>
        )}
        {(customer.address as string) && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {(customer.city as string) && `${customer.city}, `}{(customer.address as string)}
          </div>
        )}
      </div>
    </Card>
  );
}
