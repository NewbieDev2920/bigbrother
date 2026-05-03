import { useMutation } from '@tanstack/react-query';
import { ai, fileHash } from '@/services/ai';
import { useUploadStore } from '@/store/useUploadStore';

export function useAnalyze() {
  return useMutation({
    mutationFn: async (file: File) => {
      useUploadStore.getState().set({ status: 'hashing', progress: 5, fileName: file.name, errorMessage: null });
      const hash = await fileHash(file);

      useUploadStore.getState().set({ status: 'checking', progress: 15 });
      const existing = await ai.checkExisting(hash);
      if (existing) {
        useUploadStore.getState().set({ status: 'success', progress: 100 });
        return { project: existing, alreadyExisted: true } as const;
      }

      useUploadStore.getState().set({ status: 'analyzing', progress: 30 });
      const result = await ai.analyzeDocument(file);
      useUploadStore.getState().set({ status: 'success', progress: 100 });
      return { project: result.project, alreadyExisted: false } as const;
    },
    onError: (err: Error) => {
      useUploadStore.getState().set({ status: 'error', errorMessage: err.message });
    },
  });
}
