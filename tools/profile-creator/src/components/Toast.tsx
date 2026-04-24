import { useEffect, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { AppState } from '../types';

interface ToastProps {
  status: AppState['saveStatus'];
  error?: string;
}

export function Toast({ status, error }: ToastProps): JSX.Element | null {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === 'idle') { setVisible(false); return; }
    setVisible(true);
    if (status === 'saved') {
      const t = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(t);
    }
  }, [status, error]);

  if (!visible) return null;

  const styles: Record<AppState['saveStatus'], string> = {
    idle: '',
    saving: 'bg-zinc-700 text-zinc-200',
    saved: 'bg-green-700 text-green-100',
    error: 'bg-red-800 text-red-100',
  };

  const messages: Record<AppState['saveStatus'], string> = {
    idle: '',
    saving: '⟳  Saving…',
    saved: '✓  Saved',
    error: `✗  ${error ?? 'Save failed'}`,
  };

  return (
    <div
      class={`fixed bottom-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium
              transition-opacity duration-200 ${styles[status]}`}
    >
      {messages[status]}
    </div>
  );
}
