'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SettingInputProps {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  description?: string;
  placeholder?: string;
}

export function SettingInput({ id, label, type = 'text', value, onChange, description, placeholder }: SettingInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
