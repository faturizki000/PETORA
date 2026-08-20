import * as React from 'react';

import { cn } from '@/lib/utils';

interface DataTableColumnHeaderProps extends React.ComponentProps<'th'> {
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | false;
  onSort?: () => void;
}

function DataTableColumnHeader({
  sortable,
  sorted,
  onSort,
  className,
  children,
  ...props
}: DataTableColumnHeaderProps) {
  return (
    <th
      data-slot="data-table-column-header"
      className={cn(
        'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground',
        sortable && 'cursor-pointer select-none',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && (
          <span className="text-muted-foreground">
            {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </div>
    </th>
  );
}

export { DataTableColumnHeader };
