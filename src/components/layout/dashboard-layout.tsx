'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
