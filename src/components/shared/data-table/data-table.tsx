import * as React from 'react';

import { cn } from '@/lib/utils';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  data: TData[];
  columns: {
    id: string;
    header: string | React.ReactNode;
    cell?: (row: TData) => React.ReactNode;
    className?: string;
    sortable?: boolean;
  }[];
  onRowClick?: (row: TData) => void;
}

function DataTable<TData>({
  data,
  columns,
  onRowClick,
  className,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      data-slot="data-table"
      className={cn('w-full', className)}
      {...props}
    >
      <div className="relative w-full overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground',
                    column.sortable && 'cursor-pointer select-none',
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Tidak ada data
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    'border-b transition-colors hover:bg-muted/50',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn('p-2 align-middle', column.className)}
                    >
                      {column.cell ? column.cell(row) : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { DataTable };
