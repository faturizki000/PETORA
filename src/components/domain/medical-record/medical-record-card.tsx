'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Stethoscope, Thermometer, Weight } from 'lucide-react';
import type { MedicalRecord } from '@/types/medical-record';

export function MedicalRecordCard({ record }: { record: MedicalRecord }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold">{record.record_number}</h3>
          <p className="text-sm text-muted-foreground">{record.chief_complaint || 'No complaint'}</p>
        </div>
        <Badge variant={record.status === 'OPEN' ? 'default' : 'secondary'}>
          {record.status}
        </Badge>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        {record.diagnosis && (
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span>Diagnosis: {record.diagnosis}</span>
          </div>
        )}
        {record.weight_kg && (
          <div className="flex items-center gap-2">
            <Weight className="h-4 w-4" />
            <span>Weight: {record.weight_kg} kg</span>
          </div>
        )}
        {record.temperature_c && (
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            <span>Temp: {record.temperature_c} C</span>
          </div>
        )}
        {record.treatment && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Treatment: {record.treatment}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
