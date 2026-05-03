import { DollarSign, Building2, Calendar, HardHat, FileText, MapPin } from 'lucide-react';
import type { Project } from '@/types/project';
import { formatCOP, formatDateRange } from '@/lib/format';

export function ProjectInfo({ project }: { project: Project }) {
  const items = [
    { icon: DollarSign, label: 'Costo', value: formatCOP(project.costo), mono: true },
    { icon: Building2, label: 'Entidad', value: project.entidad },
    {
      icon: Calendar,
      label: 'Periodo',
      value: formatDateRange(project.fechaInicio, project.fechaFin),
      mono: true,
    },
    {
      icon: HardHat,
      label: 'Contratista',
      value: `${project.contratista.nombre} (${project.contratista.nit})`,
      mono: true,
    },
    { icon: FileText, label: 'Modalidad', value: project.modalidadContratacion },
    {
      icon: MapPin,
      label: 'Ubicación',
      value: `${project.ubicacion.direccion} — ${project.ubicacion.municipio}, ${project.ubicacion.departamento}`,
    },
  ];
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((it) => (
        <div key={it.label} className="flex items-start gap-3">
          <span className="mt-0.5 rounded-lg bg-navy-50 p-1.5 text-navy-700">
            <it.icon size={14} />
          </span>
          <div className="min-w-0 flex-1">
            <dt className="text-xs uppercase tracking-wider text-navy-300">{it.label}</dt>
            <dd
              className={`truncate text-sm text-navy-900 ${it.mono ? 'font-mono' : ''}`}
              title={it.value}
            >
              {it.value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
