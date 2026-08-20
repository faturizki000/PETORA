'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PawPrint, LayoutDashboard, Users, Cat, Calendar, Stethoscope, Hotel, Scissors, Package, ShoppingCart, FileText, CreditCard, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useUIStore } from '@/stores/ui-store';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string | number;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Customers', href: '/dashboard/customers', icon: Users },
  { label: 'Pets', href: '/dashboard/pets', icon: Cat },
  { label: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  { label: 'Medical Records', href: '/dashboard/medical-records', icon: Stethoscope },
  { label: 'Pet Hotel', href: '/dashboard/pet-hotel', icon: Hotel },
  { label: 'Grooming', href: '/dashboard/grooming', icon: Scissors },
  { label: 'Products', href: '/dashboard/products', icon: Package },
  { label: 'POS', href: '/dashboard/pos', icon: ShoppingCart },
  { label: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={toggleSidebar} />
      )}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-card border-r transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16',
          'hidden lg:block'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            {sidebarOpen && (
              <Link href="/dashboard" className="flex items-center gap-2 font-bold">
                <PawPrint className="h-6 w-6 text-primary" />
                <span>Petora</span>
              </Link>
            )}
            <button onClick={toggleSidebar} className="p-2 hover:bg-accent rounded-md">
              {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            {navItems.map((item) => (
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
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
                {item.badge && sidebarOpen && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
