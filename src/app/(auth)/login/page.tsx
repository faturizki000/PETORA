'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      toast.success('Login berhasil');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center mb-8">
        <PawPrint className="h-12 w-12 text-primary mb-2" />
        <h1 className="text-2xl font-bold">Petora</h1>
        <p className="text-muted-foreground">Sistem Manajemen Pet</p>
      </div>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <Label htmlFor="pin">PIN (6 digit)</Label>
          <Input
            id="pin"
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Memuat...' : 'Login'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/forgot-password" className="text-primary hover:underline">Lupa PIN?</Link>
        </p>
      </form>
    </div>
  );
}
