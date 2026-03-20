'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Camera, RefreshCw, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

interface PhotoEditorProps {
  onPhotoProcessed: (file: File) => void;
  initialImageUrl?: string;
}

export const PhotoEditor = ({ onPhotoProcessed, initialImageUrl }: PhotoEditorProps) => {
  const [photo, setPhoto] = useState<string | null>(initialImageUrl || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    try {
      setIsProcessing(true);
      
      const blob = await removeBackground(file, {
        progress: (status: string, progress: number) => {
           console.log("Background removal progress:", status, progress);
        }
      });

      const processedUrl = URL.createObjectURL(blob);
      setPhoto(processedUrl);
      
      const processedFile = new File([blob], 'avatar.png', { type: 'image/png' });
      onPhotoProcessed(processedFile);
      
      setIsDone(true);
    } catch (error) {
      console.error("Error al procesar la foto:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative group overflow-hidden">
         <div className="w-48 h-48 rounded-[3.5rem] bg-dl-primary-bg border-4 border-dl-primary-light flex items-center justify-center relative overflow-hidden shadow-inner group-hover:border-dl-accent/40 transition-all duration-500">
            {photo ? (
              <img src={photo} alt="Vista previa" className="w-full h-full object-cover transition-all duration-700 animate-in fade-in" />
            ) : (
              <Camera className="w-12 h-12 text-dl-primary-light group-hover:text-dl-accent transition-colors duration-300" />
            )}
            
            {isProcessing && (
              <div className="absolute inset-0 bg-dl-primary-dark/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center">
                 <Loader2 className="w-8 h-8 animate-spin mb-2 text-dl-accent" />
                 <p className="text-[10px] font-black uppercase tracking-widest leading-none">Eliminando Fondo...</p>
              </div>
            )}

            {isDone && !isProcessing && (
               <div className="absolute top-4 right-4 bg-dl-accent text-white p-1 rounded-full shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
               </div>
            )}
         </div>

         <div className="absolute -top-4 -right-4 w-12 h-12 text-dl-accent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <Sparkles className="w-full h-full animate-pulse" />
         </div>
      </div>

      <div className="flex flex-col items-center gap-2">
         <input 
           type="file" 
           ref={fileInputRef} 
           className="hidden" 
           accept="image/*" 
           onChange={handleFile}
         />
         <Button 
            type="button"
            variant="outline" 
            size="sm" 
            className="font-black rounded-full px-6 relative z-10"
            onClick={handleButtonClick}
            disabled={isProcessing}
         >
            {photo ? (
              <span className="flex items-center gap-2">
                 <RefreshCw className="w-3 h-3" />
                 Cambiar mi foto
              </span>
            ) : (
              "Elegir mi foto de perfil"
            )}
         </Button>
         <p className="text-[10px] text-dl-muted font-bold uppercase tracking-widest italic opacity-70">
            Automáticamente aplicaremos el estilo editorial.
         </p>
      </div>
    </div>
  );
};
