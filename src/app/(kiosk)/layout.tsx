'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, QrCode, Plus, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/(kiosk)', label: 'Beranda', icon: Home },
  { href: '/(kiosk)/booking', label: 'Booking', icon: Plus },
  { href: '/(kiosk)/check-in', label: 'Check-in', icon: QrCode },
];

export default function KioskLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center gap-3 p-4 border-b border-border">
        <Link
          href="/"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Keluar kiosk"
        >
          <ArrowLeft className="size-6" />
        </Link>
        <div>
          <h1 className="text-lg font-bold">Petora Kiosk</h1>
          <p className="text-xs text-muted-foreground">Self-Service</p>
        </div>
      </header>

      <main className="flex-1 p-6">
        {children}
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50"
        aria-label="Navigasi kiosk"
      >
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/(kiosk)' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className={cn('size-6', isActive && 'fill-primary/20')} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
