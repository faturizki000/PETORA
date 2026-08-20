'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Scissors, DollarSign } from 'lucide-react';

const categoryColors: Record<string, string> = {
  BASIC: 'bg-blue-100 text-blue-800',
  PREMIUM: 'bg-purple-100 text-purple-800',
  MEDICAL: 'bg-red-100 text-red-800',
  SPECIAL: 'bg-green-100 text-green-800',
};

export function GroomingServiceCard({ service }: { service: Record<string, unknown> }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Scissors className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">{service.name as string}</h3>
            <p className="text-sm text-muted-foreground">{(service.description as string) || 'No description'}</p>
          </div>
        </div>
        <Badge className={categoryColors[service.category as string] || ''}>{(service.category as string) || 'BASIC'}</Badge>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <span>Rp {(service.price as number)?.toLocaleString('id-ID') || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{(service.duration_minutes as number) || 0} minutes</span>
        </div>
      </div>
    </Card>
  );
}
