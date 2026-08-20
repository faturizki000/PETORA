'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Dialog } from '@/components/ui/dialog';
import { Command } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchIcon } from 'lucide-react';

interface GlobalSearchProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  items: {
    id: string;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    href?: string;
    onSelect?: () => void;
  }[];
  onSearch?: (query: string) => void;
  emptyMessage?: string;
  className?: string;
  children?: React.ReactNode;
}

function GlobalSearch({
  open,
  onOpenChange,
  placeholder = 'Cari...',
  items,
  onSearch,
  emptyMessage = 'Tidak ada hasil',
  className,
  ...props
}: GlobalSearchProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isOpen = open ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const newOpen = !isOpen;
        setIsOpen(newOpen);
        if (onOpenChange) onOpenChange(newOpen);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen, onOpenChange]);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filteredItems = React.useMemo(() => {
    if (!query) return items;
    const lower = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower)
    );
  }, [items, query]);

  const handleSelect = (item: typeof items[0]) => {
    setIsOpen(false);
    setQuery('');
    if (item.onSelect) {
      item.onSelect();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} {...props}>
      <Command className={cn('rounded-xl border shadow-md', className)}>
        <div className="flex items-center border-b px-3">
          <SearchIcon className="mr-2 size-4 shrink-0 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder={placeholder}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <ScrollArea className="max-h-[300px]">
          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted transition-colors text-left"
              >
                {item.icon && (
                  <span className="flex items-center justify-center size-8 rounded-lg bg-muted text-muted-foreground">
                    {item.icon}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  )}
                </div>
              </button>
            ))
          )}
        </ScrollArea>
      </Command>
    </Dialog>
  );
}

export { GlobalSearch };
