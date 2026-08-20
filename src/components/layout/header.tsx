'use client';

import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui-store';
import { BranchSwitcher } from './branch-switcher';
import { UserMenu } from './user-menu';

export function Header() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
        <Search className="h-5 w-5" />
      </Button>
      <div className="flex-1" />
      <BranchSwitcher />
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
      </Button>
      <UserMenu />
    </header>
  );
}
