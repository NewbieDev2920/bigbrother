import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface PdfPreviewProps {
  url: string;
  title?: string;
}

export function PdfPreview({ url, title = 'Documento' }: PdfPreviewProps) {
  const [pages, setPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-canvas-border bg-canvas-card">
      <div className="flex items-center justify-between border-b border-canvas-border p-3">
        <div className="flex items-center gap-2 text-navy-700">
          <FileText size={16} />
          <span className="truncate text-sm font-medium">{title}</span>
        </div>
        <a href={url} download>
          <Button variant="ghost" size="sm">
            <Download size={14} /> Descargar
          </Button>
        </a>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-auto bg-navy-50/40 p-4 scrollbar-thin">
        {error ? (
          <div className="flex flex-col items-center gap-2 text-navy-300">
            <FileText size={32} />
            <p className="text-sm">Vista previa no disponible</p>
            <a href={url} target="_blank" rel="noreferrer" className="text-xs text-royal-600 underline">
              Abrir documento
            </a>
          </div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setPages(numPages)}
            onLoadError={() => setError(true)}
            loading={<Spinner />}
            className="shadow-card"
          >
            <Page
              pageNumber={page}
              width={520}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        )}
      </div>

      {pages && pages > 1 && !error && (
        <div className="flex items-center justify-between border-t border-canvas-border p-3 text-sm text-navy-700">
          <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft size={14} /> Prev
          </Button>
          <span className="font-mono text-xs">
            {page} / {pages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ChevronRight size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
