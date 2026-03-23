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
  default: {
    id: 'default',
    name: 'Default',
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
    name: 'Ocean',
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
    name: 'Sunset',
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
    name: 'Forest',
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
};

export type ThemeId = keyof typeof THEMES;

export const DEFAULT_THEME = 'default';
export const DEFAULT_PHOTO_SHAPE = 'circle';
export const DEFAULT_PHOTO_BORDER = false;

export function getThemeColors(themeId: string): ThemePreset['colors'] {
  return THEMES[themeId]?.colors || THEMES.default.colors;
}

export function getPhotoShapeClass(shapeId: string): string {
  const shape = PHOTO_SHAPES.find((s) => s.id === shapeId);
  return shape?.className || PHOTO_SHAPES[0].className;
}