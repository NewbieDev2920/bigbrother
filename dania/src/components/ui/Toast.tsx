import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore, type ToastVariant } from '@/store/useToastStore';
import { cn } from '@/lib/cn';

const icon: Record<ToastVariant, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

const variantClasses: Record<ToastVariant, string> = {
  info: 'border-navy-100 bg-navy-50 text-navy-900',
  success: 'border-risk-low/30 bg-risk-low/10 text-risk-low',
  warning: 'border-risk-medium/40 bg-risk-medium/10 text-risk-medium',
  error: 'border-risk-high/40 bg-risk-high/10 text-risk-high',
};

export function ToastContainer() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icon[t.variant];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              className={cn(
                'pointer-events-auto flex min-w-[280px] max-w-md items-start gap-3 rounded-xl border bg-canvas-card px-4 py-3 shadow-card-lg',
                variantClasses[t.variant]
              )}
              role="status"
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1 text-sm">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="opacity-60 hover:opacity-100"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
