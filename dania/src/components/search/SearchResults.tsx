import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import type { Project } from '@/types/project';
import { Spinner } from '@/components/ui/Spinner';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { formatCOP } from '@/lib/format';

interface SearchResultsProps {
  query: string;
  loading: boolean;
  exactMatch: Project | null;
  similar: Project[];
}

function ResultRow({ p, exact }: { p: Project; exact?: boolean }) {
  return (
    <Link
      to={`/proyecto/${p.id}`}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-navy-50"
    >
      <span className="rounded-lg bg-navy-50 p-2 text-navy-700">
        <Building2 size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-navy-900">
          {p.nombre}
          {exact && <span className="ml-2 text-[10px] uppercase text-royal-600">Coincidencia exacta</span>}
        </p>
        <p className="truncate text-xs text-navy-300">
          {p.entidad} · {p.ubicacion.departamento} · <span className="font-mono">{formatCOP(p.costo)}</span>
        </p>
      </div>
      <RiskBadge score={p.riesgoCorrupcion} showScore={false} />
    </Link>
  );
}

export function SearchResults({ loading, exactMatch, similar }: SearchResultsProps) {
  const empty = !loading && !exactMatch && similar.length === 0;
  return (
    <div className="absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-96 overflow-auto rounded-2xl border border-canvas-border bg-canvas-card p-2 shadow-card-lg scrollbar-thin">
      {loading && (
        <div className="flex items-center gap-2 px-3 py-3 text-sm text-navy-300">
          <Spinner size={16} /> Buscando...
        </div>
      )}
      {empty && <p className="px-3 py-3 text-sm text-navy-300">Sin resultados.</p>}
      {exactMatch && <ResultRow p={exactMatch} exact />}
      {similar.length > 0 && (
        <>
          <p className="px-3 pb-1 pt-2 text-[10px] uppercase tracking-wider text-navy-300">
            Resultados similares
          </p>
          {similar.map((p) => (
            <ResultRow key={p.id} p={p} />
          ))}
        </>
      )}
    </div>
  );
}
