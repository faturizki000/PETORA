'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

export interface CategoryTab {
  id: string;
  name: string;
  photo_url: string | null;
}

export function PosCategoryTabs({
  categories,
  selected,
  onSelect,
}: {
  categories: CategoryTab[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <ScrollArea>
      <div className="flex items-center gap-2 pb-2">
        <Button
          variant={selected === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selected === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(category.id)}
            className="flex items-center gap-2"
          >
            {category.photo_url ? (
              <img src={category.photo_url} alt={category.name} className="h-5 w-5 rounded" />
            ) : null}
            {category.name}
          </Button>
        ))}
      </div>
      <ScrollBar />
    </ScrollArea>
  );
}
