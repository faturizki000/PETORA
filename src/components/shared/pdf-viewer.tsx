'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, ZoomIn, ZoomOut, Download } from 'lucide-react';

interface PdfViewerProps extends React.ComponentProps<typeof Dialog> {
  url: string;
  fileName?: string;
}

function PdfViewer({ url, fileName = 'document.pdf', ...props }: PdfViewerProps) {
  const [zoom, setZoom] = React.useState(1);

  if (!url) return null;

  return (
    <Dialog {...props}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <FileText className="size-5" />
            <span className="font-medium truncate">{fileName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-8" onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}>
              <ZoomOut className="size-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="ghost" size="icon" className="size-8" onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}>
              <ZoomIn className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => {
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
              }}
            >
              <Download className="size-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div
            className="flex items-center justify-center p-4"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            <iframe
              src={url}
              className="w-full h-[75vh] border-0"
              title={fileName}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export { PdfViewer };
