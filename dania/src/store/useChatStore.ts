import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage } from '@/types/chat';

interface ChatState {
  byProject: Record<string, ChatMessage[]>;
  sessions: Record<string, string>; // projectId -> sessionId
  append: (projectId: string, msg: ChatMessage) => void;
  setSession: (projectId: string, sessionId: string) => void;
  reset: (projectId: string) => void;
  get: (projectId: string) => ChatMessage[];
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      byProject: {},
      sessions: {},
      append: (projectId, msg) =>
        set((s) => ({
          byProject: {
            ...s.byProject,
            [projectId]: [...(s.byProject[projectId] ?? []), msg],
          },
        })),
      setSession: (projectId, sessionId) =>
        set((s) => ({
          sessions: { ...s.sessions, [projectId]: sessionId },
        })),
      reset: (projectId) =>
        set((s) => {
          const nextBy = { ...s.byProject };
          const nextSess = { ...s.sessions };
          delete nextBy[projectId];
          delete nextSess[projectId];
          return { byProject: nextBy, sessions: nextSess };
        }),
      get: (projectId) => get().byProject[projectId] ?? [],
    }),
    { name: 'dania:chat' }
  )
);
