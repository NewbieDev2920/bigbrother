import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, FileText } from 'lucide-react';
import { ai } from '@/services/ai';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { AspectChart } from '@/components/project/AnalysisCard';
import type { AspectKey } from '@/types/analysis';
import { ASPECT_KEYS, ASPECT_LABELS, CAPA_LABELS } from '@/types/analysis';
import { scoreToRiskLevel, getRiskColorClasses } from '@/lib/risk';
import { cn } from '@/lib/cn';

export default function DetailPage() {
  const { id = '', aspecto } = useParams<{ id: string; aspecto: AspectKey }>();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => ai.getProject(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex justify-center py-20">
          <Spinner size={32} />
        </div>
      </PageShell>
    );
  }

  if (!data || !aspecto || !ASPECT_KEYS.includes(aspecto as AspectKey)) {
    return (
      <PageShell>
        <EmptyState title="Aspecto no encontrado" description="Verifica el enlace e inténtalo nuevamente." />
      </PageShell>
    );
  }

  const aspect = aspecto as AspectKey;
  const { project, analysis } = data;
  const aspectScore = analysis.aspectos[aspect];
  const idx = ASPECT_KEYS.indexOf(aspect);
  const prev = idx > 0 ? ASPECT_KEYS[idx - 1] : null;
  const next = idx < ASPECT_KEYS.length - 1 ? ASPECT_KEYS[idx + 1] : null;
  const level = scoreToRiskLevel(aspectScore.score);
  const c = getRiskColorClasses(level);

  return (
    <PageShell contained={false}>
      <div className="sticky top-14 z-20 border-b border-canvas-border bg-canvas-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to={`/proyecto/${project.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft size={14} /> Volver al proyecto
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className={cn('rounded-full border px-3 py-1 text-xs font-semibold', c.bg, c.text, c.border)}>
              {ASPECT_LABELS[aspect]} · {aspectScore.score}/100
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={!prev}
              onClick={() => prev && navigate(`/proyecto/${project.id}/aspecto/${prev}`)}
            >
              <ChevronLeft size={14} /> {prev ? ASPECT_LABELS[prev] : '—'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!next}
              onClick={() => next && navigate(`/proyecto/${project.id}/aspecto/${next}`)}
            >
              {next ? ASPECT_LABELS[next] : '—'} <ChevronRight size={14} />
            </Button>
            <Button onClick={() => setChatOpen(true)} size="sm">
              <MessageCircle size={14} /> Chat IA
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8">
        <header>
          <p className="text-xs font-medium uppercase tracking-wider text-navy-300">{project.nombre}</p>
          <h1 className="font-serif text-3xl text-navy-900">Análisis: {ASPECT_LABELS[aspect]}</h1>
          <p className="mt-1 text-sm text-navy-700">{aspectScore.resumen}</p>
        </header>

        <Card className="p-6">
          <h2 className="mb-3 font-serif text-lg text-navy-900">Análisis completo</h2>
          <div className="space-y-3 text-[15px] leading-relaxed text-navy-700">
            {aspectScore.detalle.split('\n\n').map((par, i) => (
              <p key={i}>{par}</p>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-3 font-serif text-lg text-navy-900">Visualización detallada</h2>
          <div className="rounded-xl border border-canvas-border p-4">
            <AspectChart aspect={aspect} chartData={aspectScore.chartData} height={360} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-serif text-lg text-navy-900">Hallazgos detectados</h2>
          {aspectScore.hallazgos.length === 0 ? (
            <p className="text-sm text-navy-300">Sin hallazgos relevantes para este aspecto.</p>
          ) : (
            <ul className="space-y-3">
              {aspectScore.hallazgos.map((h) => (
                <li
                  key={h.id}
                  className="rounded-xl border border-canvas-border p-4 transition-colors hover:border-navy-300"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <RiskBadge
                      score={h.severidad === 'high' ? 80 : h.severidad === 'medium' ? 30 : 5}
                      showScore={false}
                    />
                    <span className="text-[10px] uppercase tracking-wider text-navy-300">
                      {CAPA_LABELS[h.capa]}
                    </span>
                  </div>
                  <h3 className="mb-1 font-serif text-base text-navy-900">{h.titulo}</h3>
                  <p className="text-sm text-navy-700">{h.descripcion}</p>
                  {h.ubicacionEnDocumento && (
                    <p className="mt-2 inline-flex items-center gap-1 text-xs text-royal-600">
                      <FileText size={12} /> Ver en documento, página {h.ubicacionEnDocumento.pagina}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Modal open={chatOpen} onClose={() => setChatOpen(false)} title="Chat con IA" className="max-w-2xl">
        <div className="h-[520px]">
          <ChatPanel projectId={project.id} documentName={project.nombre} className="h-full" />
        </div>
      </Modal>
    </PageShell>
  );
}
