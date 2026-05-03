import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/Spinner';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface NitScoringSectionProps {
  tributaries: { name: string; nit: string }[];
}

const FEATURE_LABELS: Record<string, string> = {
  x1_sanciones: 'Sanciones',
  x2_concentracion_contratos: 'Concentración',
  x3_max_modalidad: 'Modalidad',
  x4_dias_desde_creacion: 'Antigüedad',
  x5_razon_anticipo: 'Anticipo',
  x6_razon_ejecucion: 'Ejecución',
  x7_max_log_growth_count: 'Crecimiento Vol.',
  x8_max_log_growth_value: 'Crecimiento Fin.',
  x9_max_concentracion_entidad_proveedor: 'Dependencia',
  x10_velocidad_adjudicacion_dias: 'Velocidad Adj.',
  x11_prob_ganar_adjudicacion: 'Éxito',
};

export function DaniaScoringSection({ tributaries }: NitScoringSectionProps) {
  const nits = tributaries.map(t => t.nit);
  
  const { data, isLoading } = useQuery({
    queryKey: ['dania-batch', nits],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/dania/batch-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nits })
      });
      return res.json();
    },
    enabled: nits.length > 0
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-12 bg-canvas-card rounded-3xl border border-canvas-border animate-pulse">
      <Spinner size={24} className="text-navy-300 mb-4" />
      <span className="text-xs font-bold text-navy-300 uppercase tracking-widest">Ejecutando Scoring Dania...</span>
    </div>
  );
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="font-serif text-2xl text-navy-900">Análisis Individual de Contratistas</h2>
        <div className="h-px flex-1 bg-canvas-border"></div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {data.map((res: any, i: number) => {
          if (res.error) return null;
          const nitInfo = tributaries.find(t => t.nit === res.nit) || { name: 'Desconocido' };
          const isHigh = res.d >= 0.7;
          const isMedium = res.d >= 0.3 && res.d < 0.7;
          
          return (
            <div key={res.nit} className="group relative bg-white border border-canvas-border rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${
                isHigh ? 'bg-red-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-navy-900 text-lg mb-1 leading-tight">{nitInfo.name}</h4>
                    <span className="font-mono text-[10px] text-navy-400 font-bold uppercase tracking-widest">NIT {res.nit}</span>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${
                    isHigh ? 'bg-red-50 text-red-700 border-red-100' : 
                    isMedium ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                    'bg-emerald-50 text-emerald-700 border-emerald-100'
                  }`}>
                    {isHigh ? <AlertOctagon size={14} /> : isMedium ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                    Riesgo {res.riesgo}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
                  {Object.entries(res.vector_x).slice(0, 8).map(([k, v]: [string, any]) => (
                    <div key={k} className="flex flex-col">
                      <span className="text-[9px] text-navy-300 font-bold uppercase tracking-tight mb-1">{FEATURE_LABELS[k] || k}</span>
                      <span className="text-xs font-mono font-bold text-navy-700">
                        {typeof v === 'number' ? v.toFixed(v < 1 ? 6 : 2) : v}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-canvas-border/50 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-navy-300 font-bold uppercase mb-1">Índice Dania Final</span>
                    <div className="text-2xl font-mono font-black text-navy-900">
                      {res.d.toFixed(6)}
                    </div>
                  </div>
                  <div className="h-10 w-24 bg-navy-50 rounded-xl overflow-hidden relative border border-navy-100">
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-1000 ${
                        isHigh ? 'bg-red-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(res.d * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
