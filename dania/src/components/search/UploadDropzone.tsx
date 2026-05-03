import { type DragEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText } from 'lucide-react';
import { useAnalyze } from '@/hooks/useAnalyze';
import { useUploadStore } from '@/store/useUploadStore';
import { toast } from '@/store/useToastStore';
import { AnalyzingModal } from './AnalyzingModal';
import { cn } from '@/lib/cn';

export function UploadDropzone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const status = useUploadStore((s) => s.status);
  const reset = () => useUploadStore.getState().reset();
  const [over, setOver] = useState(false);
  const analyze = useAnalyze();

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('El archivo debe ser un PDF');
      return;
    }
    analyze.mutate(file, {
      onSuccess: ({ project, alreadyExisted }) => {
        if (alreadyExisted) toast.info('Documento ya existente — abriendo análisis previo');
        navigate(`/proyecto/${project.id}`);
        setTimeout(reset, 600);
      },
      onError: (err) => toast.error(err.message ?? 'Falló el análisis'),
    });
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        className={cn(
          'group relative flex w-full max-w-2xl cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 transition-colors',
          over
            ? 'border-royal-400 bg-royal-400/5'
            : 'border-canvas-border bg-canvas-card hover:border-navy-300'
        )}
      >
        <span className="rounded-full bg-navy-50 p-3 text-navy-700 transition-transform group-hover:scale-105">
          <UploadCloud size={26} />
        </span>
        <p className="font-medium text-navy-900">Arrastra un PDF o haz clic para subir un contrato</p>
        <p className="text-sm text-navy-300">El sistema detectará si ya fue analizado antes.</p>
        <p className="flex items-center gap-1 text-[11px] text-navy-300">
          <FileText size={12} /> Solo archivos PDF
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />
      </div>
      <AnalyzingModal open={status === 'analyzing' || status === 'hashing' || status === 'checking'} />
    </>
  );
}
