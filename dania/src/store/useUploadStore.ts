import { create } from 'zustand';

type UploadStatus = 'idle' | 'hashing' | 'checking' | 'analyzing' | 'success' | 'error';

interface UploadState {
  status: UploadStatus;
  progress: number;
  fileName: string | null;
  errorMessage: string | null;
  set: (partial: Partial<UploadState>) => void;
  reset: () => void;
}

const initial: Pick<UploadState, 'status' | 'progress' | 'fileName' | 'errorMessage'> = {
  status: 'idle',
  progress: 0,
  fileName: null,
  errorMessage: null,
};

export const useUploadStore = create<UploadState>((set) => ({
  ...initial,
  set: (partial) => set(partial),
  reset: () => set(initial),
}));
