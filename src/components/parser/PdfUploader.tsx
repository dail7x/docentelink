'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FileUp, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { extractPdfText, extractPhotoFromPdf } from '@/lib/pdf-parser';
import { cn } from '@/lib/utils';
import { parseCvFromText } from '@/app/actions/parse-cv';

interface PdfUploaderProps {
  onDataParsed: (data: any) => void;
  className?: string;
}

export const PdfUploader = ({ onDataParsed, className }: PdfUploaderProps) => {
  const [status, setStatus] = useState<'idle' | 'extracting' | 'parsing' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setStatus('extracting');
      setErrorMessage(null);

      // 1. Extraemos texto del PDF y foto en paralelo en el cliente
      const [text, photoBlob] = await Promise.all([
        extractPdfText(file),
        extractPhotoFromPdf(file)
      ]);
      
      if (!text || text.trim().length < 50) {
        throw new Error("El PDF no parece tener suficiente texto extraíble. ¿Es una imagen escaneada?");
      }

      setStatus('parsing');

      // 2. Procesamos con IA usando Server Action (evita waterfall HTTP)
      // Parallel processing: IA parsing happens while we already have the text
      const result = await parseCvFromText(text);

      if (result.success && result.data) {
        if (result.data.es_cv_docente === false) {
          setWarning(result.data.observaciones || "Este CV no parece de perfil docente o educativo. ¿Querés continuar usando los datos extraídos de todas formas?");
        }
        setStatus('done');

        // Agregar foto a los datos devueltos si existe
        const finalData = { ...result.data } as Record<string, unknown>;
        if (photoBlob) {
          finalData.photoPreview = URL.createObjectURL(photoBlob);
          finalData.photoBlob = photoBlob;
        }

        onDataParsed(finalData);
      } else {
        throw new Error(result.message || "Error al procesar con IA");
      }

    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Algo salió mal al procesar tu archivo.");
      setStatus('error');
    }
  };

  return (
    <div className={cn("w-full max-w-xl mx-auto space-y-6", className)}>
      <div className={cn(
        "relative rounded-[2rem] border-4 border-dashed p-12 transition-all duration-300 flex flex-col items-center justify-center text-center space-y-4",
        status === 'idle' && "border-dl-primary-light bg-white hover:border-dl-primary/50",
        (status === 'extracting' || status === 'parsing') && "border-dl-primary-mid bg-dl-primary-bg/50 animate-pulse",
        status === 'done' && !warning && "border-dl-accent bg-dl-accent-light",
        status === 'done' && warning && "border-yellow-400 bg-yellow-50",
        status === 'error' && "border-red-200 bg-red-50"
      )}>
        
        <input 
          type="file" 
          accept="application/pdf"
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleFileChange}
          disabled={status === 'extracting' || status === 'parsing'}
        />

        {status === 'idle' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-dl-primary-light text-dl-primary flex items-center justify-center">
              <FileUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xl font-bold text-dl-primary-dark">Soltá tu CV aquí</p>
              <p className="text-dl-muted font-medium">O hacé clic para buscar tu PDF</p>
            </div>
            <p className="text-xs text-dl-muted/60 uppercase font-bold tracking-widest pt-4">Máx 10 MB • Solo PDF</p>
          </>
        )}

        {(status === 'extracting' || status === 'parsing') && (
          <>
            <Loader2 className="w-16 h-16 text-dl-primary-mid animate-spin" />
            <div className="space-y-1">
              <p className="text-xl font-bold text-dl-primary-dark">
                {status === 'extracting' ? "Leyendo archivo..." : "Analizando trayectoria con IA..."}
              </p>
              <p className="text-dl-muted font-medium">Esto toma unos segundos...</p>
            </div>
          </>
        )}

        {status === 'done' && !warning && (
          <>
            <CheckCircle2 className="w-16 h-16 text-dl-accent" />
            <div className="space-y-1">
              <p className="text-xl font-bold text-dl-primary-dark tracking-tight">¡Lectura completa!</p>
              <p className="text-dl-muted font-medium italic">Terminamos de extraer tus datos.</p>
            </div>
          </>
        )}

        {status === 'done' && warning && (
          <>
            <AlertCircle className="w-16 h-16 text-yellow-500" />
            <div className="space-y-1 px-4">
              <p className="text-xl font-bold text-yellow-800 tracking-tight">Aviso de la IA</p>
              <p className="text-yellow-700/90 font-medium text-sm mt-2">{warning}</p>
              <p className="text-yellow-600 font-bold text-xs mt-4">Podés continuar de todas formas.</p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-16 h-16 text-red-400" />
            <div className="space-y-1">
              <p className="text-xl font-bold text-red-900 tracking-tight">Ocurrió un problema</p>
              <p className="text-red-700/80 font-medium text-sm px-8">{errorMessage}</p>
              <p className="text-xs pt-4 text-dl-primary font-bold underline cursor-pointer">Reintentar</p>
            </div>
          </>
        )}
      </div>

      {status === 'done' && (
        <div className="flex justify-center">
           <Button variant={warning ? "outline" : "accent"} size="lg" className="px-10 font-black animate-in fade-in slide-in-from-bottom-2">
              Continuar al Wizard
           </Button>
        </div>
      )}
    </div>
  );
};
