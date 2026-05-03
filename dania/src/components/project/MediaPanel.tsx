import { useState } from 'react';
import { Camera, Map as MapIcon, Eye, ImageOff } from 'lucide-react';
import type { Project } from '@/types/project';
import { Button } from '@/components/ui/Button';
import { MediaModal } from './MediaModal';

export function MediaPanel({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const cover =
    project.imagenes.actual ?? project.imagenes.proyeccion ?? project.imagenes.antes;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative flex h-full min-h-[220px] w-full overflow-hidden rounded-2xl border border-canvas-border bg-navy-50"
        aria-label="Ver imágenes y mapa"
      >
        {cover ? (
          <img
            src={cover}
            alt={`Estado del proyecto ${project.nombre}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-navy-300">
            <ImageOff size={36} />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-navy-900/80 to-transparent p-3 text-white">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-xs font-medium backdrop-blur">
              <Camera size={12} /> Imágenes
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-xs font-medium backdrop-blur">
              <MapIcon size={12} /> Mapa
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-xs font-medium backdrop-blur">
              <Eye size={12} /> Street View
            </span>
          </div>
          <Button variant="secondary" size="sm" className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20">
            Abrir
          </Button>
        </div>
      </button>
      <MediaModal open={open} onClose={() => setOpen(false)} project={project} />
    </>
  );
}
