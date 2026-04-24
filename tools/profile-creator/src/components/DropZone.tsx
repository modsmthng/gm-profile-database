import type { JSX } from 'preact';

interface DropZoneProps {
  visible: boolean;
}

export function DropZone({ visible }: DropZoneProps): JSX.Element | null {
  if (!visible) return null;

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm pointer-events-none">
      <div class="flex flex-col items-center gap-4 border-2 border-dashed border-amber-500 rounded-2xl px-20 py-14 text-amber-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        <p class="text-xl font-semibold">Drop index.json here</p>
        <p class="text-sm text-zinc-400">Profile will be loaded automatically</p>
      </div>
    </div>
  );
}
