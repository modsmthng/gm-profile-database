import type { AppState, Variant, Version } from './types';
import { splitComma } from './utils';

export function buildJson(state: AppState): string {
  const obj: Record<string, unknown> = {
    name: state.base.name,
    displayName: state.base.displayName,
    description: state.base.description,
    author: state.base.author,
    date: state.base.date,
  };

  if (state.base.complexity) obj.complexity = state.base.complexity;
  obj.tags = splitComma(state.base.tags);
  if (state.base.picture) obj.picture = state.base.picture;
  if (state.base.link) obj.link = state.base.link;

  const machComp = splitComma(state.base.machineCompatibility);
  if (machComp.length > 0) obj.machineCompatibility = machComp;

  if (state.pattern === 'A') {
    obj.file = state.patternA.file;
    obj.downloadPath = state.patternA.downloadPath;
  } else if (state.pattern === 'B') {
    if (state.base.downloadPath) obj.downloadPath = state.base.downloadPath;
    obj.variants = state.variants.map(buildVariantJson);
  } else {
    if (state.base.downloadPath) obj.downloadPath = state.base.downloadPath;
    obj.versions = state.versions.map(buildVersionJson);
  }

  return JSON.stringify(obj, null, 2);
}

function buildVariantJson(v: Variant): Record<string, unknown> {
  const obj: Record<string, unknown> = { id: v.id, file: v.file, label: v.label };
  if (v.downloadPath) obj.downloadPath = v.downloadPath;
  if (v.basket) obj.basket = v.basket;
  if (v.brewRatio) obj.brewRatio = v.brewRatio;
  if (v.doseRange) obj.doseRange = v.doseRange;
  if (v.yieldRange) obj.yieldRange = v.yieldRange;
  if (v.tempRange) obj.tempRange = v.tempRange;
  if (v.timeRange) obj.timeRange = v.timeRange;
  if (v.grindSize) obj.grindSize = v.grindSize;
  if (v.notes) obj.notes = v.notes;
  return obj;
}

function buildVersionJson(v: Version): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    id: v.id,
    label: v.label,
    releaseDate: v.releaseDate,
  };
  if (v.status) obj.status = v.status;
  if (v.changelog) obj.changelog = v.changelog;
  obj.variants = v.variants.map(buildVariantJson);
  return obj;
}
