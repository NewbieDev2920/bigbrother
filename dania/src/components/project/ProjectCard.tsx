import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin } from 'lucide-react';
import type { Project } from '@/types/project';
import { Badge } from '@/components/ui/Badge';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { formatCOP, formatDateRange } from '@/lib/format';
import { cn } from '@/lib/cn';

interface ProjectCardProps {
  project: Project;
  className?: string;
  fullWidth?: boolean;
  meta?: string;
}

export function ProjectCard({ project, className, fullWidth, meta }: ProjectCardProps) {
  const thumbnail = project.imagenes.actual ?? project.imagenes.proyeccion ?? project.imagenes.antes;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={cn('h-full', fullWidth && 'w-full', className)}
    >
      <Link
        to={`/proyecto/${project.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-canvas-border bg-canvas-card shadow-card transition-shadow hover:shadow-card-lg"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy-50">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={project.nombre}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-navy-300">
              <Building2 size={32} />
            </div>
          )}
          <div className="absolute right-2 top-2">
            <RiskBadge score={project.riesgoCorrupcion} />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center gap-2 text-xs text-navy-300">
            <Badge color="royal">{project.categoria}</Badge>
            {meta && <span className="font-mono">{meta}</span>}
          </div>
          <h3 className="line-clamp-2 font-serif text-base text-navy-900 group-hover:text-navy-700">
            {project.nombre}
          </h3>
          <p className="text-sm text-navy-300">{project.entidad}</p>
          <div className="mt-auto flex items-center justify-between pt-2 text-xs text-navy-700">
            <span className="font-mono">{formatCOP(project.costo)}</span>
            <span className="inline-flex items-center gap-1 text-navy-300">
              <MapPin size={12} /> {project.ubicacion.departamento}
            </span>
          </div>
          <p className="font-mono text-[11px] text-navy-300">
            {formatDateRange(project.fechaInicio, project.fechaFin)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
