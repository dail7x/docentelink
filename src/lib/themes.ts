export const PHOTO_SHAPES = [
  { id: 'circle', label: 'Circular', className: 'rounded-full' },
  { id: 'square', label: 'Cuadrado', className: 'rounded-md' },
  { id: 'rounded', label: 'Redondeado', className: 'rounded-xl' },
] as const;

export type PhotoShapeId = typeof PHOTO_SHAPES[number]['id'];

export interface ThemePreset {
  id: string;
  name: string;
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    accent: string;
    accentMid: string;
    bg: string;
    bgAlt: string;
    muted: string;
    border: string;
  };
}

export const THEMES: Record<string, ThemePreset> = {
  docenteLink: {
    id: 'docenteLink',
    name: 'DocenteLink',
    colors: {
      primary: '#534AB7',
      primaryDark: '#3C3489',
      primaryLight: '#EEEDFE',
      accent: '#1D9E75',
      accentMid: '#5DCAA5',
      bg: '#F5F4FE',
      bgAlt: '#ECEAFF',
      muted: '#5F5E5A',
      border: '#D4D1F5',
    },
  },
  default: {
    id: 'default',
    name: 'Clásico',
    colors: {
      primary: '#1e1b4b',
      primaryDark: '#1e1b4b',
      primaryLight: '#e2e8f0',
      accent: '#e879f9',
      accentMid: '#d946ef',
      bg: '#f8fafc',
      bgAlt: '#f1f5f9',
      muted: '#64748b',
      border: '#e2e8f0',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Océano',
    colors: {
      primary: '#0f766e',
      primaryDark: '#115e59',
      primaryLight: '#ccfbf1',
      accent: '#06b6d4',
      accentMid: '#0891b2',
      bg: '#ecfeff',
      bgAlt: '#cffafe',
      muted: '#475569',
      border: '#cbd5e1',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Atardecer',
    colors: {
      primary: '#c2410c',
      primaryDark: '#9a3412',
      primaryLight: '#ffedd5',
      accent: '#f59e0b',
      accentMid: '#d97706',
      bg: '#fffbeb',
      bgAlt: '#fef3c7',
      muted: '#57534e',
      border: '#fcd34d',
    },
  },
  forest: {
    id: 'forest',
    name: 'Bosque',
    colors: {
      primary: '#166534',
      primaryDark: '#14532d',
      primaryLight: '#dcfce7',
      accent: '#84cc16',
      accentMid: '#65a30d',
      bg: '#f0fdf4',
      bgAlt: '#dcfce7',
      muted: '#4b5563',
      border: '#bbf7d0',
    },
  },
  royal: {
    id: 'royal',
    name: 'Royal',
    colors: {
      primary: '#5b21b6',
      primaryDark: '#4c1d95',
      primaryLight: '#ede9fe',
      accent: '#a855f7',
      accentMid: '#9333ea',
      bg: '#faf5ff',
      bgAlt: '#f3e8ff',
      muted: '#52525b',
      border: '#e9d5ff',
    },
  },
  marble: {
    id: 'marble',
    name: 'Mármol',
    colors: {
      primary: '#1f2937',
      primaryDark: '#111827',
      primaryLight: '#f3f4f6',
      accent: '#6b7280',
      accentMid: '#4b5563',
      bg: '#f9fafb',
      bgAlt: '#e5e7eb',
      muted: '#374151',
      border: '#d1d5db',
    },
  },
  coral: {
    id: 'coral',
    name: 'Coral',
    colors: {
      primary: '#be123c',
      primaryDark: '#9f1239',
      primaryLight: '#ffe4e6',
      accent: '#fb7185',
      accentMid: '#f43f5e',
      bg: '#fff1f2',
      bgAlt: '#ffe4e6',
      muted: '#881337',
      border: '#fecdd3',
    },
  },
  sky: {
    id: 'sky',
    name: 'Cielo',
    colors: {
      primary: '#0369a1',
      primaryDark: '#075985',
      primaryLight: '#e0f2fe',
      accent: '#38bdf8',
      accentMid: '#0ea5e9',
      bg: '#f0f9ff',
      bgAlt: '#e0f2fe',
      muted: '#0c4a6e',
      border: '#bae6fd',
    },
  },
  rose: {
    id: 'rose',
    name: 'Rosa',
    colors: {
      primary: '#9d174d',
      primaryDark: '#831843',
      primaryLight: '#fce7f3',
      accent: '#f472b6',
      accentMid: '#ec4899',
      bg: '#fdf2f8',
      bgAlt: '#fce7f3',
      muted: '#831843',
      border: '#fbcfe8',
    },
  },
};

export type ThemeId = keyof typeof THEMES;

export const DEFAULT_THEME = 'docenteLink';
export const DEFAULT_PHOTO_SHAPE = 'circle';
export const DEFAULT_PHOTO_BORDER = false;

export function getThemeColors(themeId: string): ThemePreset['colors'] {
  return THEMES[themeId]?.colors || THEMES.docenteLink.colors;
}

export function getPhotoShapeClass(shapeId: string): string {
  const shape = PHOTO_SHAPES.find((s) => s.id === shapeId);
  return shape?.className || PHOTO_SHAPES[0].className;
}
