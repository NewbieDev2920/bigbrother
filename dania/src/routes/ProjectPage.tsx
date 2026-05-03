import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';
import { ai } from '@/services/ai';
import { PageShell } from '@/components/layout/PageShell';
import { ProjectHeader } from '@/components/project/ProjectHeader';
import { RiskGauge } from '@/components/project/RiskGauge';
import { ProjectInfo } from '@/components/project/ProjectInfo';
import { MediaPanel } from '@/components/project/MediaPanel';
import { PdfPreview } from '@/components/project/PdfPreview';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { DashboardCard } from '@/components/project/DashboardCard';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useHistoryStore } from '@/store/useHistoryStore';
import { DASHBOARD_META } from '@/types/dashboard';

export default function ProjectPage() {
  const { id = '' } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => ai.getProject(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (data?.project) {
      useHistoryStore.getState().push(data.project.id);
    }
  }, [data?.project]);

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex justify-center py-20">
          <Spinner size={32} />
        </div>
      </PageShell>
    );
  }

  if (!data) {
    return (
      <PageShell>
        <EmptyState
          icon={Building2}
          title="Proyecto no encontrado"
          description="No encontramos información para este identificador."
          action={
            <Link to="/">
              <Button>Volver al inicio</Button>
            </Link>
          }
        />
      </PageShell>
    );
  }

  const { project } = data;
  const avanceWidth = `${Math.min(Math.max(project.avanceReal, 0), 100)}%`;

  return (
    <PageShell contained={false}>
      <ProjectHeader project={project} />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="flex flex-col items-center gap-4 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-navy-300">
              Riesgo de corrupción
            </h2>
            <RiskGauge score={project.riesgoCorrupcion} />
            <div className="w-full">
              <div className="mb-1 flex items-center justify-between text-xs text-navy-300">
                <span>Avance real</span>
                <span className="font-mono text-navy-700">
                  {project.avanceReal}% (reportado {project.avanceReportado}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-canvas-border">
                <div
                  className="h-full rounded-full bg-navy-700 transition-all"
                  style={{ width: avanceWidth }}
                />
              </div>
            </div>
            <ProjectInfo project={project} />
          </Card>
          <MediaPanel project={project} />
        </div>

        {/* Middle section: PDF + Chat */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_minmax(320px,420px)]">
          <PdfPreview url={project.pdfUrl} title={`Contrato — ${project.nombre}`} />
          <ChatPanel projectId={project.id} documentName={project.nombre} />
        </div>

        {/* Bottom: Dashboard cards */}
        <div>
          <h2 className="mb-3 font-serif text-lg text-navy-900">Project Analysis</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DASHBOARD_META.map((d) => (
              <DashboardCard
                key={d.key}
                projectId={project.id}
                dashboardKey={d.key}
                title={d.title}
              />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
