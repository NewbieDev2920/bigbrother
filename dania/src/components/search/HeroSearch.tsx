import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { ai } from '@/services/ai';
import { Spinner } from '@/components/ui/Spinner';

interface DaniaResult {
  nit: string;
  d: number;
  riesgo: string;
  delta: number;
  vector_x: Record<string, number>;
  company_info?: Record<string, any>;
  error?: string;
}
const FEATURE_LABELS: Record<string, string> = {
  x1_sanciones: 'Historial de Sanciones',
  x2_concentracion_contratos: 'Concentración de Contratos',
  x3_max_modalidad: 'Modalidad de Contratación',
  x4_dias_desde_creacion: 'Antigüedad (Días)',
  x5_razon_anticipo: 'Razón de Anticipo',
  x6_razon_ejecucion: 'Eficiencia de Ejecución',
  x7_max_log_growth_count: 'Crecimiento Volumétrico',
  x8_max_log_growth_value: 'Crecimiento Financiero',
  x9_max_concentracion_entidad_proveedor: 'Dependencia de Entidad',
  x10_velocidad_adjudicacion_dias: 'Velocidad de Adjudicación',
  x11_prob_ganar_adjudicacion: 'Tasa de Éxito',
};

export function HeroSearch() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<DaniaResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!value.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await ai.searchByNit(value.trim());
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ 
        error: 'NIT no encontrado en la base de datos de SECOP II', 
        nit: value, d: 0, riesgo: 'N/A', delta: 0, vector_x: {} 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl gap-8">
      {/* Search Bar Container */}
      <div className="relative w-full max-w-2xl group">
        <div className="absolute -inset-1 bg-gradient-to-r from-royal-600 to-navy-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center">
          <Search className="absolute left-5 text-navy-400" size={20} />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ingrese el NIT del contratista para auditoría express..."
            className="h-16 w-full rounded-2xl border border-canvas-border bg-white/80 backdrop-blur-xl pl-14 pr-32 text-lg text-navy-900 shadow-2xl placeholder:text-navy-300 focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 outline-none transition-all"
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="absolute right-2 h-12 px-6 rounded-xl bg-navy-900 text-white hover:bg-black flex items-center gap-2 font-semibold shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <Spinner size={18} className="text-white" /> : <>Analizar <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>

      {result && (
        <div className="w-full bg-white border border-canvas-border shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {result.error ? (
            <div className="p-12 text-center">
              <div className="inline-flex p-4 rounded-full bg-red-50 text-red-500 mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">Sin resultados</h3>
              <p className="text-navy-400">{result.error}</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Header with Dania Index */}
              <div className="p-8 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <span className="text-royal-400 font-mono text-sm tracking-widest uppercase mb-2 block">Motor de Auditoría Dania V1.1</span>
                  <h3 className="text-3xl font-serif font-bold mb-1">{result.company_info?.Nombre || `NIT ${result.nit}`}</h3>
                  <p className="text-navy-300">Análisis detallado de riesgo transaccional y comportamiento contractual.</p>
                </div>
                
                <div className="flex flex-col items-center p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 min-w-[200px]">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2 font-bold">Índice Dania (d)</span>
                  <div className={`text-5xl font-mono font-black ${
                    result.d < 0.3 ? 'text-emerald-400' :
                    result.d < 0.7 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {result.d.toFixed(4)}
                  </div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-widest opacity-80">
                    Riesgo {result.riesgo}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Features Grid */}
                <div className="p-8 border-b lg:border-b-0 lg:border-r border-canvas-border">
                  <h4 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="h-1 w-4 bg-royal-500 rounded-full"></div>
                    Variables de Comportamiento
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(result.vector_x).map(([k, v]) => (
                      <div key={k} className="group flex justify-between items-center p-3 rounded-xl hover:bg-canvas-card transition-colors border border-transparent hover:border-canvas-border">
                        <span className="text-sm text-navy-600 font-medium">{FEATURE_LABELS[k] || k}</span>
                        <span className="font-mono text-sm font-bold text-navy-900 bg-navy-50 px-3 py-1 rounded-lg">
                          {typeof v === 'number' ? v.toFixed(v < 1 ? 6 : 2) : v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Meta */}
                <div className="p-8 bg-canvas-card/30">
                  <h4 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="h-1 w-4 bg-emerald-500 rounded-full"></div>
                    Información Registral SECOP II
                  </h4>
                  {result.company_info ? (
                    <div className="space-y-4">
                      {Object.entries(result.company_info).filter(([k]) => !['Codigo', 'index'].includes(k)).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-[10px] text-navy-300 font-bold uppercase mb-1">{key.replace(/_/g, ' ')}</span>
                          <span className="text-sm text-navy-900 font-medium break-words leading-relaxed">
                            {value || 'No provisto'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-navy-300 italic text-sm">
                      No se encontraron metadatos adicionales.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
