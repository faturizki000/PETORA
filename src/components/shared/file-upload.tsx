'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, FileText, Image, AlertCircle } from 'lucide-react';

type FileStatus = 'pending' | 'uploading' | 'success' | 'error';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: FileStatus;
  error?: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  onUpload?: (files: File[]) => Promise<void>;
  value?: File[];
  onChange?: (files: File[]) => void;
  className?: string;
}

function FileUpload({
  accept = 'image/*,.pdf,.doc,.docx',
  multiple = true,
  maxFiles = 10,
  maxSizeMB = 10,
  onUpload,
  className,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = React.useState(false);

  const validateFile = (file: File): string | null => {
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      return `Ukuran file melebihi ${maxSizeMB}MB`;
    }
    return null;
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      progress: 0,
      status: validateFile(file) ? 'error' : 'pending',
      error: validateFile(file) || undefined,
    }));

    const updated = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(updated);

    const validFiles = newFiles.filter((f) => f.status !== 'error');
    if (validFiles.length > 0 && onUpload) {
      simulateUpload(updated.map((f) => f.id));
    }
  };

  const simulateUpload = async (fileIds: string[]) => {
    for (const id of fileIds) {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: 'uploading' as FileStatus } : f))
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: 'success' as FileStatus, progress: 100 } : f
        )
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="size-5" />;
    return <FileText className="size-5" />;
  };

  return (
  <div
    className={cn('space-y-3', className)}
  >
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        )}
      >
        <Upload className={cn('size-8', dragActive ? 'text-primary' : 'text-muted-foreground')} />
        <p className="text-sm font-medium">
          {dragActive ? 'Lepaskan file di sini' : 'Klik atau seret file ke sini'}
        </p>
        <p className="text-xs text-muted-foreground">
          Maks {maxFiles} file, {maxSizeMB}MB per file
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 rounded-lg border"
            >
              {file.preview ? (
                <img src={file.preview} alt={file.file.name} className="size-10 rounded object-cover" />
              ) : (
                <div className="size-10 rounded bg-muted flex items-center justify-center text-muted-foreground">
                  {getFileIcon(file.file)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {file.status === 'uploading' && (
                  <Progress value={file.progress} className="h-1 mt-1" />
                )}
                {file.status === 'error' && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="size-3" />
                    {file.error}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => removeFile(file.id)}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { FileUpload };
