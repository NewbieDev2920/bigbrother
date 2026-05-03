import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VisitedEntry {
  projectId: string;
  visitedAt: string;
}

interface HistoryState {
  visited: VisitedEntry[];
  push: (projectId: string) => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      visited: [],
      push: (projectId) =>
        set((s) => {
          const filtered = s.visited.filter((v) => v.projectId !== projectId);
          return {
            visited: [{ projectId, visitedAt: new Date().toISOString() }, ...filtered].slice(0, 50),
          };
        }),
      clear: () => set({ visited: [] }),
    }),
    { name: 'dania:history' }
  )
);
