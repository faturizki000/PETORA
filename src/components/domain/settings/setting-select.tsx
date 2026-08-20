'use client';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface SettingSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  options: Array<{ value: string; label: string }>;
}

export function SettingSelect({ id, label, value, onChange, description, options }: SettingSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <Select id={id} value={value} onChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
