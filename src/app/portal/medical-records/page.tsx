'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { MedicalRecordService } from '@/lib/services/medical-record.service';
import type { MedicalRecord } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FileText, Stethoscope, Pill, ClipboardList } from 'lucide-react';

export default function MedicalRecordsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['portal', 'medical-records'],
    queryFn: () => MedicalRecordService.list({}),
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <h1 className="text-xl font-bold">Rekam Medis</h1>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 h-32 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-destructive">Gagal memuat data rekam medis.</p>
      </div>
    );
  }

  const records = data?.data ?? [];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Rekam Medis</h1>

      {records.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="size-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Belum ada rekam medis</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {records.map((record: MedicalRecord) => (
            <Card key={record.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold">{record.record_number}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(record.created_at), 'dd MMMM yyyy', { locale: id })}
                  </p>
                </div>
                {record.status === 'CLOSED' ? (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Selesai
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Berlangsung
                  </span>
                )}
              </div>

              {record.diagnosis && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Stethoscope className="size-3" />
                    Diagnosis
                  </p>
                  <p className="text-sm">{record.diagnosis}</p>
                </div>
              )}

              {record.treatment && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Pill className="size-3" />
                    Tindakan / Pengobatan
                  </p>
                  <p className="text-sm line-clamp-2">{record.treatment}</p>
                </div>
              )}

              {record.prescription && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <ClipboardList className="size-3" />
                    Resep
                  </p>
                  <p className="text-sm line-clamp-2">{record.prescription}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
