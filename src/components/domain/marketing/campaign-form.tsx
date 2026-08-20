'use client';

import { useState, useMemo } from 'react';
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
import { Search } from 'lucide-react';
import type { Campaign } from '@/types/marketing';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SCHEDULED: 'bg-blue-100 text-blue-800',
  SENDING: 'bg-yellow-100 text-yellow-800',
  SENT: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
};

export function CampaignForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Card className="p-6">
      <p className="text-muted-foreground">Campaign form coming soon</p>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancel</Button>
        <Button type="button" disabled={isSubmitting}>Create Campaign</Button>
      </div>
    </Card>
  );
}
