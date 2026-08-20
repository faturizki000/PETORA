'use client';

import { MedicalRecordForm } from '@/components/domain/medical-record/medical-record-form';

export default function NewMedicalRecordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Medical Record</h1>
        <p className="text-muted-foreground">Create a new medical record</p>
      </div>
      <MedicalRecordForm />
    </div>
  );
}
