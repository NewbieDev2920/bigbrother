import { type FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ChatInputProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handle = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue('');
  };

  return (
    <form onSubmit={handle} className="flex items-center gap-2 border-t border-canvas-border bg-canvas-card p-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Pregunta sobre este documento..."
        disabled={disabled}
        className="flex-1 rounded-xl border border-canvas-border bg-canvas px-3 py-2 text-sm text-navy-900 placeholder:text-navy-300 focus:border-navy-500"
      />
      <Button type="submit" size="md" disabled={disabled || !value.trim()}>
        <Send size={14} />
      </Button>
    </form>
  );
}
