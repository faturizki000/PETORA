export function generateInvoiceNumber(type: string): string {
  const prefix: Record<string, string> = {
    POS: 'INV',
    CLINICAL: 'MED',
    PET_HOTEL: 'HTL',
    GROOMING: 'GRM',
    MIXED: 'MIX',
    SUBSCRIPTION: 'SUB',
    TELEMEDICINE: 'TLM',
  };
  const p = prefix[type] ?? 'INV';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${p}-${date}-${random}`;
}

export function calculatePetAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  if (years > 0) return `${years} tahun ${months} bulan`;
  return `${months} bulan`;
}

export function getDefaultAppointmentTime(): string {
  return '09:00';
}
