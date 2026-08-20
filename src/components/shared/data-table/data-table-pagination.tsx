import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface DataTablePaginationProps extends React.ComponentProps<'div'> {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

function DataTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  className,
  ...props
}: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div
      data-slot="data-table-pagination"
      className={cn('flex items-center justify-between px-2', className)}
      {...props}
    >
      <div className="flex-1 text-sm text-muted-foreground">
        {total > 0 ? (
          <>
            Menampilkan {(page - 1) * pageSize + 1} sampai{' '}
            {Math.min(page * pageSize, total)} dari {total} data
          </>
        ) : (
          'Tidak ada data'
        )}
      </div>
      <div className="flex items-center gap-6 lg:gap-8">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Baris per halaman</p>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 w-fit rounded-md border border-input bg-transparent px-2 py-1 text-sm"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export { DataTablePagination };
