'use client';

import { useQuery } from '@tanstack/react-query';
import { GroomingService } from '@/lib/services/grooming.service';
import { GroomingServiceCard } from '@/components/domain/grooming/service-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function GroomingServiceTable() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['grooming', 'services'],
    queryFn: () => GroomingService.listServices(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1" />
        <Button onClick={() => router.push('/dashboard/grooming/services/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>
      {isLoading ? (
        <Card className="p-6"><p className="text-muted-foreground">Loading...</p></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(data || []).map((service: Record<string, unknown>) => (
            <GroomingServiceCard key={service.id as string} service={service} />
          ))}
          {(!data || data.length === 0) && (
            <Card className="p-6 col-span-full">
              <p className="text-muted-foreground text-center">No services found</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
