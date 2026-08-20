'use client';

import { ReactNode } from 'react';
import { SettingsSidebar } from './settings-sidebar';

export function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-6">
      <aside className="hidden md:block w-64 shrink-0">
        <SettingsSidebar />
      </aside>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
