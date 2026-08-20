'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        success: 'border-transparent bg-status-success text-white',
        warning: 'border-transparent bg-status-warning text-white',
        info: 'border-transparent bg-status-info text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return <span className={cn(statusBadgeVariants({ variant }), className)}>{children}</span>;
}
