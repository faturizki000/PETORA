'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, PawPrint, FileText, Gift, CreditCard, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/(portal)', label: 'Beranda', icon: Home },
  { href: '/(portal)/pets', label: 'Pets', icon: PawPrint },
  { href: '/(portal)/bookings', label: 'Booking', icon: Calendar },
  { href: '/(portal)/medical-records', label: 'Rekam Medis', icon: FileText },
  { href: '/(portal)/loyalty', label: 'Loyalty', icon: Gift },
  { href: '/(portal)/invoices', label: 'Tagihan', icon: CreditCard },
  { href: '/(portal)/profile', label: 'Profil', icon: User },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20">
        {children}
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50"
        aria-label="Navigasi portal"
      >
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/(portal)' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className={cn('size-5', isActive && 'fill-primary/20')} />
                <span className="text-[10px] leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
