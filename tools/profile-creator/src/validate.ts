import type { AppState, FieldErrors, Variant } from './types';
import { validator } from './schema';
import { buildJson } from './output';
import { splitComma, isValidUrl } from './utils';

export function getFieldErrors(state: AppState): FieldErrors {
  const errors: FieldErrors = {};
  const { base, pattern } = state;

  if (!base.name) {
    errors['name'] = 'Required';
  } else if (!/^[a-zA-Z0-9-]+$/.test(base.name)) {
    errors['name'] = 'Only letters, numbers, and hyphens';
  }

  if (!base.displayName) errors['displayName'] = 'Required';

  if (!base.description) {
    errors['description'] = 'Required';
  } else if (base.description.length < 10) {
    errors['description'] = 'Minimum 10 characters';
  }

  if (!base.author) errors['author'] = 'Required';

  if (!base.date) {
    errors['date'] = 'Required';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(base.date)) {
    errors['date'] = 'Format: YYYY-MM-DD';
  }

  if (!base.complexity) errors['complexity'] = 'Required';

  if (splitComma(base.tags).length === 0) errors['tags'] = 'At least one tag required';

  if (base.link && !isValidUrl(base.link)) errors['link'] = 'Must be a valid URL';

  if (pattern === 'A') {
    if (!state.patternA.file) {
      errors['patternA.file'] = 'Required';
    } else if (!state.patternA.file.endsWith('.json')) {
      errors['patternA.file'] = 'Must end in .json';
    }
    if (!state.patternA.downloadPath) errors['patternA.downloadPath'] = 'Required';
  }

  if (pattern === 'B') {
    state.variants.forEach((v, i) => checkVariant(v, `variants.${i}`, errors));
  }

  if (pattern === 'C') {
    state.versions.forEach((ver, vi) => {
      const vp = `versions.${vi}`;
      if (!ver.id) {
        errors[`${vp}.id`] = 'Required';
      } else if (!/^v\d+(\.\d+)*(-[a-z]+)?$/.test(ver.id)) {
        errors[`${vp}.id`] = 'Format: v1.0 or v2.0-beta';
      }
      if (!ver.label) errors[`${vp}.label`] = 'Required';
      if (!ver.releaseDate) {
        errors[`${vp}.releaseDate`] = 'Required';
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(ver.releaseDate)) {
        errors[`${vp}.releaseDate`] = 'Format: YYYY-MM-DD';
      }
      ver.variants.forEach((v, vvi) => checkVariant(v, `${vp}.variants.${vvi}`, errors));
    });
  }

  return errors;
}

export function isSchemaValid(state: AppState): boolean {
  try {
    const obj = JSON.parse(buildJson(state));
    return validator(obj) === true;
  } catch {
    return false;
  }
}

function checkVariant(v: Variant, prefix: string, errors: FieldErrors): void {
  if (!v.id) errors[`${prefix}.id`] = 'Required';
  if (!v.file) {
    errors[`${prefix}.file`] = 'Required';
  } else if (!v.file.endsWith('.json')) {
    errors[`${prefix}.file`] = 'Must end in .json';
  }
  if (!v.label) errors[`${prefix}.label`] = 'Required';
}
