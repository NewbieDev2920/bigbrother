import type { AIAdapter } from './aiAdapter';

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
export const realAdapter: AIAdapter = {
  async analyzeDocument(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: headers(),
      body: formData,
    });
    if (!res.ok) throw new Error(`Análisis falló: ${res.status}`);
    return res.json();
  },

  async askAboutDocument(projectId, question) {
    const res = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ project_id: projectId, question }),
    });
    if (!res.ok) throw new Error('Chat falló');
    return res.json();
  },

  async searchProjects(query) {
    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`, {
      headers: headers(),
    });
    if (!res.ok) throw new Error('Búsqueda falló');
    return res.json();
  },

  async checkExisting(fileHash) {
    const res = await fetch(`${API_URL}/exists/${fileHash}`, { headers: headers() });
    return res.ok ? res.json() : null;
  },

  async getTrending() {
    const res = await fetch(`${API_URL}/trending`, { headers: headers() });
    if (!res.ok) throw new Error('Trending falló');
    return res.json();
  },

  async getProject(id) {
    const res = await fetch(`${API_URL}/projects/${id}`, { headers: headers() });
    return res.ok ? res.json() : null;
  },
};
