'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, XIcon } from 'lucide-react';

interface DataTableToolbarProps extends React.ComponentProps<'div'> {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
}

function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  actions,
  className,
  ...props
}: DataTableToolbarProps) {
  const [internalSearch, setInternalSearch] = React.useState('');

  React.useEffect(() => {
    if (searchValue !== undefined) return;
    onSearchChange?.(internalSearch);
  }, [internalSearch, onSearchChange, searchValue]);

  const currentSearch = searchValue ?? internalSearch;

  return (
    <div
      data-slot="data-table-toolbar"
      className={cn('flex items-center justify-between gap-2', className)}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={currentSearch}
            onChange={(e) => {
              if (searchValue === undefined) {
                setInternalSearch(e.target.value);
              }
              onSearchChange?.(e.target.value);
            }}
            className="pl-8 h-8"
          />
          {currentSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 size-6"
              onClick={() => {
                if (searchValue === undefined) {
                  setInternalSearch('');
                }
                onSearchChange?.('');
              }}
            >
              <XIcon className="size-3" />
            </Button>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

export { DataTableToolbar };
