import type { AppState, BaseFields, Variant, Version } from './types';

export function createEmptyVariant(): Variant {
  return {
    id: '', file: '', label: '', downloadPath: '',
    basket: '', brewRatio: '', doseRange: '', yieldRange: '',
    tempRange: '', timeRange: '', grindSize: '', notes: '',
  };
}

export function createEmptyVersion(): Version {
  return {
    id: '', label: '', releaseDate: '', status: '',
    changelog: '', variants: [createEmptyVariant()],
  };
}

export function createEmptyState(): AppState {
  const today = new Date().toISOString().split('T')[0];
  return {
    pattern: 'B',
    base: {
      name: '', displayName: '', description: '', author: '',
      date: today, complexity: '', tags: '', picture: '',
      link: '', machineCompatibility: '', downloadPath: '',
    },
    patternA: { file: '', downloadPath: '' },
    variants: [createEmptyVariant()],
    versions: [createEmptyVersion()],
    activeVersionIndex: 0,
    activeVariantIndex: 0,
    isModified: false,
    saveStatus: 'idle',
    isDragOver: false,
  };
}

export function detectPattern(data: Record<string, unknown>): 'A' | 'B' | 'C' {
  if (Array.isArray(data.versions)) return 'C';
  if (Array.isArray(data.variants)) return 'B';
  return 'A';
}

export function loadFromText(text: string, fileName: string): AppState {
  const data = JSON.parse(text) as Record<string, unknown>;
  const pattern = detectPattern(data);
  const state = createEmptyState();

  state.loadedFileName = fileName;
  state.pattern = pattern;

  state.base = {
    name: str(data.name),
    displayName: str(data.displayName),
    description: str(data.description),
    author: str(data.author),
    date: str(data.date),
    complexity: (data.complexity as BaseFields['complexity']) || '',
    tags: Array.isArray(data.tags) ? (data.tags as string[]).join(', ') : '',
    picture: str(data.picture),
    link: str(data.link),
    machineCompatibility: Array.isArray(data.machineCompatibility)
      ? (data.machineCompatibility as string[]).join(', ')
      : '',
    downloadPath: str(data.downloadPath),
  };

  if (pattern === 'A') {
    state.patternA = {
      file: str(data.file),
      downloadPath: str(data.downloadPath),
    };
  } else if (pattern === 'B') {
    state.variants = (data.variants as Record<string, unknown>[]).map(parseVariant);
  } else {
    state.versions = (data.versions as Record<string, unknown>[]).map(parseVersion);
  }

  return state;
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function parseVariant(v: Record<string, unknown>): Variant {
  return {
    id: str(v.id), file: str(v.file), label: str(v.label),
    downloadPath: str(v.downloadPath), basket: str(v.basket),
    brewRatio: str(v.brewRatio), doseRange: str(v.doseRange),
    yieldRange: str(v.yieldRange), tempRange: str(v.tempRange),
    timeRange: str(v.timeRange), grindSize: str(v.grindSize),
    notes: str(v.notes),
  };
}

function parseVersion(v: Record<string, unknown>): Version {
  return {
    id: str(v.id),
    label: str(v.label),
    releaseDate: str(v.releaseDate),
    status: (v.status as Version['status']) || '',
    changelog: str(v.changelog),
    variants: Array.isArray(v.variants)
      ? (v.variants as Record<string, unknown>[]).map(parseVariant)
      : [createEmptyVariant()],
  };
}
