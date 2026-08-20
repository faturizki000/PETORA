'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Search, Plus } from 'lucide-react';
import type { Kiosk } from '@/types/kiosk';

export function KioskTable() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const data = useMemo(() => [] as Kiosk[], []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search kiosks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => router.push('/dashboard/kiosk/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Kiosk
        </Button>
      </div>
      {data.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center">No kiosks found</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device Name</TableHead>
                <TableHead>Device ID</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Last Heartbeat</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((kiosk) => (
                <TableRow key={kiosk.id}>
                  <TableCell className="font-medium">{kiosk.device_name}</TableCell>
                  <TableCell>{kiosk.device_id}</TableCell>
                  <TableCell>{kiosk.ip_address || '-'}</TableCell>
                  <TableCell>{kiosk.last_heartbeat ? new Date(kiosk.last_heartbeat).toLocaleString() : '-'}</TableCell>
                  <TableCell>
                    <Badge className={kiosk.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {kiosk.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
