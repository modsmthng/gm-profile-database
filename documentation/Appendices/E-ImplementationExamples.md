# Appendix E: Implementation Examples

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## Overview

This appendix provides detailed code examples for implementing key features of the Gaggimate Profile Store.

---

## 1. Download Path Resolution

### 1.1 Utility Function

```javascript
// src/utils/download.js

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
    return `/profiles/${profile.name}/${selectedVariant.file}`;
  }
  
  // Priority 3: Profile-level downloadPath (may be folder)
  if (profile.downloadPath) {
    return profile.downloadPath;
  }
  
  // Priority 4: Default to profile directory
  return `/profiles/${profile.name}/`;
}

/**
 * Checks if a path is a folder (ends with /) or a file (ends with .json)
 */
export function isFolder(path) {
  return path.endsWith('/');
}

/**
 * Gets all downloadable files from a folder
 * (Used for dropdown when downloadPath is a folder)
 */
export async function getDownloadableFiles(folderPath) {
  const { glob } = await import('glob');
  const publicPath = `./public${folderPath}`;
  const files = await glob(`${publicPath}**/*.json`);
  
  // Return relative paths
  return files.map(file => file.replace('./public', ''));
}
```

### 1.2 Usage in Component

```astro
---
// src/components/download/DownloadButton.astro
import { resolveDownloadPath, isFolder, getDownloadableFiles } from '@/utils/download';

const { profile, selectedVariant } = Astro.props;
const downloadPath = resolveDownloadPath(profile, selectedVariant);
const isFolderPath = isFolder(downloadPath);

// If folder, get all files for dropdown
let downloadableFiles = [];
if (isFolderPath) {
  downloadableFiles = await getDownloadableFiles(downloadPath);
}
---

{!isFolderPath ? (
  <!-- Direct download button -->
  <a 
    href={downloadPath} 
    download
    class="btn btn-primary"
    aria-label={`Download ${selectedVariant?.label || profile.displayName} profile`}
  >
    Download Profile
  </a>
) : (
  <!-- Dropdown for folder -->
  <div class="dropdown dropdown-end">
    <button class="btn btn-primary">Download ▼</button>
    <ul class="dropdown-content menu">
      {downloadableFiles.map(file => (
        <li><a href={file} download>{file.split('/').pop()}</a></li>
      ))}
    </ul>
  </div>
)}
```

---

## 2. Chart Implementation with Fetch

### 2.1 Chart Component

```astro
---
// src/components/charts/ProfileChart.astro
const { profileName, variantFile } = Astro.props;
const profilePath = `/profiles/${profileName}/${variantFile}`;
---

<div class="chart-container" data-profile-path={profilePath}>
  <canvas id="profile-chart" role="img" 
    aria-label={`Pressure and flow chart for ${profileName}`}>
  </canvas>
  
  <div class="chart-loading" hidden>
    <div class="skeleton h-64 w-full"></div>
    <p>Loading chart...</p>
  </div>
  
  <div class="chart-error" hidden>
    <div class="alert alert-error">
      <span>Failed to load chart data.</span>
      <button class="btn btn-sm" onclick="retryChart()">Retry</button>
    </div>
  </div>
</div>

<script>
  import { Chart } from 'chart.js/auto';
  import annotationPlugin from 'chartjs-plugin-annotation';
  import { prepareData, makeChartData } from '@/utils/chart';

  Chart.register(annotationPlugin);

  async function loadProfileChart() {
    const container = document.querySelector('.chart-container');
    const canvas = document.getElementById('profile-chart');
    const loading = container.querySelector('.chart-loading');
    const error = container.querySelector('.chart-error');
    const profilePath = container.dataset.profilePath;

    try {
      loading.hidden = false;
      canvas.hidden = true;
      error.hidden = true;

      const response = await fetch(profilePath);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const profileData = await response.json();
      if (!profileData.phases || profileData.phases.length === 0) {
        throw new Error('Profile has no phases');
      }

      const chartConfig = makeChartData(profileData);
      loading.hidden = true;
      canvas.hidden = false;

      new Chart(canvas, chartConfig);

    } catch (err) {
      console.error('Chart loading error:', err);
      loading.hidden = true;
      canvas.hidden = true;
      error.hidden = false;
    }
  }

  window.retryChart = loadProfileChart;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProfileChart);
  } else {
    loadProfileChart();
  }
</script>
```

### 2.2 Chart Utilities

```javascript
// src/utils/chart.js

/**
 * Prepares phase data into chart-compatible data points
 */
