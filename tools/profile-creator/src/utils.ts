export function splitComma(value: string): string[] {
  return value.split(',').map(t => t.trim()).filter(Boolean);
}

export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
