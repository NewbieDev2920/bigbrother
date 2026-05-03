import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage } from '@/types/chat';

interface ChatState {
  byProject: Record<string, ChatMessage[]>;
  append: (projectId: string, msg: ChatMessage) => void;
  reset: (projectId: string) => void;
  get: (projectId: string) => ChatMessage[];
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      byProject: {},
      append: (projectId, msg) =>
        set((s) => ({
          byProject: {
            ...s.byProject,
            [projectId]: [...(s.byProject[projectId] ?? []), msg],
          },
        })),
      reset: (projectId) =>
        set((s) => {
          const next = { ...s.byProject };
          delete next[projectId];
          return { byProject: next };
        }),
      get: (projectId) => get().byProject[projectId] ?? [],
    }),
    { name: 'dania:chat' }
  )
);