export function prepareData(phases, target) {
  const dataPoints = [];
  let currentTime = 0;
  const interval = 0.1;

  phases.forEach((phase, phaseIndex) => {
    const duration = phase.duration || 0;
    const targetValue = phase.pump?.[target] || 0;
    const prevValue = phaseIndex > 0 
      ? phases[phaseIndex - 1].pump?.[target] || 0 
      : 0;

    const transition = phase.transition || {};
    const transitionDuration = transition.duration || 0;
    const easing = transition.easing || 'linear';

    if (transitionDuration > 0) {
      const transitionSteps = Math.ceil(transitionDuration / interval);
      for (let i = 0; i <= transitionSteps; i++) {
        const t = i / transitionSteps;
        const easedT = applyEasing(t, easing);
        const value = prevValue + (targetValue - prevValue) * easedT;
        dataPoints.push({ time: currentTime, value });
        currentTime += interval;
      }
    }

    const remainingDuration = duration - transitionDuration;
    if (remainingDuration > 0) {
      const steps = Math.ceil(remainingDuration / interval);
      for (let i = 0; i <= steps; i++) {
        dataPoints.push({ time: currentTime, value: targetValue });
        currentTime += interval;
      }
    }
  });

  return dataPoints;
}

/**
 * Applies easing function to time value
 */
export function applyEasing(t, easing) {
  switch (easing) {
    case 'linear': return t;
    case 'ease-in': return t * t;
    case 'ease-out': return 1 - (1 - t) * (1 - t);
    case 'ease-in-out':
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    default: return t;
  }
}

/**
 * Creates Chart.js configuration
 */
export function makeChartData(profileData) {
  const pressureData = prepareData(profileData.phases, 'pressure');
  const flowData = prepareData(profileData.phases, 'flow');

  return {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Pressure (bar)',
          data: pressureData.map(p => ({ x: p.time, y: p.value })),
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          yAxisID: 'y-pressure',
          pointRadius: 0,
        },
        {
          label: 'Flow (ml/s)',
          data: flowData.map(p => ({ x: p.time, y: p.value })),
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2,
          borderDash: [5, 5],
          yAxisID: 'y-flow',
          pointRadius: 0,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: {
          type: 'linear',
          title: { display: true, text: 'Time (seconds)' }
        },
        'y-pressure': {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'Pressure (bar)' },
          min: 0,
          max: 12
        },
        'y-flow': {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'Flow (ml/s)' },
          min: 0,
          max: 10,
          grid: { drawOnChartArea: false }
        }
      }
    }
  };
}
```

---

## 3. Pagination Implementation

### 3.1 Homepage with Pagination

```astro
---
// src/pages/index.astro
import { getCollection } from 'astro:content';
import ProfileCard from '@/components/cards/ProfileCard.astro';
import Pagination from '@/components/pagination/Pagination.astro';

const allProfiles = await getCollection('profiles');

const PROFILES_PER_PAGE = 24;
const currentPage = Number(Astro.url.searchParams.get('page') || 1);
const totalPages = Math.ceil(allProfiles.length / PROFILES_PER_PAGE);

const startIndex = (currentPage - 1) * PROFILES_PER_PAGE;
const endIndex = startIndex + PROFILES_PER_PAGE;
const paginatedProfiles = allProfiles.slice(startIndex, endIndex);

const showingStart = startIndex + 1;
const showingEnd = Math.min(endIndex, allProfiles.length);
---

