import type { ChatMessage } from '@/types/chat';
import { cn } from '@/lib/cn';

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-br-sm bg-navy-900 text-white'
            : 'rounded-bl-sm border border-canvas-border bg-canvas text-navy-900'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-canvas-border bg-canvas px-3.5 py-3">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-300 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-300 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-300" />
    </div>
  );
}
