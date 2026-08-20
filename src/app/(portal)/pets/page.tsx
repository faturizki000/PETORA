'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PetService } from '@/lib/services/pet.service';
import type { Pet } from '@/types';
import { PawPrint, Calendar, Edit, Trash2 } from 'lucide-react';

export default function PetsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['portal', 'pets'],
    queryFn: () => PetService.list({}),
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <h1 className="text-xl font-bold">Pets Saya</h1>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 h-24 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-destructive">Gagal memuat data pets.</p>
      </div>
    );
  }

  const pets = data?.data ?? [];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Pets Saya</h1>
        <Button>+ Tambah Pet</Button>
      </div>

      {pets.length === 0 ? (
        <Card className="p-8 text-center">
          <PawPrint className="size-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Belum ada data pet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {pets.map((pet: Pet) => (
            <Card key={pet.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {pet.photo_url ? (
                    <img src={pet.photo_url} alt={pet.name} className="size-full object-cover" />
                  ) : (
                    <PawPrint className="size-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{pet.name}</p>
                    {pet.is_neutered && (
                      <Badge variant="secondary" className="text-[10px]">Steril</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {pet.species}{pet.breed ? ` • ${pet.breed}` : ''}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pet.gender === 'male' ? 'Jantan' : pet.gender === 'female' ? 'Betina' : pet.gender}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="size-8">
                    <Edit className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8 text-destructive">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              {pet.birth_date && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Calendar className="size-3" />
                  Lahir: {new Date(pet.birth_date).toLocaleDateString('id-ID')}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
