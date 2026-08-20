'use client';

import { useQuery } from '@tanstack/react-query';
import { MedicalRecordService } from '@/lib/services/medical-record.service';
import { AppointmentService } from '@/lib/services/appointment.service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar } from 'lucide-react';
import type { MedicalRecord, Appointment } from '@/types';

export function PetHealthTimeline({ petId }: { petId: string }) {
  const { data: medicalRecords } = useQuery({
    queryKey: ['medical-records', 'byPet', petId],
    queryFn: () => MedicalRecordService.list({ pet_id: petId, limit: 20 }),
  });

  const { data: appointments } = useQuery({
    queryKey: ['appointments', 'byPet', petId],
    queryFn: () => AppointmentService.list({ pet_id: petId, limit: 20 }),
  });

  const timelineItems = [
    ...(medicalRecords?.data || []).map((record: MedicalRecord) => ({
      id: record.id,
      type: 'medical' as const,
      date: record.created_at,
      title: `Medical Record: ${record.record_number}`,
      description: record.diagnosis || record.chief_complaint || 'No description',
      status: record.status,
    })),
    ...(appointments?.data || []).map((apt: Appointment) => ({
      id: apt.id,
      type: 'appointment' as const,
      date: apt.appointment_date,
      title: `Appointment: ${apt.appointment_type || 'Consultation'}`,
      description: apt.complaint || 'No description',
      status: apt.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4">
      {timelineItems.map((item) => (
        <Card key={`${item.type}-${item.id}`} className="p-4">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              {item.type === 'medical' ? (
                <FileText className="h-5 w-5 text-blue-500" />
              ) : (
                <Calendar className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{item.title}</h4>
                <Badge variant={item.status === 'OPEN' || item.status === 'SCHEDULED' ? 'default' : 'secondary'}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(item.date).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
        </Card>
      ))}
      {timelineItems.length === 0 && (
        <Card className="p-6">
          <p className="text-muted-foreground text-center">No health timeline items found</p>
        </Card>
      )}
    </div>
  );
}
