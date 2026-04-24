import type { JSX } from 'preact';
import type { BaseFields, PatternAFields, AppState, FieldErrors } from '../types';
import { FieldRow } from './FieldRow';

interface ProfileFieldsProps {
  base: BaseFields;
  patternA: PatternAFields;
  pattern: AppState['pattern'];
  errors: FieldErrors;
  onChangeBase: (b: BaseFields) => void;
  onChangePatternA: (p: PatternAFields) => void;
}

const COMPLEXITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'mid', label: 'Mid' },
  { value: 'high', label: 'High' },
];

export function ProfileFields({
  base, patternA, pattern, errors, onChangeBase, onChangePatternA,
}: ProfileFieldsProps): JSX.Element {
  const set = (key: keyof BaseFields) => (v: string) => onChangeBase({ ...base, [key]: v });
  const setA = (key: keyof PatternAFields) => (v: string) => onChangePatternA({ ...patternA, [key]: v });
  const err = (k: string) => errors[k];

  return (
    <section class="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <h2 class="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-4 select-none">
        Profile Fields
      </h2>

      <div class="grid grid-cols-2 gap-3 mb-3">
        <FieldRow id="name"        label="Name"         value={base.name}        onChange={set('name')}        required error={err('name')}        placeholder="my-profile" hint="Kebab-case, letters/numbers/hyphens only" />
        <FieldRow id="displayName" label="Display Name" value={base.displayName} onChange={set('displayName')} required error={err('displayName')} placeholder="My Profile" />
      </div>

      <div class="mb-3">
        <FieldRow id="description" label="Description" value={base.description} onChange={set('description')} required error={err('description')} type="textarea" rows={2} placeholder="A concise description of this profile (min 10 characters)" />
      </div>

      <div class="grid grid-cols-2 gap-3 mb-3">
        <FieldRow id="author" label="Author" value={base.author} onChange={set('author')} required error={err('author')} placeholder="Your name" />
        <FieldRow id="date"   label="Date"   value={base.date}   onChange={set('date')}   required error={err('date')}   type="date" />
      </div>

      <div class="grid grid-cols-2 gap-3 mb-3">
        <FieldRow
          id="complexity" label="Complexity" value={base.complexity}
          onChange={set('complexity')} required error={err('complexity')}
          type="select" options={COMPLEXITY_OPTIONS}
        />
        <FieldRow id="tags" label="Tags" value={base.tags} onChange={set('tags')} required error={err('tags')} placeholder="espresso, light-roast, pro" hint="Comma-separated" />
      </div>

      <div class="grid grid-cols-2 gap-3 mb-3">
        <FieldRow id="picture" label="Picture"              value={base.picture}             onChange={set('picture')}             placeholder="image.jpg" hint="Relative path or URL" />
        <FieldRow id="link"    label="Discussion Link"      value={base.link}                onChange={set('link')}                error={err('link')} type="url" placeholder="https://discord.com/…" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <FieldRow id="machineCompatibility" label="Machine Compatibility" value={base.machineCompatibility} onChange={set('machineCompatibility')} placeholder="Gaggia Classic, Gaggia Classic Pro" hint="Comma-separated" />
        <FieldRow id="downloadPath" label="Download Path (fallback)" value={base.downloadPath} onChange={set('downloadPath')} placeholder="/public/profiles/my-profile/" />
      </div>

      {pattern === 'A' && (
        <div class="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-zinc-800">
          <FieldRow id="patternA.file"         label="Profile File"   value={patternA.file}         onChange={setA('file')}         required error={err('patternA.file')}         placeholder="profile.json" />
          <FieldRow id="patternA.downloadPath" label="Download Path"  value={patternA.downloadPath} onChange={setA('downloadPath')} required error={err('patternA.downloadPath')} placeholder="/public/profiles/…" />
        </div>
      )}
    </section>
  );
}
