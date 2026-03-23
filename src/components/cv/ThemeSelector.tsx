'use client';

import { useState } from 'react';
import { Save, Palette, Image, Check, Square } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { THEMES, PHOTO_SHAPES, getPhotoShapeClass, DEFAULT_THEME, DEFAULT_PHOTO_SHAPE, DEFAULT_PHOTO_BORDER } from '@/lib/themes';
import { updateAppearanceAction } from '@/app/actions/update-appearance';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
  resumeId: string;
  initialTheme?: string;
  initialPhotoShape?: string;
  initialPhotoBorder?: boolean;
}

export function ThemeSelector({ 
  resumeId, 
  initialTheme = DEFAULT_THEME,
  initialPhotoShape = DEFAULT_PHOTO_SHAPE,
  initialPhotoBorder = DEFAULT_PHOTO_BORDER,
}: ThemeSelectorProps) {
  const [theme, setTheme] = useState(initialTheme);
  const [photoShape, setPhotoShape] = useState(initialPhotoShape);
  const [photoBorder, setPhotoBorder] = useState(initialPhotoBorder);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    const colors = THEMES[newTheme]?.colors;
    if (colors) {
      const root = document.documentElement;
      root.style.setProperty('--dl-primary', colors.primary);
      root.style.setProperty('--dl-primary-dark', colors.primaryDark);
      root.style.setProperty('--dl-primary-light', colors.primaryLight);
      root.style.setProperty('--dl-accent', colors.accent);
      root.style.setProperty('--dl-accent-mid', colors.accentMid);
      root.style.setProperty('--dl-primary-bg', colors.bg);
      root.style.setProperty('--dl-primary-bg-alt', colors.bgAlt);
      root.style.setProperty('--dl-muted', colors.muted);
      root.style.setProperty('--dl-primary-border', colors.border);
    }

    const photoElement = document.querySelector('[data-profile-photo]') as HTMLElement;
    if (photoElement) {
      photoElement.className = photoElement.className.replace(/rounded-\w+/g, '').replace(/rounded-\d+/g, '');
      photoElement.classList.add(getPhotoShapeClass(photoShape));
      
      if (photoBorder) {
        photoElement.classList.add('ring-4', 'ring-[var(--dl-accent)]');
      } else {
        photoElement.classList.remove('ring-4', 'ring-[var(--dl-accent)]');
      }
    }
  };

  const handlePhotoShapeChange = (newShape: string) => {
    setPhotoShape(newShape);
    const photoElement = document.querySelector('[data-profile-photo]') as HTMLElement;
    if (photoElement) {
      photoElement.className = photoElement.className.replace(/rounded-\w+/g, '').replace(/rounded-\d+/g, '');
      photoElement.classList.add(getPhotoShapeClass(newShape));
    }
  };

  const handlePhotoBorderToggle = () => {
    const newBorder = !photoBorder;
    setPhotoBorder(newBorder);
    const photoElement = document.querySelector('[data-profile-photo]') as HTMLElement;
    if (photoElement) {
      if (newBorder) {
        photoElement.classList.add('ring-4', 'ring-[var(--dl-accent)]');
      } else {
        photoElement.classList.remove('ring-4', 'ring-[var(--dl-accent)]');
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAppearanceAction({
        resumeId,
        theme,
        photoShape,
        photoBorder,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving appearance:', error);
    } finally {
      setSaving(false);
    }
  };

  const themeEntries = Object.values(THEMES);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 space-y-5 w-72 shrink-0">
      <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: 'color-mix(in srgb, var(--dl-primary) 20%, transparent)' }}>
        <Palette className="w-4 h-4" style={{ color: 'var(--dl-accent)' }} />
        <h3 className="font-black uppercase text-[10px] tracking-wider" style={{ color: 'var(--dl-primary-dark)' }}>
          Personalizar
        </h3>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--dl-muted)' }}>
          Color del tema
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {themeEntries.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className="w-10 h-10 rounded-lg border-2 transition-all hover:scale-105 relative overflow-hidden"
              style={{ 
                borderColor: theme === t.id ? t.colors.primaryDark : 'color-mix(in srgb, var(--dl-primary) 30%, transparent)',
                boxShadow: theme === t.id ? `0 0 0 2px var(--dl-accent)` : 'none',
              }}
              title={t.name}
            >
              <div className="absolute inset-0" style={{ backgroundColor: t.colors.primary }} />
              <div className="absolute inset-0" style={{ 
                clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                backgroundColor: t.colors.accent 
              }} />
              {theme === t.id && (
                <Check className="absolute inset-0 m-auto w-4 h-4 z-10" style={{ color: '#fff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
              )}
            </button>
          ))}
        </div>
        <p className="text-[9px] font-bold text-center" style={{ color: 'var(--dl-muted)' }}>
          {THEMES[theme]?.name || 'DocenteLink'}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1" style={{ color: 'var(--dl-muted)' }}>
          <Square className="w-3 h-3" /> Borde de la foto
        </label>
        <button
          onClick={handlePhotoBorderToggle}
          className={cn(
            'w-full py-2 px-3 rounded-lg border-2 text-[10px] font-black uppercase transition-all',
            photoBorder ? 'border-current' : 'hover:border-dl-accent'
          )}
          style={{ 
            backgroundColor: photoBorder ? 'var(--dl-accent)' : '#fff',
            color: photoBorder ? '#fff' : 'var(--dl-muted)',
            borderColor: photoBorder ? 'var(--dl-accent)' : 'color-mix(in srgb, var(--dl-primary) 30%, transparent)'
          }}
        >
          {photoBorder ? 'Activado' : 'Desactivado'}
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1" style={{ color: 'var(--dl-muted)' }}>
          <Image className="w-3 h-3" /> Forma de la foto
        </label>
        <div className="flex gap-1.5">
          {PHOTO_SHAPES.map((shape) => (
            <button
              key={shape.id}
              onClick={() => handlePhotoShapeChange(shape.id)}
              className={cn(
                'flex-1 py-1.5 px-2 rounded-lg border-2 text-[9px] font-black uppercase transition-all',
                photoShape === shape.id ? 'border-current' : 'hover:border-dl-accent'
              )}
              style={{ 
                backgroundColor: photoShape === shape.id ? 'var(--dl-primary)' : '#fff',
                color: photoShape === shape.id ? '#fff' : 'var(--dl-muted)',
                borderColor: photoShape === shape.id ? 'var(--dl-primary)' : 'color-mix(in srgb, var(--dl-primary) 30%, transparent)'
              }}
            >
              {shape.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        variant={saved ? 'outline' : 'primary'}
        size="sm"
        className="w-full font-black text-xs"
      >
        {saving ? 'Guardando...' : saved ? <><Check className="w-3 h-3 mr-1" /> Guardado</> : <><Save className="w-3 h-3 mr-1" /> Guardar</>}
      </Button>
    </div>
  );
}
