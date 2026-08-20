'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cat, Dog, Bird, Fish, Rabbit, Other } from 'lucide-react';
import type { Pet } from '@/types/pet';

const speciesIcons: Record<string, React.ElementType> = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  fish: Fish,
  rabbit: Rabbit,
};

export function PetCard({ pet }: { pet: Pet }) {
  const Icon = speciesIcons[pet.species.toLowerCase()] || Other;

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{pet.name}</h3>
              <p className="text-sm text-muted-foreground">{pet.species} {pet.breed ? `• ${pet.breed}` : ''}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {pet.gender && <Badge variant="outline">{pet.gender}</Badge>}
            {pet.is_neutered && <Badge variant="secondary">Neutered</Badge>}
          </div>
          {pet.color && (
            <p className="text-sm text-muted-foreground mt-2">Color: {pet.color}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
