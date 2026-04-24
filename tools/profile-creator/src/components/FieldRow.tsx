import type { JSX } from 'preact';

interface Option {
  value: string;
  label: string;
}

interface FieldRowProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  type?: 'text' | 'date' | 'url' | 'select' | 'textarea';
  placeholder?: string;
  options?: Option[];
  rows?: number;
}

const inputClass = (error?: string) =>
  `w-full bg-zinc-800 border rounded px-3 py-1.5 text-sm text-zinc-100 outline-none
   focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors
   ${error ? 'border-red-500' : 'border-zinc-700'}`;

export function FieldRow({
  id, label, value, onChange, required, error, hint,
  type = 'text', placeholder, options, rows = 3,
}: FieldRowProps): JSX.Element {
  return (
    <div class="flex flex-col gap-1">
      <label for={id} class="text-xs font-medium text-zinc-400 uppercase tracking-wide select-none">
        {label}
        {required && <span class="text-amber-500 ml-1">*</span>}
      </label>

      {type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
          class={inputClass(error)}
        >
          <option value="">— select —</option>
          {options?.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onInput={(e) => onChange((e.target as HTMLTextAreaElement).value)}
          placeholder={placeholder}
          rows={rows}
          class={`${inputClass(error)} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onInput={(e) => onChange((e.target as HTMLInputElement).value)}
          placeholder={placeholder}
          class={inputClass(error)}
        />
      )}

      {error && <p class="text-xs text-red-400">{error}</p>}
      {!error && hint && <p class="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
