'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { PdfUploader } from '@/components/parser/PdfUploader';
import { Button } from '@/components/ui/Button';
import { Sparkles, User, GraduationCap, Briefcase, ArrowLeft as ArrowLeftIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { StepPersonal } from '@/components/wizard/StepPersonal';
import { useSearchParams } from 'next/navigation';

import { StepExperience } from '@/components/wizard/StepExperience';
import { StepIdentity } from '@/components/wizard/StepIdentity';
import { saveResumeAction } from '@/app/actions/cv';
import { getResumeAction } from '@/app/actions/get-cv';

/* 
  Next.js Build Fix: useSearchParams must be used within a Suspense boundary 
  when doing static generation or client-side navigation that can bail out to CSR.
*/
function CreateCvContent() {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  const [currentStep, setCurrentStep] = useState(0); 
  const [parsedData, setParsedData] = useState<Record<string, any> | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    async function loadData() {
      if (isEditMode) {
        setIsLoading(true);
        const existingData = await getResumeAction();
        if (existingData) {
          setFormData(existingData);
          setCurrentStep(1);
        }
        setIsLoading(false);
      }
    }
    loadData();
  }, [isEditMode]);

  const handleDataParsed = (data: any) => {
    setParsedData(data);
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNextStep = async (stepData: any) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    try {
      saveResumeAction({ ...updatedData, isAutosave: true }); 
    } catch (e) {
      console.warn("Autosave falló:", e);
    }

    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinish = async (finalData: any) => {
    try {
      setIsSubmitting(true);
      const fullData = { ...formData, ...finalData, parsedFromPdf: !!parsedData };
      await saveResumeAction(fullData);
      return true;
    } catch (error: any) {
       if (error.message?.includes('NEXT_REDIRECT') || error.digest?.includes('NEXT_REDIRECT')) {
         return true;
       }
       alert(`Hubo un error al guardar tu CV: ${error.message}`);
       setIsSubmitting(false);
       return false;
    }
  };

  if (isLoading || isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-1000">
         <div className="relative">
            <Loader2 className="w-24 h-24 text-dl-accent animate-spin" />
            <Sparkles className="absolute top-0 right-0 w-8 h-8 text-dl-primary animate-pulse" />
         </div>
         <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-dl-primary-dark">
               {isSubmitting ? "Estamos publicando tu perfil..." : "Cargando tus datos..."}
            </h2>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-20 left-0 right-0 z-40 bg-white border-b border-dl-primary-light/10 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentStep > 0 ? (
              <Button variant="ghost" size="sm" onClick={handleGoBack} className="group h-9">
                <ArrowLeftIcon className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Atrás</span>
              </Button>
            ) : (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="group h-9">
                  <ArrowLeftIcon className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="hidden sm:inline">Escritorio</span>
                </Button>
              </Link>
            )}
            <div className="h-4 w-[1px] bg-dl-primary-light/20 mx-2 hidden sm:block"></div>
            <span className="text-[10px] font-black text-dl-accent uppercase tracking-[0.2em]">Paso {currentStep} de 3</span>
          </div>
          
          <div className="flex items-center gap-3">
             {[1, 2, 3].map((s) => (
               <div key={s} className="flex flex-col items-center gap-1">
                 <div className={cn(
                   "h-1.5 rounded-full transition-all duration-700",
                   currentStep >= s ? "w-10 bg-dl-accent shadow-[0_0_10px_rgba(var(--dl-accent-rgb),0.3)]" : "w-6 bg-dl-primary-light/20"
                 )} />
                 <span className={cn(
                   "text-[8px] font-black uppercase tracking-tighter transition-colors",
                   currentStep === s ? "text-dl-accent" : "text-dl-muted opacity-40"
                 )}>
                   {s === 1 ? 'Personal' : s === 2 ? 'Experiencia' : 'Identidad'}
                 </span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className={cn(
        "max-w-6xl mx-auto px-6 pt-40 pb-20 space-y-16"
      )}>
        {currentStep === 0 && (
          <>
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold text-dl-primary-dark tracking-tight leading-tight">
                ¡Hola! Vamos a crear <br />
                <span className="text-dl-accent">tu perfil profesional docente.</span>
              </h1>
              <p className="text-xl text-dl-muted font-medium max-w-2xl leading-relaxed">
                Nuestra IA puede leer tu CV actual en PDF y completar el formulario por vos.
              </p>
            </div>

            {!parsedData ? (
              <div className="space-y-12 py-10">
                <PdfUploader onDataParsed={handleDataParsed} />
                <div className="flex flex-col items-center gap-4 pt-10">
                  <p className="text-dl-muted font-bold tracking-tight">O también podés</p>
                  <Button variant="outline" size="lg" onClick={() => setCurrentStep(1)} className="font-black px-12">
                    Completar manualmente
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-12 py-10 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-10 rounded-[2.5rem] bg-dl-accent/5 border-2 border-dl-accent/20 space-y-4">
                     <h3 className="text-dl-primary-dark font-black uppercase text-xs tracking-widest flex items-center gap-2">
                        <User className="w-4 h-4" /> Personales
                     </h3>
                     <p className="text-dl-primary-dark font-black tracking-tight text-xl">{parsedData.nombre}</p>
                  </div>
                  <div className="p-10 rounded-[2.5rem] bg-dl-primary-bg border-2 border-dl-primary-light/40 space-y-4 text-center">
                     <h3 className="text-dl-primary-dark font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                        <GraduationCap className="w-4 h-4" /> Formación
                     </h3>
                     <p className="text-dl-primary-dark font-black text-6xl">{parsedData.formacion?.length || 0}</p>
                  </div>
                  <div className="p-10 rounded-[2.5rem] bg-dl-primary-bg border-2 border-dl-primary-light/40 space-y-4 text-center">
                     <h3 className="text-dl-primary-dark font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                        <Briefcase className="w-4 h-4" /> Trayectoria
                     </h3>
                     <p className="text-dl-primary-dark font-black text-6xl">{parsedData.experiencia?.length || 0}</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button variant="primary" size="xl" onClick={() => setCurrentStep(1)} className="font-black px-16 shadow-xl">
                      Lanzar Wizard <Sparkles className="ml-2 w-6 h-6 animate-pulse" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {currentStep === 1 && (
          <div className="space-y-8 max-w-5xl mx-auto">
             <div className="space-y-2">
                <h2 className="text-3xl font-black text-dl-primary-dark">Datos Personales & Foto</h2>
                <p className="text-dl-muted font-bold text-lg">Contanos quién sos y cómo te vemos.</p>
             </div>
             <StepPersonal initialData={formData} onNext={handleNextStep} />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8 max-w-5xl mx-auto">
             <div className="space-y-2">
                <h2 className="text-3xl font-black text-dl-primary-dark">Experiencia & Educación</h2>
                <p className="text-dl-muted font-bold text-lg">Tu camino recorrido hasta hoy.</p>
             </div>
             <StepExperience initialData={formData} onBack={handleGoBack} onNext={handleNextStep} />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8 max-w-5xl mx-auto">
             <div className="space-y-2">
                <h2 className="text-3xl font-black text-dl-primary-dark">Identidad Docente</h2>
                <p className="text-dl-muted font-bold text-lg">Lo que te hace único en el aula.</p>
             </div>
             <StepIdentity initialData={formData} onBack={handleGoBack} onFinish={handleFinish} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateCvPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-dl-accent animate-spin" />
      </div>
    }>
      <CreateCvContent />
    </Suspense>
  );
}
