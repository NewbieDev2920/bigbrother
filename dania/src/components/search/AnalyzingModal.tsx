import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useUploadStore } from '@/store/useUploadStore';

const STAGES = [
  'Capa 1 — Análisis documental',
  'Capa 2 — Verificación de coherencia',
  'Capa 3 — Cláusulas contractuales',
  'Capa 4 — Análisis semántico de APU',
  'Capa 5 — Redes y cadena societaria',
];

export function AnalyzingModal({ open }: { open: boolean }) {
  const [stage, setStage] = useState(0);
  const fileName = useUploadStore((s) => s.fileName);

  useEffect(() => {
    if (!open) return;
    setStage(0);
    const t = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 800);
    return () => clearInterval(t);
  }, [open]);

  return (
    <Modal open={open} onClose={() => {}} hideClose className="max-w-md text-center">
      <div className="flex flex-col items-center gap-4 py-4">
        <Spinner size={36} />
        <h3 className="font-serif text-lg text-navy-900">Analizando documento</h3>
        {fileName && <p className="font-mono text-xs text-navy-300">{fileName}</p>}
        <ul className="w-full space-y-1.5">
          {STAGES.map((s, i) => (
            <li
              key={s}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                i === stage
                  ? 'bg-royal-400/10 text-royal-600'
                  : i < stage
                  ? 'text-navy-700'
                  : 'text-navy-300'
              }`}
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  i === stage ? 'bg-royal-600 animate-pulse' : i < stage ? 'bg-risk-low' : 'bg-canvas-border'
                }`}
              />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
