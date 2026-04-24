import type { JSX } from 'preact';
import type { Version, FieldErrors } from '../types';
import { FieldRow } from './FieldRow';
import { VariantsPanel } from './VariantsPanel';
import { createEmptyVariant } from '../load';

interface VersionsPanelProps {
  versions: Version[];
  activeVersionIndex: number;
  activeVariantIndex: number;
  errors: FieldErrors;
  onChangeVersionIndex: (i: number) => void;
  onAddVersion: () => void;
  onDeleteVersion: () => void;
  onChangeVersion: (i: number, v: Version) => void;
  onChangeVariantIndex: (i: number) => void;
}

const STATUS_OPTIONS = [
  { value: 'stable', label: 'Stable' },
  { value: 'beta', label: 'Beta' },
  { value: 'experimental', label: 'Experimental' },
];

const navBtn = 'w-7 h-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm select-none';

export function VersionsPanel({
  versions, activeVersionIndex, activeVariantIndex, errors,
  onChangeVersionIndex, onAddVersion, onDeleteVersion, onChangeVersion,
  onChangeVariantIndex,
}: VersionsPanelProps): JSX.Element {
  const total = versions.length;
  const ver = versions[activeVersionIndex];
  const vp = `versions.${activeVersionIndex}`;
  const err = (k: string) => errors[`${vp}.${k}`];

  const setVer = (key: keyof Version) => (v: string) =>
    onChangeVersion(activeVersionIndex, { ...ver, [key]: v });

  const handleAddVariant = () => {
    const updated = { ...ver, variants: [...ver.variants, createEmptyVariant()] };
    onChangeVersion(activeVersionIndex, updated);
    onChangeVariantIndex(ver.variants.length);
  };

  const handleDeleteVariant = () => {
    if (ver.variants.length <= 1) return;
    const updated = { ...ver, variants: ver.variants.filter((_, i) => i !== activeVariantIndex) };
    onChangeVersion(activeVersionIndex, updated);
    onChangeVariantIndex(Math.min(activeVariantIndex, updated.variants.length - 1));
  };

  const handleChangeVariant = (i: number, variant: Version['variants'][number]) => {
    const variants = [...ver.variants];
    variants[i] = variant;
    onChangeVersion(activeVersionIndex, { ...ver, variants });
  };

  return (
    <div class="flex flex-col gap-4">
      <section class="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wide select-none">
              Versions
            </span>
            <div class="flex items-center gap-1">
              <button
                onClick={() => onChangeVersionIndex(activeVersionIndex - 1)}
                disabled={activeVersionIndex === 0}
                class={navBtn}
                title="Previous version"
              >◄</button>
              <span class="text-xs text-zinc-300 w-12 text-center select-none">
                {activeVersionIndex + 1} / {total}
              </span>
              <button
                onClick={() => onChangeVersionIndex(activeVersionIndex + 1)}
                disabled={activeVersionIndex === total - 1}
                class={navBtn}
                title="Next version"
              >►</button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              onClick={onAddVersion}
              class="px-2.5 py-1 rounded text-xs font-medium bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors select-none"
            >
              + Add Version
            </button>
            <button
              onClick={onDeleteVersion}
              disabled={total <= 1}
              class="px-2.5 py-1 rounded text-xs font-medium bg-zinc-800 text-zinc-400 hover:bg-red-900 hover:text-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors select-none"
            >
              Delete
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <FieldRow id={`${vp}.id`}          label="Version ID"    value={ver.id}          onChange={setVer('id')}          required error={err('id')}          placeholder="v1.0" />
          <FieldRow id={`${vp}.label`}        label="Label"         value={ver.label}        onChange={setVer('label')}        required error={err('label')}        placeholder="Version 1.0" />
          <FieldRow id={`${vp}.releaseDate`}  label="Release Date"  value={ver.releaseDate}  onChange={setVer('releaseDate')}  required error={err('releaseDate')}  type="date" />
          <FieldRow id={`${vp}.status`} label="Status" value={ver.status} onChange={setVer('status')} type="select" options={STATUS_OPTIONS} />
        </div>
        <FieldRow id={`${vp}.changelog`} label="Changelog" value={ver.changelog} onChange={setVer('changelog')} type="textarea" rows={2} placeholder="What changed in this version…" />
      </section>

      <VariantsPanel
        variants={ver.variants}
        activeIndex={activeVariantIndex}
        prefix={`${vp}.variants`}
        errors={errors}
        onChangeIndex={onChangeVariantIndex}
        onAdd={handleAddVariant}
        onDelete={handleDeleteVariant}
        onChangeVariant={handleChangeVariant}
      />
    </div>
  );
}
