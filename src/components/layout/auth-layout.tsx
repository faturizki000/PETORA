'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PawPrint } from 'lucide-react';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8">
          <PawPrint className="h-12 w-12 text-primary mb-2" />
          <h1 className="text-2xl font-bold">Petora</h1>
          <p className="text-muted-foreground">Sistem Manajemen Pet</p>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          {children}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          © {new Date().getFullYear()} Petora. All rights reserved.
        </p>
      </div>
    </div>
  );
}
