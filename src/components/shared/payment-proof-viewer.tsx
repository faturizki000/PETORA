'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';

interface PaymentProofViewerProps extends React.ComponentProps<typeof Dialog> {
  images: string[];
  initialIndex?: number;
}

function PaymentProofViewer({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
  ...props
}: PaymentProofViewerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [zoom, setZoom] = React.useState(1);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.5, 4));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.5, 0.5));
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex];
    link.download = `payment-proof-${currentIndex + 1}`;
    link.click();
  };

  const handleOpenChange = (newOpen: boolean, eventDetails?: any) => {
    if (!newOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
    }
    if (onOpenChange) onOpenChange(newOpen, eventDetails);
  };

  if (images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} {...props}>
      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden">
        <div className="relative">
          <ScrollArea className="h-[70vh]">
            <div className="flex items-center justify-center p-4">
              <img
                src={images[currentIndex]}
                alt={`Bukti pembayaran ${currentIndex + 1}`}
                style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}
                className="max-w-full object-contain"
              />
            </div>
          </ScrollArea>

          {images.length > 1 && (
            <div className="absolute inset-y-0 left-4 flex items-center">
              <Button
                variant="secondary"
                size="icon"
                className="size-10"
                onClick={() => setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
              >
                ←
              </Button>
            </div>
          )}
          {images.length > 1 && (
            <div className="absolute inset-y-0 right-4 flex items-center">
              <Button
                variant="secondary"
                size="icon"
                className="size-10"
                onClick={() => setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
              >
                →
              </Button>
            </div>
          )}

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button variant="secondary" size="icon" className="size-10" onClick={handleZoomOut}>
              <ZoomOut className="size-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="secondary" size="icon" className="size-10" onClick={handleZoomIn}>
              <ZoomIn className="size-4" />
            </Button>
            <Button variant="secondary" size="icon" className="size-10" onClick={handleDownload}>
              <Download className="size-4" />
            </Button>
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    'size-2 rounded-full transition-colors',
                    idx === currentIndex ? 'bg-primary' : 'bg-muted-foreground/50'
                  )}
                  aria-label={`Gambar ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { PaymentProofViewer };
