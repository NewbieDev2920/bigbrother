import { useMutation } from '@tanstack/react-query';
import { ai } from '@/services/ai';
import { useChatStore } from '@/store/useChatStore';
import type { ChatMessage } from '@/types/chat';

const EMPTY: ChatMessage[] = [];

export function useChat(projectId: string) {
  const messages = useChatStore((s) => s.byProject[projectId] ?? EMPTY);
  const { append, reset } = useChatStore.getState();

  const mutation = useMutation({
    mutationFn: async (question: string) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: question,
        timestamp: new Date().toISOString(),
      };
      append(projectId, userMsg);
      const reply = await ai.askAboutDocument(projectId, question);
      append(projectId, reply);
      return reply;
    },
  });

  return {
    messages,
    sending: mutation.isPending,
    send: (text: string) => mutation.mutate(text),
    reset: () => reset(projectId),
  };
}
