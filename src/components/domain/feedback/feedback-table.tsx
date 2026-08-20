'use client';

import { useState, useMemo } from 'react';
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
import type { Feedback } from '@/types/feedback';

const statusColors: Record<string, string> = {
  OPEN: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

export function FeedbackTable() {
  const [search, setSearch] = useState('');

  const data = useMemo(() => [] as Feedback[], []);

  return (
    <div className="space-y-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search feedback..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      {data.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center">No feedback found</p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rating</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>{feedback.rating}/5</TableCell>
                  <TableCell>{feedback.category || '-'}</TableCell>
                  <TableCell>{feedback.comment ? feedback.comment.slice(0, 50) + (feedback.comment.length > 50 ? '...' : '') : '-'}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[feedback.status] || 'bg-gray-100 text-gray-800'}>{feedback.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(feedback.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
