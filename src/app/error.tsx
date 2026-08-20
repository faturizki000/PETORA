'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const message = process.env.NODE_ENV === 'production'
    ? 'Terjadi kesalahan tak terduga. Tim kami telah mendapat notifikasi.'
    : error.message;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Terjadi Kesalahan</h2>
        <p className="text-muted-foreground">{message}</p>
        <button onClick={reset} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Coba Lagi</button>
      </div>
    </div>
  );
}
