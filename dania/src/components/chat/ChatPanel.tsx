import { useEffect, useRef } from 'react';
import { Bot, RotateCcw } from 'lucide-react';
import { ChatBubble, TypingIndicator } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/cn';

interface ChatPanelProps {
  projectId: string;
  documentName: string;
  className?: string;
}

const SUGGESTIONS = [
  '¿Cuánto cuesta?',
  '¿Quién es el contratista?',
  '¿Cuál es el avance?',
  '¿Hay sobrecostos?',
];

export function ChatPanel({ projectId, documentName, className }: ChatPanelProps) {
  const { messages, sending, send, reset } = useChat(projectId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, sending]);

  return (
    <div
      className={cn(
        'flex h-full min-h-[420px] flex-col rounded-2xl border border-canvas-border bg-canvas-card shadow-card',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-canvas-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-royal-400/15 p-1.5 text-royal-600">
            <Bot size={16} />
          </span>
          <div className="min-w-0">
            <p className="font-serif text-sm font-semibold text-navy-900">Chat con IA</p>
            <p className="truncate text-xs text-navy-300">{documentName}</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={reset}
            className="rounded-lg p-1.5 text-navy-300 hover:bg-navy-50"
            aria-label="Reiniciar conversación"
            title="Reiniciar conversación"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-start gap-3 text-sm text-navy-300">
            <p>
              Hazme preguntas sobre el documento. Puedo apoyarte interpretando las señales detectadas
              por el modelo.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-canvas-border bg-canvas px-3 py-1 text-xs hover:border-royal-400 hover:text-royal-600"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => <ChatBubble key={m.id} message={m} />)
        )}
        {sending && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}
      </div>

      <ChatInput onSubmit={send} disabled={sending} />
    </div>
  );
}
