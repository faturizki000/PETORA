'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CustomerService } from '@/lib/services/customer.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const tagColors: Record<string, string> = {
  VIP: 'bg-yellow-100 text-yellow-800',
  REGULAR: 'bg-blue-100 text-blue-800',
  NEW: 'bg-green-100 text-green-800',
  BLACKLIST: 'bg-red-100 text-red-800',
  WHOLESALE: 'bg-purple-100 text-purple-800',
  BREEDER: 'bg-pink-100 text-pink-800',
};

export function CustomerTable() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['customers', 'list', { search }],
    queryFn: () => CustomerService.list({ search, limit: 50 }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => router.push('/dashboard/customers/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>
      {isLoading ? (
        <Card className="p-6"><p className="text-muted-foreground">Loading...</p></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.data.map((customer) => (
            <Card key={customer.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.phone || '-'}</p>
                </div>
                <div className="flex gap-1">
                  {customer.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} className={tagColors[tag] || ''}>{tag}</Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{customer.email || 'No email'}</p>
              <p className="text-sm text-muted-foreground">{customer.city || 'No city'}</p>
            </Card>
          ))}
          {data?.data.length === 0 && (
            <Card className="p-6 col-span-full">
              <p className="text-muted-foreground text-center">No customers found</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
