import { DollarSign, Building2, Calendar, HardHat, FileText, MapPin } from 'lucide-react';
import type { Project } from '@/types/project';
import { formatCOP, formatDateRange } from '@/lib/format';
import type { AnalysisResult } from '@/types/analysis';

export function ProjectInfo({ project, analysis }: { project: Project; analysis?: AnalysisResult }) {
  const items = [
    { icon: DollarSign, label: 'Costo', value: analysis?.costo || formatCOP(project.costo), mono: true },
    { icon: Building2, label: 'Entidades', value: analysis?.listaEntidades?.join(', ') || project.entidad },
    {
      icon: Calendar,
      label: 'Periodo',
      value: analysis?.periodo || formatDateRange(project.fechaInicio, project.fechaFin),
      mono: true,
    },
    {
      icon: HardHat,
      label: 'Contratistas',
      value: analysis?.listaContratistas?.join(', ') || `${project.contratista.nombre} (${project.contratista.nit})`,
      mono: true,
    },
    { icon: FileText, label: 'Modalidad', value: analysis?.modalidad || project.modalidadContratacion },
    {
      icon: MapPin,
      label: 'Ubicación',
      value: analysis?.ubicacion || `${project.ubicacion.direccion} — ${project.ubicacion.municipio}, ${project.ubicacion.departamento}`,
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
              className={`text-sm text-navy-900 break-words ${it.mono ? 'font-mono' : ''}`}
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
