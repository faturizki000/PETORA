'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Store, CreditCard, Percent, Bell } from 'lucide-react';

const settingsNav = [
  { title: 'General', href: '/dashboard/settings/general', icon: Store },
  { title: 'Branches', href: '/dashboard/settings/branches', icon: Store },
  { title: 'Payment', href: '/dashboard/settings/payment', icon: CreditCard },
  { title: 'Tax', href: '/dashboard/settings/tax', icon: Percent },
  { title: 'Loyalty', href: '/dashboard/settings/loyalty', icon: Percent },
  { title: 'Notification', href: '/dashboard/settings/notification', icon: Bell },
  { title: 'Printer', href: '/dashboard/settings/printer', icon: Store },
  { title: 'Reminder', href: '/dashboard/settings/reminder', icon: Bell },
  { title: 'Receipt', href: '/dashboard/settings/receipt', icon: Store },
  { title: 'Security', href: '/dashboard/settings/security', icon: Store },
  { title: 'Integration', href: '/dashboard/settings/integration', icon: Store },
  { title: 'Backup', href: '/dashboard/settings/backup', icon: Store },
  { title: 'Employees', href: '/dashboard/settings/employees', icon: Store },
  { title: 'Subscription', href: '/dashboard/settings/subscription', icon: Store },
  { title: 'Delivery', href: '/dashboard/settings/delivery', icon: Store },
  { title: 'Inventory', href: '/dashboard/settings/inventory', icon: Store },
  { title: 'Custom Fields', href: '/dashboard/settings/custom-fields', icon: Store },
  { title: 'Advanced', href: '/dashboard/settings/advanced', icon: Store },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {settingsNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            pathname === item.href
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
