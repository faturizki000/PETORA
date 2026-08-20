'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUIStore } from '@/stores/ui-store';

export function BranchSwitcher() {
  const { currentBranchId, setCurrentBranch } = useUIStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="gap-2">
          <span className="hidden sm:inline">{currentBranchId ? 'Cabang Utama' : 'Pilih Cabang'}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Pilih Cabang</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setCurrentBranch(null)}>
          Semua Cabang
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrentBranch('main')}>
          Cabang Utama
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
