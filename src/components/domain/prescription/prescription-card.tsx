'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill, Calendar, User } from 'lucide-react';
import type { Prescription } from '@/types/prescription';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  ACTIVE: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export function PrescriptionCard({ prescription }: { prescription: Prescription }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold">{prescription.prescription_number}</h3>
          <p className="text-sm text-muted-foreground">Pet ID: {prescription.pet_id}</p>
        </div>
        <Badge className={statusColors[prescription.status] || ''}>{prescription.status}</Badge>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        {prescription.dosage && (
          <div className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span>Dosage: {prescription.dosage}</span>
          </div>
        )}
        {prescription.duration_days && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Duration: {prescription.duration_days} days</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Refills: {prescription.refills_used}/{prescription.refills_allowed}</span>
        </div>
      </div>
      {prescription.instructions && (
        <p className="text-sm mt-3 pt-3 border-t">{prescription.instructions}</p>
      )}
    </Card>
  );
}
