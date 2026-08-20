'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Plus,
  MessageSquare,
  Calendar,
  PawPrint,
  ShoppingCart,
  FileText,
  Settings,
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

interface QuickActionsProps extends React.ComponentProps<'div'> {
  actions?: QuickAction[];
  position?: 'bottom-right' | 'bottom-left';
}

const defaultActions: QuickAction[] = [
  {
    id: 'booking',
    label: 'Booking Baru',
    icon: <Calendar className="size-5" />,
    onClick: () => {},
    variant: 'default',
  },
  {
    id: 'pet',
    label: 'Tambah Pet',
    icon: <PawPrint className="size-5" />,
    onClick: () => {},
  },
  {
    id: 'pos',
    label: 'Transaksi',
    icon: <ShoppingCart className="size-5" />,
    onClick: () => {},
  },
  {
    id: 'invoice',
    label: 'Invoice',
    icon: <FileText className="size-5" />,
    onClick: () => {},
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: <MessageSquare className="size-5" />,
    onClick: () => {},
    variant: 'secondary',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="size-5" />,
    onClick: () => {},
    variant: 'outline',
  },
];

function QuickActions({
  actions = defaultActions,
  position = 'bottom-right',
  className,
  ...props
}: QuickActionsProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      data-slot="quick-actions"
      className={cn(
        'fixed z-40 flex flex-col items-end gap-2',
        position === 'bottom-right' ? 'bottom-20 right-4' : 'bottom-20 left-4',
        className
      )}
      {...props}
    >
      {open && (
        <div className="flex flex-col items-end gap-2 mb-2">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => {
                action.onClick();
                setOpen(false);
              }}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg border bg-background text-sm font-medium transition-colors hover:bg-muted',
                action.variant === 'default' && 'bg-primary text-primary-foreground border-primary hover:bg-primary/90',
                action.variant === 'secondary' && 'bg-secondary text-secondary-foreground border-secondary',
                action.variant === 'destructive' && 'bg-destructive text-destructive-foreground border-destructive',
                action.variant === 'outline' && 'border-border hover:bg-muted'
              )}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
      <Button
        size="lg"
        className="size-14 rounded-full shadow-lg"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Tutup quick actions' : 'Buka quick actions'}
      >
        <Plus className={cn('size-6 transition-transform', open && 'rotate-45')} />
      </Button>
    </div>
  );
}

export { QuickActions };