<html>
  <head>
    <title>Gaggimate Profile Store</title>
  </head>
  <body>
    <main>
      <h1>Gaggimate Profiles</h1>
      
      <p>Showing {showingStart}-{showingEnd} of {allProfiles.length} profiles</p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProfiles.map(profile => (
          <ProfileCard profile={profile} />
        ))}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/"
      />
    </main>
  </body>
</html>
```

### 3.2 Pagination Component

```astro
---
// src/components/pagination/Pagination.astro
const { currentPage, totalPages, baseUrl = '/' } = Astro.props;

function getPageNumbers(current, total) {
  const pages = [];
  const maxVisible = 7;
  
  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    const start = Math.max(2, current - 2);
    const end = Math.min(total - 1, current + 2);
    
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push('...');
    pages.push(total);
  }
  
  return pages;
}

const pageNumbers = getPageNumbers(currentPage, totalPages);
const hasPrev = currentPage > 1;
const hasNext = currentPage < totalPages;
---

<nav class="pagination" aria-label="Pagination navigation">
  <div class="flex items-center justify-center gap-2">
    <a
      href={hasPrev ? `${baseUrl}?page=${currentPage - 1}` : undefined}
      class:list={['btn btn-sm', { 'btn-disabled': !hasPrev }]}
      aria-label="Previous page"
    >
      ← Previous
    </a>

    {pageNumbers.map(page => (
      page === '...' ? (
        <span class="px-3 py-1">...</span>
      ) : (
        <a
          href={`${baseUrl}?page=${page}`}
          class:list={[
            'btn btn-sm',
            { 'btn-primary': page === currentPage },
            { 'btn-ghost': page !== currentPage }
          ]}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </a>
      )
    ))}

    <a
      href={hasNext ? `${baseUrl}?page=${currentPage + 1}` : undefined}
      class:list={['btn btn-sm', { 'btn-disabled': !hasNext }]}
      aria-label="Next page"
    >
      Next →
    </a>
  </div>
</nav>
```

---

## 4. Search Implementation (Pagefind)

### 4.1 Search Component

```astro
---
// src/components/search/SearchBar.astro
---

<div class="search-bar">
  <input
    type="search"
    id="search-input"
    placeholder="Search profiles..."
    class="input input-bordered w-full"
    aria-label="Search profiles"
  />
  <div id="search-results" class="hidden" role="region" aria-live="polite"></div>
</div>

<script>
  let pagefind = null;
  let debounceTimer = null;

  async function initPagefind() {
    if (!pagefind) {
      pagefind = await import('/_pagefind/pagefind.js');
      await pagefind.init();
    }
    return pagefind;
  }

  async function performSearch(query) {
    if (!query || query.length < 2) {
      document.getElementById('search-results').classList.add('hidden');
      return;
    }

    try {
      const pf = await initPagefind();
      const results = await pf.search(query);
      
      const resultsContainer = document.getElementById('search-results');
      resultsContainer.classList.remove('hidden');
      
      if (results.results.length === 0) {
        resultsContainer.innerHTML = '<p class="p-4">No profiles found</p>';
        return;
      }

      const resultPromises = results.results.slice(0, 10).map(r => r.data());
      const resultData = await Promise.all(resultPromises);
      
      resultsContainer.innerHTML = resultData.map(result => `
        <a href="${result.url}" class="block p-4 hover:bg-base-200">
          <h3 class="font-bold">${result.meta.title}</h3>
          <p class="text-sm">${result.excerpt}</p>
        </a>
      `).join('');

    } catch (error) {
      console.error('Search error:', error);
    }
  }

  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(e.target.value);
    }, 300);
  });

  searchInput.addEventListener('focus', () => {
    initPagefind();
  }, { once: true });
</script>
```

---

**This completes the implementation examples. These provide production-ready code that can be directly adapted during implementation.**

**See Also:**
- [Data Schema](../04-DataSchema.md)
- [Features](../08-Features.md)
- [Testing Strategy](../13-Testing.md)
- [Performance](../14-Performance.md)
