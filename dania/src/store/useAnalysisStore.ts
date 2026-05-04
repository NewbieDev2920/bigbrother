import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project } from '@/types/project';
import type { AnalysisResult } from '@/types/analysis';

interface AnalysisState {
  currentProject: Project | null;
  currentAnalysis: AnalysisResult | null;
  setAnalysis: (project: Project, analysis: AnalysisResult) => void;
  clear: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      currentProject: null,
      currentAnalysis: null,
      setAnalysis: (project, analysis) => set({ currentProject: project, currentAnalysis: analysis }),
      clear: () => set({ currentProject: null, currentAnalysis: null }),
    }),
    {
      name: 'dania-analysis-storage',
    }
  )
);
