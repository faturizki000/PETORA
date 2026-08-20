import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Halaman tidak ditemukan</p>
        <Link href="/dashboard" className="text-primary hover:underline">Kembali ke Dashboard</Link>
      </div>
    </div>
  );
}
