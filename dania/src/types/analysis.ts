import type { RiskLevel } from './project';

export type AspectKey = 'presupuesto' | 'contratista' | 'tiempo' | 'transparencia' | 'avance';
export type CapaKey = 'capa1_documental' | 'capa2_coherencia' | 'capa3_clausulas' | 'capa4_semantico' | 'capa5_redes';

export const ASPECT_KEYS: AspectKey[] = ['presupuesto', 'contratista', 'tiempo', 'transparencia', 'avance'];

export const ASPECT_LABELS: Record<AspectKey, string> = {
  presupuesto: 'Presupuesto',
  contratista: 'Contratista',
  tiempo: 'Tiempo',
  transparencia: 'Transparencia',
  avance: 'Avance',
};

export const CAPA_LABELS: Record<CapaKey, string> = {
  capa1_documental: 'Capa 1 — Documental',
  capa2_coherencia: 'Capa 2 — Coherencia',
  capa3_clausulas: 'Capa 3 — Cláusulas',
  capa4_semantico: 'Capa 4 — Semántico',
  capa5_redes: 'Capa 5 — Redes',
};

export interface Hallazgo {
  id: string;
  severidad: RiskLevel;
  titulo: string;
  descripcion: string;
  capa: CapaKey;
  ubicacionEnDocumento?: {
    pagina: number;
    selector?: string;
  };
}

export interface CapaResult {
  score: number;
  hallazgos: Hallazgo[];
  resumen: string;
}

export interface AspectScore {
  score: number;
  resumen: string;
  detalle: string;
  hallazgos: Hallazgo[];
  chartData: Record<string, unknown>;
}

export interface AnalysisResult {
  projectId: string;
  riesgoGlobal: number;
  capas: Record<CapaKey, CapaResult>;
  aspectos: Record<AspectKey, AspectScore>;
  generadoEn: string;
}
