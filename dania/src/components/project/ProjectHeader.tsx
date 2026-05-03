import { Star, StarOff } from 'lucide-react';
import type { Project } from '@/types/project';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useFollowedStore } from '@/store/useFollowedStore';
import { toast } from '@/store/useToastStore';

const estadoLabels = {
  en_proceso: 'En proceso',
  finalizado: 'Finalizado',
  suspendido: 'Suspendido',
};

export function ProjectHeader({ project }: { project: Project }) {
  const followed = useFollowedStore((s) => s.ids.includes(project.id));

  const handleToggle = () => {
    useFollowedStore.getState().toggle(project.id);
    toast.success(followed ? 'Proyecto retirado de seguimiento' : 'Proyecto agregado a seguimiento');
  };

  return (
    <div className="sticky top-14 z-20 border-b border-canvas-border bg-canvas-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge color="navy">{estadoLabels[project.estado]}</Badge>
            <Badge color="royal">{project.categoria}</Badge>
            <Badge color="neutral">{project.modalidadContratacion}</Badge>
          </div>
          <h1 className="truncate font-serif text-xl text-navy-900 sm:text-2xl">{project.nombre}</h1>
          <p className="text-sm text-navy-300">{project.entidad}</p>
        </div>
        <Button variant={followed ? 'primary' : 'secondary'} size="md" onClick={handleToggle}>
          {followed ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
          {followed ? 'Siguiendo' : 'Seguir proyecto'}
        </Button>
      </div>
    </div>
  );
}
