'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Camera, RefreshCw, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
// Lazy import for heavy library to reduce initial bundle size
const removeBackgroundLazy = async (file: File, options?: any) => {
  const { removeBackground } = await import('@imgly/background-removal');
  return removeBackground(file, options);
};

interface PhotoEditorProps {
  onPhotoProcessed: (file: File) => void;
  initialImageUrl?: string;
  extractedPhotoBlob?: Blob;
}

export const PhotoEditor = ({ onPhotoProcessed, initialImageUrl, extractedPhotoBlob }: PhotoEditorProps) => {
  const [photo, setPhoto] = useState<string | null>(initialImageUrl || null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [extractedPreview, setExtractedPreview] = useState<string | null>(() => extractedPhotoBlob ? URL.createObjectURL(extractedPhotoBlob) : null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeAndConvertToWebP = async (blob: Blob, maxWidth = 600, maxHeight = 600): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error('Canvas toBlob failed'));
        }, 'image/webp', 0.8);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  };

  const processImage = async (file: File) => {
    try {
      setIsProcessing(true);
      
      // Phase 1: Create an optimized version of the original image (keeping background)
      // This ensures that "Restore Original" also saves space.
      const optimizedOriginalBlob = await resizeAndConvertToWebP(file);
      const optimizedOriginalFile = new File([optimizedOriginalBlob], 'original.webp', { type: 'image/webp' });
      setOriginalFile(optimizedOriginalFile);
      
      // Phase 2: Lazy load the heavy library and remove background
      // We use the raw file for processing to give the AI maximum detail
      const resultBlob = await removeBackgroundLazy(file, {
        progress: (status: string, progress: number) => {
           console.log("Background removal progress:", status, progress);
        }
      });

      // Phase 3: Resize and convert the cropped result to WebP
      const optimizedCroppedBlob = await resizeAndConvertToWebP(resultBlob);

      const processedUrl = URL.createObjectURL(optimizedCroppedBlob);
      setPhoto(processedUrl);
      
      const processedFile = new File([optimizedCroppedBlob], 'avatar.webp', { type: 'image/webp' });
      onPhotoProcessed(processedFile);
      
      setIsProcessed(true);
      setIsDone(true);
    } catch (error) {
      console.error("Error al procesar la foto:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreOriginal = () => {
    if (originalFile) {
      const originalUrl = URL.createObjectURL(originalFile);
      setPhoto(originalUrl);
      onPhotoProcessed(originalFile);
      setIsProcessed(false);
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

  const useExtracted = () => {
    if (!extractedPhotoBlob) return;
    const file = new File([extractedPhotoBlob], 'extracted_cv_photo.jpg', { type: extractedPhotoBlob.type || 'image/jpeg' });
    setExtractedPreview(null); // Ocultar el prompt de confirmación
    processImage(file);
  };

  const rejectExtracted = () => {
    setExtractedPreview(null);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Prompt extraído de CV */}
      {extractedPreview && !photo && (
        <div className="w-full max-w-sm bg-dl-primary-bg/80 border-2 border-dl-accent/30 rounded-3xl p-6 flex flex-col items-center text-center space-y-4 shadow-sm animate-in zoom-in-95">
           <p className="text-sm font-black text-dl-primary-dark tracking-tight">Encontramos esta foto en tu CV</p>
           <img src={extractedPreview} alt="Foto extraída" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto" />
           <p className="text-[10px] font-bold text-dl-muted uppercase tracking-widest italic">¿Podés usarla o subir una nueva?</p>
           <div className="flex gap-2 w-full pt-2">
             <Button variant="outline" size="sm" className="flex-1 font-bold text-[10px]" onClick={rejectExtracted}>Descartar</Button>
             <Button variant="accent" size="sm" className="flex-1 font-bold text-[10px]" onClick={useExtracted}>Usar esta foto</Button>
           </div>
        </div>
      )}

      {/* Editor normal */}
      {(!extractedPreview || photo) && (
        <>
          <div className="relative group overflow-hidden animate-in fade-in">
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

         <div className="flex flex-col items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFile}
          />
          <div className="flex gap-2">
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
            
            {isProcessed && photo && !isProcessing && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-[10px] font-bold text-dl-muted hover:text-dl-primary-dark underline decoration-dotted"
                onClick={handleRestoreOriginal}
              >
                Volver al original
              </Button>
            )}
          </div>
          <p className="text-[10px] text-dl-muted font-bold uppercase tracking-widest italic opacity-70">
            Automáticamente aplicaremos el estilo editorial.
          </p>
       </div>
       </>
      )}
    </div>
  );
};
