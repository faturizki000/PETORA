'use client';

import type { ElementType } from 'react';
import { Button } from '@/components/ui/button';
import {
  Banknote,
  QrCode,
  Landmark,
  Wallet,
  CreditCard,
  Gift,
  Gem,
  Users,
  HelpCircle,
} from 'lucide-react';
import type { PaymentMethod } from '@/types/invoice';

interface MethodOption {
  value: PaymentMethod;
  label: string;
  icon: ElementType;
}

const methodOptions: MethodOption[] = [
  { value: 'CASH', label: 'Cash', icon: Banknote },
  { value: 'QRIS', label: 'QRIS', icon: QrCode },
  { value: 'TRANSFER', label: 'Bank Transfer', icon: Landmark },
  { value: 'E_WALLET', label: 'E-Wallet', icon: Wallet },
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
  { value: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard },
  { value: 'GIFT_CARD', label: 'Gift Card', icon: Gift },
  { value: 'LOYALTY_POINTS', label: 'Loyalty Points', icon: Gem },
  { value: 'MIXED', label: 'Mixed', icon: Users },
  { value: 'OTHER', label: 'Other', icon: HelpCircle },
];

export function PaymentMethodSelector({
  value,
  onChange,
  disabled,
}: {
  value?: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
      {methodOptions.map((method) => {
        const Icon = method.icon;
        const selected = value === method.value;
        return (
          <Button
            key={method.value}
            type="button"
            variant={selected ? 'default' : 'outline'}
            className="flex flex-col items-center justify-center h-auto py-3 gap-1"
            disabled={disabled}
            onClick={() => onChange(method.value)}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs">{method.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
