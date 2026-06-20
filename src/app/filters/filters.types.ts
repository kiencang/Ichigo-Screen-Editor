export interface FilterPreset {
  id: string;
  nameVi: string;
  nameEn: string;
  filterString: (intensity: number) => string;
}

export interface AppliedFilter {
  id: string;
  presetId: string;
  startTime: number;
  duration: number; // Duration of appearance in seconds (max 3s)
  intensity: number;
}

export function getAppliedFiltersCSSAtTime(appliedFilters: AppliedFilter[], time: number): string {
  if (!appliedFilters || appliedFilters.length === 0) return 'none';
  const active = appliedFilters.filter(f => time >= f.startTime && time <= (f.startTime + f.duration));
  if (active.length === 0) return 'none';
  // Chaining CSS filters is standard: e.g. grayscale(0.5) blur(2px)
  return active.map(f => getFilterCSS(f.presetId, f.intensity)).join(' ');
}

export const VIDEO_FILTERS: FilterPreset[] = [
  {
    id: 'none',
    nameVi: 'Original',
    nameEn: 'Original',
    filterString: () => 'none'
  },
  {
    id: 'chrome',
    nameVi: 'Vivid chrome',
    nameEn: 'Vivid chrome',
    filterString: (intensity) => {
      const p = intensity / 100;
      return `saturate(${1 + p * 0.75}) contrast(${1 + p * 0.2}) brightness(${1 + p * 0.05})`;
    }
  },
  {
    id: 'faded',
    nameVi: 'Faded film',
    nameEn: 'Faded film',
    filterString: (intensity) => {
      const p = intensity / 100;
      return `saturate(${1 - p * 0.5}) contrast(${1 - p * 0.15}) brightness(${1 + p * 0.15})`;
    }
  },
  {
    id: 'vintage',
    nameVi: 'Vintage sepia',
    nameEn: 'Vintage sepia',
    filterString: (intensity) => {
      const p = intensity / 100;
      return `sepia(${p * 0.65}) saturate(${1 + p * 0.15}) contrast(${1 + p * 0.1})`;
    }
  },
  {
    id: 'mono',
    nameVi: 'Noir mono',
    nameEn: 'Noir mono',
    filterString: (intensity) => {
      const p = intensity / 100;
      return `grayscale(${p}) contrast(${1 + p * 0.25})`;
    }
  },
  {
    id: 'cinematic',
    nameVi: 'Cinematic teal',
    nameEn: 'Cinematic teal',
    filterString: (intensity) => {
      const p = intensity / 100;
      return `contrast(${1 + p * 0.2}) saturate(${1 + p * 0.15}) hue-rotate(${-6 * p}deg) brightness(${1 - p * 0.05})`;
    }
  },
  {
    id: 'cyberpunk',
    nameVi: 'Neon cyberpunk',
    nameEn: 'Neon cyberpunk',
    filterString: (intensity) => {
      const p = intensity / 100;
      return `hue-rotate(${110 * p}deg) saturate(${1 + p * 0.4}) contrast(${1 + p * 0.1})`;
    }
  },
  {
    id: 'warm',
    nameVi: 'Warm sun',
    nameEn: 'Warm sun',
    filterString: (intensity) => {
      const p = intensity / 105;
      return `sepia(${p * 0.25}) saturate(${1 + p * 0.2}) hue-rotate(${-10 * p}deg)`;
    }
  },
  {
    id: 'cool',
    nameVi: 'Cool ice',
    nameEn: 'Cool ice',
    filterString: (intensity) => {
      const p = intensity / 100;
      return `hue-rotate(${12 * p}deg) saturate(${1 + p * 0.1}) contrast(${1 + p * 0.05}) brightness(${1 - p * 0.02})`;
    }
  },
  {
    id: 'sunset',
    nameVi: 'Golden sunset',
    nameEn: 'Golden sunset',
    filterString: (intensity) => {
      const p = intensity / 100;
      return `sepia(${p * 0.4}) saturate(${1 + p * 0.3}) contrast(${1 + p * 0.15}) hue-rotate(${-15 * p}deg) brightness(${1 + p * 0.05})`;
    }
  }
];

export function getFilterCSS(id: string, intensity: number): string {
  const filter = VIDEO_FILTERS.find(f => f.id === id);
  if (!filter) return 'none';
  return filter.filterString(intensity);
}
