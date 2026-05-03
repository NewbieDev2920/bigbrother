import type { AIAdapter } from './aiAdapter';
import {
  mockProjects,
  mockAnalyses,
  mockChatResponses,
  trendingMostSearched,
  trendingHighestRisk,
  trendingMostMentioned,
} from '@/data/mock';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const byIds = (ids: string[]) =>
  ids.map((id) => mockProjects.find((p) => p.id === id)!).filter(Boolean);

const seenHashes = new Map<string, string>();

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const mockAdapter: AIAdapter = {
  async analyzeDocument(file) {
    await delay(3500);
    const hash = await fileHash(file);
    let project = mockProjects.find((p) => p.id === seenHashes.get(hash));
    if (!project) {
      const idx = Math.floor(Math.random() * mockProjects.length);
      project = mockProjects[idx];
      seenHashes.set(hash, project.id);
    }
    return { project, analysis: mockAnalyses[project.id] };
  },

  async askAboutDocument(_projectId, question) {
    await delay(1200);
    const key = Object.keys(mockChatResponses).find((k) => normalize(question).includes(k));
    const content =
      (key && mockChatResponses[key]) ??
      'Según el documento analizado, el modelo identifica señales sobre las que se requiere verificación adicional. Indique qué aspecto le interesa profundizar (presupuesto, contratista, tiempo, transparencia o avance) y le entrego el análisis específico.';
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
    };
  },

  async searchProjects(query) {
    await delay(300);
    const q = normalize(query.trim());
    if (!q) return { exactMatch: null, similar: [] };
    const matches = mockProjects.filter((p) => {
      const hay = [
        p.nombre,
        p.entidad,
        p.contratista.nombre,
        p.contratista.nit,
        p.ubicacion.municipio,
        p.ubicacion.departamento,
        p.categoria,
      ]
        .map(normalize)
        .join(' ');
      return hay.includes(q);
    });
    const exactMatch =
      matches.find((p) => normalize(p.nombre) === q || normalize(p.contratista.nit) === q) ?? null;
    const similar = matches.filter((p) => p.id !== exactMatch?.id).slice(0, 5);
    return { exactMatch, similar };
  },

  async checkExisting(fileHash) {
    await delay(50);
    const projectId = seenHashes.get(fileHash);
    return projectId ? mockProjects.find((p) => p.id === projectId) ?? null : null;
  },

  async getTrending() {
    await delay(50);
    return {
      masBuscados: byIds(trendingMostSearched),
      mayorRiesgo: byIds(trendingHighestRisk),
      masMencionados: byIds(trendingMostMentioned),
    };
  },

  async getProject(id) {
    await delay(50);
    const project = mockProjects.find((p) => p.id === id);
    if (!project) return null;
    return { project, analysis: mockAnalyses[id] };
  },
};

export async function fileHash(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
