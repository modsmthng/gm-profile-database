const SEMVER_VERSION_RE = /^v(\d+(?:\.\d+)*)(?:-([a-z]+))?$/;
const AUTO_STABLE_VERSION_RE = /^v(\d+)(?:_(\d+))?$/;
const AUTO_TESTING_PREFIX = 'vIT';

function compareNumberListsDesc(left, right) {
  const length = Math.max(left.length, right.length);

  for (let index = 0; index < length; index += 1) {
    const leftValue = left[index] ?? 0;
    const rightValue = right[index] ?? 0;

    if (leftValue !== rightValue) {
      return rightValue - leftValue;
    }
  }

  return 0;
}

function compareStringsAsc(left = '', right = '') {
  return left.localeCompare(right);
}

function parseAutomaticVersion(id) {
  const stableMatch = AUTO_STABLE_VERSION_RE.exec(id);
  if (stableMatch) {
    return {
      kind: 'automatic',
      channel: 'stable',
      major: Number.parseInt(stableMatch[1], 10),
      release: Number.parseInt(stableMatch[2] ?? '0', 10),
      build: [],
    };
  }

  if (!id.startsWith(AUTO_TESTING_PREFIX)) {
    return null;
  }

  const parts = id.slice(AUTO_TESTING_PREFIX.length).split('_');
  if (parts.length < 3 || parts.some((part) => !/^\d+$/.test(part))) {
    return null;
  }

  return {
    kind: 'automatic',
    channel: 'testing',
    major: Number.parseInt(parts[0], 10),
    release: Number.parseInt(parts[1], 10),
    build: parts.slice(2).map((part) => Number.parseInt(part, 10)),
  };
}

function parseSemverLikeVersion(id) {
  const match = SEMVER_VERSION_RE.exec(id);
  if (!match) {
    return null;
  }

  return {
    kind: 'semver',
    numbers: match[1].split('.').map((part) => Number.parseInt(part, 10)),
    prerelease: match[2] ?? null,
  };
}

function compareAutomaticVersionsDesc(left, right) {
  if (left.major !== right.major) {
    return right.major - left.major;
  }

  if (left.release !== right.release) {
    return right.release - left.release;
  }

  if (left.channel !== right.channel) {
    return left.channel === 'stable' ? -1 : 1;
  }

  return compareNumberListsDesc(left.build, right.build);
}

function compareSemverVersionsDesc(left, right) {
  const numberComparison = compareNumberListsDesc(left.numbers, right.numbers);
  if (numberComparison !== 0) {
    return numberComparison;
  }

  if (left.prerelease !== right.prerelease) {
    if (!left.prerelease) return -1;
    if (!right.prerelease) return 1;
  }

  return compareStringsAsc(left.prerelease, right.prerelease);
}

export function compareVersionIdsDesc(leftId, rightId) {
  const leftAutomatic = parseAutomaticVersion(leftId);
  const rightAutomatic = parseAutomaticVersion(rightId);

  if (leftAutomatic && rightAutomatic) {
    return compareAutomaticVersionsDesc(leftAutomatic, rightAutomatic);
  }

  const leftSemver = parseSemverLikeVersion(leftId);
  const rightSemver = parseSemverLikeVersion(rightId);

  if (leftSemver && rightSemver) {
    return compareSemverVersionsDesc(leftSemver, rightSemver);
  }

  if (leftAutomatic || rightAutomatic || leftSemver || rightSemver) {
    return 0;
  }

  return compareStringsAsc(leftId, rightId);
}

export function sortProfileVersions(versions = []) {
  return [...versions].sort((left, right) => {
    const idComparison = compareVersionIdsDesc(left.id, right.id);
    if (idComparison !== 0) {
      return idComparison;
    }

    const dateComparison = new Date(right.releaseDate) - new Date(left.releaseDate);
    if (dateComparison !== 0) {
      return dateComparison;
    }

    return compareStringsAsc(left.label, right.label);
  });
}
