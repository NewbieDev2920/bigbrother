import { useMutation } from '@tanstack/react-query';
import { ai } from '@/services/ai';
import { useUploadStore } from '@/store/useUploadStore';
import { useChatStore } from '@/store/useChatStore';

export function useAnalyze() {
  return useMutation({
    mutationFn: async (file: File) => {
      const sessionId = `sess-${Date.now()}`;
      useUploadStore.getState().set({ status: 'analyzing', progress: 30, fileName: file.name, errorMessage: null });
      
      const { project, analysis } = await ai.analyzeDocument(file, "Analice este documento en busca de señales de corrupción, extraiga el costo, contratistas, entidades, modalidad, periodo y ubicación. Liste los NITs encontrados.");
      
      // Store session for chat
      useChatStore.getState().setSession(project.id, sessionId);
      
      useUploadStore.getState().set({ status: 'success', progress: 100 });
      return { project, alreadyExisted: false } as const;
    },
    onError: (err: Error) => {
      useUploadStore.getState().set({ status: 'error', errorMessage: err.message });
    },
  });
}
