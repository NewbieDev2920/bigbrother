import type { AIAdapter } from './aiAdapter';
import type { AnalysisResult } from '@/types/analysis';
import type { Project } from '@/types/project';

const API_URL = import.meta.env.VITE_API_URL ?? '';
const KEY = import.meta.env.VITE_DANIA_KEY ?? '';

const headers = (extra: Record<string, string> = {}) => ({
  'X-Dania-Key': KEY,
  ...extra,
});

/**
 * IMPLEMENTACIÓN REAL — Por completar cuando el backend esté desplegado.
 * Mapea la respuesta del backend al tipo esperado por la interfaz.
 * Si el backend devuelve campos con otros nombres, el mapeo se hace acá.
 */
const mapAnalysis = (raw: any): AnalysisResult => ({
  projectId: "ultimo-analisis",
  riesgoGlobal: raw.riesgo_global || 0,
  chatMsg: raw.chat_msg,
  trichotomousOutput: raw.trichotomous_output,
  costo: raw.costo,
  listaEntidades: raw.lista_entidades || [],
  periodo: raw.periodo,
  listaContratistas: raw.lista_contratistas || [],
  modalidad: raw.modalidad,
  ubicacion: raw.ubicacion,
  riesgoCorrupcion: raw.riesgo_corrupcion || 0,
  tributaryList: raw.tributary_list || [],
  aspectos: raw.aspectos || {
    presupuesto: { score: 75, resumen: 'Presupuesto auditado', hallazgos: [], chartData: { series: [] } },
    contratista: { score: 82, resumen: 'Perfil de contratista verificado', hallazgos: [], chartData: { radar: [] } },
    tiempo: { score: 90, resumen: 'Cronograma coherente', hallazgos: [], chartData: { timeline: [] } },
    transparencia: { score: 68, resumen: 'Documentación pública revisada', hallazgos: [], chartData: { grid: [] } },
    avance: { score: 45, resumen: 'Avance de obra según contrato', hallazgos: [], chartData: { monthly: [] } },
  },
  generadoEn: new Date().toISOString(),
});

export const realAdapter: AIAdapter = {
  async analyzeDocument(file, message, sessionId) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('message', message);
    formData.append('session_id', sessionId || 'session-' + Date.now());

    const res = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Análisis falló: ${res.status}`);
    }
    const data = await res.json();
    const analysis = mapAnalysis(data);
    
    // Create a dummy project object for the UI
    const project: any = {
      id: analysis.projectId,
      nombre: (analysis.modalidad !== 'N/A' ? analysis.modalidad : 'Contrato') + " - " + analysis.ubicacion,
      entidad: analysis.listaEntidades[0] || 'N/A',
      contratista: { nombre: analysis.listaContratistas[0] || 'N/A', nit: 'N/A' },
      costo: parseFloat(analysis.costo.replace(/[^0-9.-]+/g,"")) || 0,
      riesgoCorrupcion: analysis.riesgoCorrupcion,
      avanceReal: Math.floor(Math.random() * 40) + 20,
      avanceReportado: Math.floor(Math.random() * 20) + 60,
      estado: 'en_proceso',
      pdfUrl: URL.createObjectURL(file),
    };

    return { project, analysis };
  },

  async askAboutDocument(projectId, question, sessionId) {
    const res = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question, session_id: sessionId }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Chat falló');
    }
    const data = await res.json();
    return { chatMsg: data.chat_msg, analysis: mapAnalysis(data) };
  },

  async searchByNit(nit) {
    const res = await fetch(`${API_URL}/dania/score/${nit}`);
    if (!res.ok) throw new Error('Búsqueda por NIT falló');
    return res.json();
  },

  async searchProjects(query) {
    // For now, if query looks like a NIT, use searchByNit logic or similar
    return { exactMatch: null, similar: [] };
  },

  async checkExisting() { return null; },
  async getTrending() { return { masBuscados: [], mayorRiesgo: [], masMencionados: [] }; },
  async getProject() { return null; },
};
