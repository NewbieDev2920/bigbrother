import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Inbox } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Tabs } from '@/components/ui/Tabs';
import { ProjectCard } from '@/components/project/ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useFollowedStore } from '@/store/useFollowedStore';
import { ai } from '@/services/ai';
import { mockProjects } from '@/data/mock';
import { timeAgo } from '@/lib/format';
import type { Project } from '@/types/project';

const tabs = [
  { key: 'visitados', label: 'Visitados' },
  { key: 'en_proceso', label: 'En proceso' },
  { key: 'finalizados', label: 'Finalizados' },
  { key: 'trending', label: 'Trending' },
];

export default function HistoryPage() {
  const [params, setParams] = useSearchParams();
  const active = params.get('tab') ?? 'visitados';
  const visited = useHistoryStore((s) => s.visited);
  const followedIds = useFollowedStore((s) => s.ids);

  const followedProjects = useMemo(
    () => mockProjects.filter((p) => followedIds.includes(p.id)),
    [followedIds]
  );

  const visitedProjects = useMemo(
    () =>
      visited
        .map((v) => {
          const p = mockProjects.find((mp) => mp.id === v.projectId);
          return p ? ({ project: p, meta: timeAgo(v.visitedAt) } as const) : null;
        })
        .filter((x): x is { project: Project; meta: string } => x !== null),
    [visited]
  );

  const trending = useQuery({
    queryKey: ['trending'],
    queryFn: () => ai.getTrending(),
    enabled: active === 'trending',
  });

  let content: { project: Project; meta?: string }[] = [];
  if (active === 'visitados') content = visitedProjects;
  if (active === 'en_proceso')
    content = followedProjects
      .filter((p) => p.estado === 'en_proceso')
      .map((p) => ({ project: p }));
  if (active === 'finalizados')
    content = followedProjects
      .filter((p) => p.estado === 'finalizado' || p.estado === 'suspendido')
      .map((p) => ({ project: p }));
  if (active === 'trending')
    content = (trending.data?.mayorRiesgo ?? []).map((p) => ({ project: p }));

  return (
    <PageShell>
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-navy-900">Mi historial</h1>
        <p className="mt-1 text-sm text-navy-300">
          Proyectos que has revisado, sigues o que están en tendencia.
        </p>
      </header>

      <div className="mb-5">
        <Tabs
          items={tabs}
          active={active}
          onChange={(key) => setParams({ tab: key }, { replace: true })}
        />
      </div>

      {active === 'trending' && trending.isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner size={28} />
        </div>
      ) : content.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Sin proyectos en esta categoría"
          description={
            active === 'visitados'
              ? 'Cuando visites un proyecto aparecerá aquí.'
              : 'Sigue proyectos desde su página para verlos en esta lista.'
          }
          action={
            <Link to="/">
              <Button>Explorar</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content.map(({ project, meta }) => (
            <ProjectCard key={project.id} project={project} meta={meta} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
