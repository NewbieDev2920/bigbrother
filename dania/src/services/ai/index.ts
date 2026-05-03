import { mockAdapter } from './mockAdapter';
import { realAdapter } from './realAdapter';
import type { AIAdapter } from './aiAdapter';

const useMock = import.meta.env.VITE_USE_MOCK_AI !== 'false';

export const ai: AIAdapter = useMock ? mockAdapter : realAdapter;

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info(`[Dania] AI Adapter: ${useMock ? 'MOCK' : 'REAL'}`);
}

export type { AIAdapter };
export { fileHash } from './mockAdapter';
