'use client';

import { useEffect, useRef } from 'react';

export function BarcodeScanner({ onScan }: { onScan: (barcode: string) => void }) {
  const buffer = useRef<string>('');
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onScan(buffer.current);
        buffer.current = '';
      } else {
        buffer.current += e.key;
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          buffer.current = '';
        }, 100);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [onScan]);

  return null;
}
