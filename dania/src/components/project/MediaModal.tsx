import { useState } from 'react';
import type { Project } from '@/types/project';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { ImageOff } from 'lucide-react';

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  project: Project;
}

const tabs = [
  { key: 'antes', label: 'Antes' },
  { key: 'proyeccion', label: 'Proyección' },
  { key: 'actual', label: 'Estado actual' },
  { key: 'mapa', label: 'Mapa' },
  { key: 'street', label: 'Street View' },
];

export function MediaModal({ open, onClose, project }: MediaModalProps) {
  const [active, setActive] = useState('actual');
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY ?? '';

  const renderImage = (key: 'antes' | 'proyeccion' | 'actual') => {
    const src = project.imagenes[key];
    if (!src) return <EmptyState icon={ImageOff} title="Sin imagen disponible" />;
    return (
      <img src={src} alt={key} className="h-[420px] w-full rounded-xl object-cover" />
    );
  };

  return (
    <Modal open={open} onClose={onClose} title={project.nombre} className="max-w-3xl">
      <div className="space-y-4">
        <Tabs items={tabs} active={active} onChange={setActive} />
        <div>
          {active === 'antes' && renderImage('antes')}
          {active === 'proyeccion' && renderImage('proyeccion')}
          {active === 'actual' && renderImage('actual')}
          {active === 'mapa' && (
            <iframe
              title="Mapa"
              className="h-[420px] w-full rounded-xl border border-canvas-border"
              loading="lazy"
              src={
                apiKey
                  ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${project.ubicacion.lat},${project.ubicacion.lng}`
                  : `https://maps.google.com/maps?q=${project.ubicacion.lat},${project.ubicacion.lng}&z=12&output=embed`
              }
            />
          )}
          {active === 'street' && (
            <iframe
              title="Street View"
              className="h-[420px] w-full rounded-xl border border-canvas-border"
              loading="lazy"
              src={
                apiKey
                  ? `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${project.ubicacion.lat},${project.ubicacion.lng}&heading=210&pitch=10&fov=90`
                  : `https://maps.google.com/maps?q=&layer=c&cbll=${project.ubicacion.lat},${project.ubicacion.lng}&output=svembed`
              }
            />
          )}
        </div>
        <p className="font-mono text-xs text-navy-300">
          {project.ubicacion.direccion} — {project.ubicacion.municipio}, {project.ubicacion.departamento}
        </p>
      </div>
    </Modal>
  );
}
