export interface BaseFields {
  name: string;
  displayName: string;
  description: string;
  author: string;
  date: string;
  complexity: '' | 'low' | 'mid' | 'high';
  tags: string;
  picture: string;
  link: string;
  machineCompatibility: string;
  downloadPath: string;
}

export interface PatternAFields {
  file: string;
  downloadPath: string;
}

export interface Variant {
  id: string;
  file: string;
  label: string;
  downloadPath: string;
  basket: string;
  brewRatio: string;
  doseRange: string;
  yieldRange: string;
  tempRange: string;
  timeRange: string;
  grindSize: string;
  notes: string;
}

export interface Version {
  id: string;
  label: string;
  releaseDate: string;
  status: '' | 'stable' | 'beta' | 'experimental';
  changelog: string;
  variants: Variant[];
}

export interface AppState {
  pattern: 'A' | 'B' | 'C';
  base: BaseFields;
  patternA: PatternAFields;
  variants: Variant[];
  versions: Version[];
  activeVersionIndex: number;
  activeVariantIndex: number;
  loadedFileName?: string;
  isModified: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveError?: string;
  isDragOver: boolean;
}

export type FieldErrors = Record<string, string>;
