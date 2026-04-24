/**
 * Download path resolution utilities
 * Implements priority-based download path resolution as documented
 */

function encodePathSegments(path) {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

export function buildProfileAssetPath(profileName, relativePath = '') {
  const encodedProfileName = encodeURIComponent(profileName);

  if (!relativePath) {
    return `/gm-profile-database/profiles/${encodedProfileName}/`;
  }

  return `/gm-profile-database/profiles/${encodedProfileName}/${encodePathSegments(relativePath)}`;
}

/**
 * Resolves the download path for a profile variant using priority-based logic.
 * 
 * Priority order:
 * 1. Variant-specific downloadPath
 * 2. Computed from variant file path
 * 3. Profile-level downloadPath
 * 4. Profile directory (fallback)
 * 
 * @param {Object} profile - The profile index object
 * @param {Object|null} selectedVariant - The selected variant object (optional)
 * @returns {string} The resolved download path
 */
export function resolveDownloadPath(profile, selectedVariant = null) {
  // Priority 1: Variant has explicit downloadPath
  if (selectedVariant?.downloadPath) {
    return selectedVariant.downloadPath;
  }
  
  // Priority 2: Build from variant file path
  if (selectedVariant?.file) {
    return buildProfileAssetPath(profile.name, selectedVariant.file);
  }
  
  // Priority 3: Profile-level downloadPath (may be folder)
  if (profile.downloadPath) {
    return profile.downloadPath;
  }
  
  // Priority 4: Default to profile directory
  return buildProfileAssetPath(profile.name);
}

/**
 * Checks if a path is a folder (ends with /) or a file (ends with .json)
 * 
 * @param {string} path - The path to check
 * @returns {boolean} True if folder, false if file
 */
export function isFolder(path) {
  return path.endsWith('/');
}

/**
 * Gets the filename from a path
 * 
 * @param {string} path - The file path
 * @returns {string} The filename
 */
export function getFilename(path) {
  const filename = path.split('/').pop() || path;

  try {
    return decodeURIComponent(filename);
  } catch {
    return filename;
  }
}
