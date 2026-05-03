import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Hammer, CheckCircle2, TrendingUp, X } from 'lucide-react';
import { Logo } from './Logo';

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const items = [
  { label: 'Historial', icon: Clock, to: '/historial?tab=visitados' },
  { label: 'En proceso', icon: Hammer, to: '/historial?tab=en_proceso' },
  { label: 'Finalizados', icon: CheckCircle2, to: '/historial?tab=finalizados' },
  { label: 'Trending', icon: TrendingUp, to: '/historial?tab=trending' },
];

export function SideMenu({ open, onClose }: SideMenuProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-navy-900/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-canvas-border bg-canvas-card shadow-card-lg"
          >
            <div className="flex items-center justify-between border-b border-canvas-border p-4">
              <Logo size="md" />
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-navy-300 hover:bg-navy-50"
                aria-label="Cerrar menú"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 p-3">
              <ul className="space-y-1">
                {items.map((it) => (
                  <li key={it.label}>
                    <Link
                      to={it.to}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy-700 hover:bg-royal-400/10 hover:text-royal-600"
                    >
                      <it.icon size={18} />
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-canvas-border p-4 text-xs text-navy-300">
              <p className="font-mono">v0.1.0 — Sprint frontend</p>
              <p className="mt-1 italic">"Dios es mi juez"</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
