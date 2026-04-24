import type { JSX } from 'preact';
import type { Variant, FieldErrors } from '../types';
import { VariantEditor } from './VariantEditor';
import { createEmptyVariant } from '../load';

interface VariantsPanelProps {
  variants: Variant[];
  activeIndex: number;
  prefix: string;
  errors: FieldErrors;
  onChangeIndex: (i: number) => void;
  onAdd: () => void;
  onDelete: () => void;
  onChangeVariant: (i: number, v: Variant) => void;
}

const navBtn = 'w-7 h-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm select-none';

export function VariantsPanel({
  variants, activeIndex, prefix, errors,
  onChangeIndex, onAdd, onDelete, onChangeVariant,
}: VariantsPanelProps): JSX.Element {
  const total = variants.length;
  const active = variants[activeIndex] ?? createEmptyVariant();
  const variantPrefix = `${prefix}.${activeIndex}`;

  return (
    <section class="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wide select-none">
            Variants
          </span>
          <div class="flex items-center gap-1">
            <button
              onClick={() => onChangeIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              class={navBtn}
              title="Previous variant"
            >◄</button>
            <span class="text-xs text-zinc-300 w-12 text-center select-none">
              {activeIndex + 1} / {total}
            </span>
            <button
              onClick={() => onChangeIndex(activeIndex + 1)}
              disabled={activeIndex === total - 1}
              class={navBtn}
              title="Next variant"
            >►</button>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            onClick={onAdd}
            class="px-2.5 py-1 rounded text-xs font-medium bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors select-none"
          >
            + Add
          </button>
          <button
            onClick={onDelete}
            disabled={total <= 1}
            class="px-2.5 py-1 rounded text-xs font-medium bg-zinc-800 text-zinc-400 hover:bg-red-900 hover:text-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors select-none"
          >
            Delete
          </button>
        </div>
      </div>

      <VariantEditor
        variant={active}
        prefix={variantPrefix}
        errors={errors}
        onChange={(v) => onChangeVariant(activeIndex, v)}
      />
    </section>
  );
}
