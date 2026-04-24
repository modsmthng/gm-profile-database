import type { JSX } from 'preact';
import type { AppState } from '../types';

interface HeaderProps {
  pattern: AppState['pattern'];
  onPatternChange: (p: AppState['pattern']) => void;
  loadedFileName?: string;
  isModified: boolean;
}

const PATTERNS: AppState['pattern'][] = ['A', 'B', 'C'];
const PATTERN_LABELS: Record<AppState['pattern'], string> = {
  A: 'Simple',
  B: 'Variants',
  C: 'Versions',
};

export function Header({ pattern, onPatternChange, loadedFileName, isModified }: HeaderProps): JSX.Element {
  return (
    <header class="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900 shrink-0">
      <div class="flex items-center gap-3">
        <span class="text-amber-500 font-bold text-sm tracking-widest uppercase select-none">
          Gaggimate
        </span>
        <span class="text-zinc-600 select-none">|</span>
        <span class="text-zinc-300 font-medium text-sm select-none">Profile Creator</span>
      </div>

      <div class="flex items-center gap-2">
        {PATTERNS.map(p => (
          <button
            key={p}
            onClick={() => onPatternChange(p)}
            title={PATTERN_LABELS[p]}
            class={`px-3 py-1 rounded text-xs font-semibold transition-colors select-none
              ${pattern === p
                ? 'bg-amber-600 text-zinc-950'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div class="text-xs text-zinc-500 truncate max-w-64">
        {loadedFileName ? (
          <span>
            {loadedFileName}
            {isModified && <span class="text-amber-500 ml-1.5">●</span>}
          </span>
        ) : (
          <span class="italic">New profile{isModified && <span class="text-amber-500 ml-1.5">●</span>}</span>
        )}
      </div>
    </header>
  );
}
