'use client';

import { useState } from 'react';
import { Save, Palette, Image, Check, Square, ChevronDown } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div 
      className={cn(
        "w-full bg-white rounded-3xl overflow-hidden transition-all duration-300 border shadow-sm mb-6",
        isExpanded ? "shadow-md" : "hover:bg-gray-50/50"
      )}
      style={{ borderColor: 'color-mix(in srgb, var(--dl-primary) 15%, transparent)' }}
    >
      {/* Header Toolbar (Always visible) */}
      <button 
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between group transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: 'var(--dl-primary-bg)', color: 'var(--dl-accent)' }}>
            <Palette className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h3 className="font-black uppercase text-[10px] tracking-widest leading-none mb-1" style={{ color: 'var(--dl-primary-dark)' }}>
              Personalizar mi perfil
            </h3>
            <p className="text-[9px] font-bold uppercase tracking-tight opacity-60 leading-none">
              Cambia colores y estilo de foto
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Preview circles */}
          {!isExpanded && (
            <div className="hidden sm:flex -space-x-1.5 overflow-hidden">
               {themeEntries.slice(0, 3).map(t => (
                 <div key={t.id} className="w-4 h-4 rounded-full border border-white ring-1 ring-black/5" style={{ backgroundColor: t.colors.primary }} />
               ))}
            </div>
          )}
          <div className={cn(
            "p-1 rounded-full transition-transform duration-300",
            isExpanded ? "rotate-180 bg-gray-100" : "bg-transparent"
          )}>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </button>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-2 space-y-8 animate-in slide-in-from-top-2 duration-300">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Color Grid */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--dl-muted)' }}>
                <span className="w-1 h-1 rounded-full bg-dl-accent" style={{ backgroundColor: 'var(--dl-accent)' }} />
                Paleta de colores
              </label>
              <div className="grid grid-cols-5 xs:grid-cols-10 md:grid-cols-5 gap-2">
                {themeEntries.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleThemeChange(t.id)}
                    className="aspect-square rounded-xl border-2 transition-all hover:ring-2 hover:ring-dl-accent relative overflow-hidden group shadow-sm"
                    style={{ 
                      borderColor: theme === t.id ? 'var(--dl-accent)' : 'transparent',
                    }}
                    title={t.name}
                  >
                    <div className="absolute inset-0" style={{ backgroundColor: t.colors.primary }} />
                    <div className="absolute inset-0" style={{ 
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                      backgroundColor: t.colors.accent 
                    }} />
                    {theme === t.id && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" style={{ color: '#fff' }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-center md:text-left pt-1" style={{ color: 'var(--dl-accent)' }}>
                Tema actual: {THEMES[theme]?.name}
              </p>
            </div>

            <div className="space-y-6">
              {/* Photo Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--dl-muted)' }}>
                    <Square className="w-3 h-3" /> Borde
                  </label>
                  <button
                    type="button"
                    onClick={handlePhotoBorderToggle}
                    className={cn(
                      'w-full py-2.5 px-3 rounded-xl border font-black uppercase text-[10px] transition-all shadow-sm',
                      photoBorder ? 'text-white' : 'bg-white hover:border-dl-accent'
                    )}
                    style={{ 
                      backgroundColor: photoBorder ? 'var(--dl-accent)' : '#fff',
                      borderColor: photoBorder ? 'var(--dl-accent)' : 'color-mix(in srgb, var(--dl-primary) 15%, transparent)',
                      color: photoBorder ? '#fff' : 'var(--dl-primary-dark)',
                    }}
                  >
                    {photoBorder ? 'Con Borde' : 'Sin Borde'}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--dl-muted)' }}>
                    <Image className="w-3 h-3" /> Forma
                  </label>
                  <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
                    {PHOTO_SHAPES.map((shape) => (
                      <button
                        key={shape.id}
                        type="button"
                        onClick={() => handlePhotoShapeChange(shape.id)}
                        className={cn(
                          'flex-1 py-1.5 px-2 rounded-lg text-[9px] font-black uppercase transition-all',
                          photoShape === shape.id ? 'bg-white shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'
                        )}
                        style={{ 
                          color: photoShape === shape.id ? 'var(--dl-primary-dark)' : undefined
                        }}
                      >
                        {shape.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  variant={saved ? 'outline' : 'primary'}
                  size="sm"
                  className="w-full font-black text-xs h-11 rounded-xl shadow-lg active:scale-95 transition-all"
                  style={{
                    backgroundColor: !saved && !saving ? 'var(--dl-primary-dark)' : undefined,
                  }}
                >
                  {saving ? (
                    'Guardando...'
                  ) : saved ? (
                    <><Check className="w-3.5 h-3.5 mr-2 text-green-500" /> ¡Estilo guardado!</>
                  ) : (
                    <><Save className="w-3.5 h-3.5 mr-2" /> Aplicar cambios permanentes</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
