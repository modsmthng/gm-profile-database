/**
 * Profile parsing utilities
 * Loads and parses profile data from JSON files
 */

import { readdir } from 'fs/promises';
import { join } from 'path';
import { sortProfileVersions } from './versioning';

/**
 * Loads all profile index files from the profiles directory
 * 
 * @returns {Promise<Array>} Array of profile index objects with metadata
 */
export async function loadAllProfiles() {
  try {
    const profilesPath = join(process.cwd(), 'public', 'profiles');
    const entries = await readdir(profilesPath, { withFileTypes: true });
    
    const profiles = [];
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        try {
          const indexPath = join(profilesPath, entry.name, 'index.json');
          const indexData = await import(indexPath, { assert: { type: 'json' } });
          
          profiles.push({
            ...indexData.default,
            slug: entry.name,
          });
        } catch (error) {
          console.warn(`Failed to load profile ${entry.name}:`, error.message);
        }
      }
    }
    
    // Sort by date (newest first)
    profiles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return profiles;
  } catch (error) {
    console.error('Error loading profiles:', error);
    return [];
  }
}

/**
 * Loads a specific profile by name
 * 
 * @param {string} name - Profile directory name
 * @returns {Promise<Object|null>} Profile index object or null
 */
export async function loadProfile(name) {
  try {
    const indexPath = join(process.cwd(), 'public', 'profiles', name, 'index.json');
    const indexData = await import(indexPath, { assert: { type: 'json' } });
    
    return {
      ...indexData.default,
      slug: name,
    };
  } catch (error) {
    console.error(`Failed to load profile ${name}:`, error);
    return null;
  }
}

/**
 * Gets the default variant for a profile
 * 
 * @param {Object} profile - Profile index object
 * @returns {Object|null} Default variant object
 */
export function getDefaultVariant(profile) {
  if (profile.variants && profile.variants.length > 0) {
    return profile.variants[0];
  }
  
  if (profile.versions && profile.versions.length > 0) {
    const defaultVersion = sortProfileVersions(profile.versions)[0];
    if (defaultVersion.variants && defaultVersion.variants.length > 0) {
      return defaultVersion.variants[0];
    }
  }
  
  return null;
}

/**
 * Gets all unique tags from profiles
 * 
 * @param {Array} profiles - Array of profile objects
 * @returns {Array} Sorted array of unique tags
 */
export function getAllTags(profiles) {
  const tagsSet = new Set();
  
  profiles.forEach(profile => {
    if (profile.tags && Array.isArray(profile.tags)) {
      profile.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet).sort();
}

/**
 * Gets all unique complexity levels from profiles
 *
 * @param {Array} profiles - Array of profile objects
 * @returns {Array} Array of complexity levels
 */
export function getAllComplexities(profiles) {
  const complexities = new Set();

  profiles.forEach(profile => {
    if (profile.complexity) {
      complexities.add(profile.complexity);
    }
  });

  return Array.from(complexities);
}
