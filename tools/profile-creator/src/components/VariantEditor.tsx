import type { JSX } from 'preact';
import type { Variant, FieldErrors } from '../types';
import { FieldRow } from './FieldRow';

interface VariantEditorProps {
  variant: Variant;
  prefix: string;
  errors: FieldErrors;
  onChange: (v: Variant) => void;
}

export function VariantEditor({ variant, prefix, errors, onChange }: VariantEditorProps): JSX.Element {
  const set = (key: keyof Variant) => (v: string) => onChange({ ...variant, [key]: v });
  const err = (key: string) => errors[`${prefix}.${key}`];

  return (
    <div class="grid grid-cols-1 gap-3">
      <div class="grid grid-cols-3 gap-3">
        <FieldRow id={`${prefix}.id`}    label="ID"    value={variant.id}    onChange={set('id')}    required error={err('id')}    placeholder="my-variant" />
        <FieldRow id={`${prefix}.file`}  label="File"  value={variant.file}  onChange={set('file')}  required error={err('file')}  placeholder="profile.json" />
        <FieldRow id={`${prefix}.label`} label="Label" value={variant.label} onChange={set('label')} required error={err('label')} placeholder="Standard" />
      </div>

      <div class="grid grid-cols-3 gap-3">
        <FieldRow id={`${prefix}.basket`}    label="Basket"     value={variant.basket}    onChange={set('basket')}    placeholder="58mm VST" />
        <FieldRow id={`${prefix}.brewRatio`} label="Brew Ratio" value={variant.brewRatio} onChange={set('brewRatio')} placeholder="1:2" />
        <FieldRow id={`${prefix}.doseRange`} label="Dose Range" value={variant.doseRange} onChange={set('doseRange')} placeholder="18-20g" />
      </div>

      <div class="grid grid-cols-3 gap-3">
        <FieldRow id={`${prefix}.yieldRange`} label="Yield Range" value={variant.yieldRange} onChange={set('yieldRange')} placeholder="36-40g" />
        <FieldRow id={`${prefix}.tempRange`}  label="Temp Range"  value={variant.tempRange}  onChange={set('tempRange')}  placeholder="90-94°C" />
        <FieldRow id={`${prefix}.timeRange`}  label="Time Range"  value={variant.timeRange}  onChange={set('timeRange')}  placeholder="25-35s" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <FieldRow id={`${prefix}.grindSize`}   label="Grind Size"    value={variant.grindSize}   onChange={set('grindSize')}   placeholder="Fine" />
        <FieldRow id={`${prefix}.downloadPath`} label="Download Path" value={variant.downloadPath} onChange={set('downloadPath')} placeholder="/public/profiles/…" />
      </div>

      <FieldRow
        id={`${prefix}.notes`} label="Notes" value={variant.notes}
        onChange={set('notes')} type="textarea" rows={2} placeholder="Any additional notes…"
      />
    </div>
  );
}
