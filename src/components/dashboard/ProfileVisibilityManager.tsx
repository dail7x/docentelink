'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { updateProfileVisibility } from '@/app/actions/visibility';

interface ProfileVisibilityManagerProps {
  resumeId: string;
  isPublic: boolean;
  hiddenUntil: string | null;
}

export const ProfileVisibilityManager = ({ resumeId, isPublic, hiddenUntil }: ProfileVisibilityManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentIsPublic, setCurrentIsPublic] = useState(isPublic);

  // If there's a hiddenUntil date, we check if it's still in the future
  const parsedHidden = hiddenUntil ? new Date(hiddenUntil) : null;
  const isHiddenTemporarily = parsedHidden && parsedHidden > new Date();
  
  const isActuallyPublic = currentIsPublic && (!isHiddenTemporarily);

  const handleUpdate = async (timeMode: 'forever' | '1h' | '24h' | '7d' | 'activate') => {
    setLoading(true);
    try {
      if (timeMode === 'activate') {
        await updateProfileVisibility(resumeId, true, null);
        setCurrentIsPublic(true);
      } else {
        let until: Date | null = null;
        if (timeMode === '1h') {
          until = new Date();
          until.setHours(until.getHours() + 1);
        } else if (timeMode === '24h') {
          until = new Date();
          until.setHours(until.getHours() + 24);
        } else if (timeMode === '7d') {
          until = new Date();
          until.setDate(until.getDate() + 7);
        }
        await updateProfileVisibility(resumeId, timeMode !== 'forever', until?.toISOString() || null);
        setCurrentIsPublic(timeMode !== 'forever'); // If forever, isPublic is false.
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar la visibilidad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl border-2 border-dl-primary-light/10 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase text-dl-muted tracking-widest">Estado</p>
          <div className="flex items-center gap-2 mt-1">
             {isActuallyPublic ? (
               <p className="text-lg font-black text-green-600 flex items-center gap-2 uppercase tracking-tight">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Publicado
               </p>
             ) : (
               <p className="text-lg font-black text-red-500 flex items-center gap-2 uppercase tracking-tight">
                  <EyeOff className="w-5 h-5" />
                  Oculto
               </p>
             )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isActuallyPublic ? "Ocultar" : "Activar"}
        </Button>
      </div>

      {isOpen && (
        <div className="pt-4 border-t border-dl-primary-light/10 space-y-3 animate-in fade-in slide-in-from-top-2">
          {isActuallyPublic ? (
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-2 rounded-lg text-xs font-bold">
                 <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                 <p>Tu perfil no será visible para nadie mientras esté oculto.</p>
              </div>
              <p className="text-[10px] font-black uppercase text-dl-muted tracking-widest">¿Por cuánto tiempo?</p>
              <div className="grid grid-cols-2 gap-2">
                 <Button variant="ghost" size="sm" className="bg-dl-primary-bg/50 justify-start" onClick={() => handleUpdate('1h')}>1 Hora</Button>
                 <Button variant="ghost" size="sm" className="bg-dl-primary-bg/50 justify-start" onClick={() => handleUpdate('24h')}>1 Día</Button>
                 <Button variant="ghost" size="sm" className="bg-dl-primary-bg/50 justify-start" onClick={() => handleUpdate('7d')}>1 Semana</Button>
                 <Button variant="ghost" size="sm" className="bg-dl-primary-bg/50 justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleUpdate('forever')}>Hasta que lo active</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
               <p className="text-xs font-bold text-dl-muted">¿Querés volver a hacer público tu perfil?</p>
               <Button variant="primary" size="sm" className="w-full" onClick={() => handleUpdate('activate')}>
                  Activar perfil ahora
               </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
