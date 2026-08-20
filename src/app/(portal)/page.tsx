'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import type { Appointment, MedicalRecord, Invoice } from '@/types';
import { PawPrint, Calendar, FileText, Gift, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  upcomingAppointments: Appointment[];
  totalPets: number;
  recentMedicalRecords: MedicalRecord[];
  loyaltyPoints: number;
  recentInvoices: Invoice[];
}

function StatCard({ title, value, subtitle, href, icon: Icon }: {
  title: string;
  value: string | number;
  subtitle?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link href={href}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-lg font-semibold truncate">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>
      </Card>
    </Link>
  );
}

export default function PortalHome() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['portal', 'dashboard'],
    queryFn: async (): Promise<DashboardStats> => {
      const res = await fetch('/api/portal/dashboard');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Selamat Datang!</h1>
        <p className="text-muted-foreground text-sm">Kelola layanan dan informasi hewan peliharaan Anda</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Booking Aktif"
          value={stats?.upcomingAppointments?.length ?? 0}
          href="/(portal)/bookings"
          icon={Calendar}
        />
        <StatCard
          title="Total Pets"
          value={stats?.totalPets ?? 0}
          href="/(portal)/pets"
          icon={PawPrint}
        />
        <StatCard
          title="Rekam Medis"
          value={stats?.recentMedicalRecords?.length ?? 0}
          href="/(portal)/medical-records"
          icon={FileText}
        />
        <StatCard
          title="Poin Loyalty"
          value={stats?.loyaltyPoints ?? 0}
          href="/(portal)/loyalty"
          icon={Gift}
        />
      </div>

      {stats?.upcomingAppointments && stats.upcomingAppointments.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Booking Mendatang</h2>
          <div className="space-y-3">
            {stats.upcomingAppointments.slice(0, 3).map((apt) => (
              <Card key={apt.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{apt.appointment_type || 'Kunjungan'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(apt.appointment_date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {apt.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {stats?.recentInvoices && stats.recentInvoices.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Tagihan Terbaru</h2>
            <Link href="/(portal)/invoices" className="text-sm text-primary hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentInvoices.slice(0, 3).map((inv) => (
              <Card key={inv.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{inv.invoice_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(inv.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <p className="font-semibold">
                    Rp {inv.total_amount.toLocaleString('id-ID')}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
