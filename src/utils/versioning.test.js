import { describe, expect, it } from 'vitest';

import { compareVersionIdsDesc, sortProfileVersions } from './versioning';

describe('compareVersionIdsDesc', () => {
  it('prefers a stable release over testing builds for the same target release', () => {
    expect(compareVersionIdsDesc('v3', 'vIT3_0_30_11')).toBeLessThan(0);
  });

  it('prefers a newer testing target release over the previous stable release', () => {
    expect(compareVersionIdsDesc('vIT3_1_0', 'v3')).toBeLessThan(0);
  });

  it('prefers the new stable release over testing builds for that same target release', () => {
    expect(compareVersionIdsDesc('v3_1', 'vIT3_1_99')).toBeLessThan(0);
  });

  it('sorts newer testing builds ahead of older ones', () => {
    expect(compareVersionIdsDesc('vIT3_0_30_11', 'vIT3_0_29_7')).toBeLessThan(0);
    expect(compareVersionIdsDesc('vIT3_0_29_7', 'vIT3_0_29_6')).toBeLessThan(0);
  });
});

describe('sortProfileVersions', () => {
  it('returns versions in descending display order', () => {
    const sorted = sortProfileVersions([
      { id: 'vIT3_0_29_6', releaseDate: '2026-04-21', label: 'vIT3_0_29_6' },
      { id: 'v3', releaseDate: '2026-04-23', label: 'v3' },
      { id: 'vIT3_1_0', releaseDate: '2026-04-24', label: 'vIT3_1_0' },
      { id: 'v3_1', releaseDate: '2026-04-25', label: 'v3_1' },
    ]);

    expect(sorted.map((version) => version.id)).toEqual([
      'v3_1',
      'vIT3_1_0',
      'v3',
      'vIT3_0_29_6',
    ]);
  });
});
