'use client';

import React, { useState } from 'react';
import { PdfUploader } from '@/components/parser/PdfUploader';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Sparkles, User, GraduationCap, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { StepPersonal } from '@/components/wizard/StepPersonal';

import { StepExperience } from '@/components/wizard/StepExperience';
import { StepIdentity } from '@/components/wizard/StepIdentity';
import { saveResumeAction } from '@/app/actions/cv';
import { Loader2 } from 'lucide-react';

export default function CreateCvPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0: Parser, 1: Personal, 2: Exp/Edu, 3: Meta
  const [parsedData, setParsedData] = useState<Record<string, any> | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDataParsed = (data: any) => {
    console.log("Datos recibidos de Gemini:", data);
    setParsedData(data);
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNextStep = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => prev + 1);
  };

  const handleFinish = async (finalData: any) => {
    try {
      setIsSubmitting(true);
      const fullData = { ...formData, ...finalData, parsedFromPdf: !!parsedData };
      await saveResumeAction(fullData);
      return true; // Exito
    } catch (error: any) {
       console.error("Error al guardar:", error);
       alert(`Hubo un error al guardar tu CV: ${error.message || 'Intenta cambiar el slug'}`);
       setIsSubmitting(false);
       return false;
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-1000">
         <div className="relative">
            <Loader2 className="w-24 h-24 text-dl-accent animate-spin" />
            <Sparkles className="absolute top-0 right-0 w-8 h-8 text-dl-primary animate-pulse" />
         </div>
         <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-dl-primary-dark">Estamos publicando tu perfil...</h2>
            <p className="text-dl-muted font-bold text-lg">Esto solo tomará un momento, profe.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="group">
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver
            </Button>
          </Link>
          <span className="text-xs font-black text-dl-muted uppercase tracking-[0.2em]">Paso {currentStep} de 3</span>
        </div>
        
        {/* Progress Bar Simplificada */}
        <div className="hidden sm:flex items-center gap-2">
           {[1, 2, 3].map((s) => (
             <div key={s} className={cn(
               "h-2 rounded-full transition-all duration-500",
               currentStep >= s ? "w-12 bg-dl-accent" : "w-6 bg-dl-primary-light/40"
             )} />
           ))}
        </div>
      </div>

      {currentStep === 0 && (
        <>
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-dl-primary-dark tracking-tight leading-tight">
              ¡Hola! Vamos a crear <br />
              <span className="text-dl-accent">tu perfil profesional docente.</span>
            </h1>
            <p className="text-xl text-dl-muted font-medium max-w-2xl leading-relaxed">
              Para ahorrar tiempo, nuestra IA puede leer tu CV actual en PDF y completar el formulario por vos.
            </p>
          </div>

          {!parsedData ? (
            <div className="space-y-12 py-10">
              <PdfUploader onDataParsed={handleDataParsed} />
              
              <div className="flex flex-col items-center gap-4 pt-10">
                <p className="text-dl-muted font-bold tracking-tight">O también podés</p>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto font-black px-12"
                  onClick={() => setCurrentStep(1)}
                >
                  Completar manualmente
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-12 py-10 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-10 rounded-[2.5rem] bg-dl-accent/5 border-2 border-dl-accent/20 space-y-4">
                   <h3 className="text-dl-primary-dark font-black uppercase text-xs tracking-widest flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Personales
                   </h3>
                   <div className="space-y-1">
                      <p className="text-dl-primary-dark font-black tracking-tight text-xl">{parsedData.nombre || "Sin nombre"}</p>
                      <p className="text-dl-muted font-bold text-sm">{parsedData.email || "Sin email"}</p>
                   </div>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-dl-primary-bg border-2 border-dl-primary-light/40 space-y-4">
                   <h3 className="text-dl-primary-dark font-black uppercase text-xs tracking-widest flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Formación
                   </h3>
                   <p className="text-dl-primary-dark font-black text-6xl">{parsedData.formacion?.length || 0}</p>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-dl-primary-bg border-2 border-dl-primary-light/40 space-y-4">
                   <h3 className="text-dl-primary-dark font-black uppercase text-xs tracking-widest flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Trayectoria
                   </h3>
                   <p className="text-dl-primary-dark font-black text-6xl">{parsedData.experiencia?.length || 0}</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 py-8">
                <Button 
                  variant="primary" 
                  size="xl" 
                  className="w-full sm:w-auto font-black px-16 shadow-xl active:scale-95 transition-all"
                  onClick={() => setCurrentStep(1)}
                >
                    Lanzar Wizard con mis datos
                    <Sparkles className="ml-2 w-6 h-6 animate-pulse" />
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
           
           <StepPersonal 
              initialData={formData} 
              onNext={handleNextStep} 
           />
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-8 max-w-5xl mx-auto">
           <div className="space-y-2">
              <h2 className="text-3xl font-black text-dl-primary-dark">Experiencia & Educación</h2>
              <p className="text-dl-muted font-bold text-lg">Tu camino recorrido hasta hoy.</p>
           </div>
           
           <StepExperience 
              initialData={formData} 
              onBack={() => setCurrentStep(1)} 
              onNext={handleNextStep} 
           />
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-8 max-w-5xl mx-auto">
           <div className="space-y-2">
              <h2 className="text-3xl font-black text-dl-primary-dark">Identidad Docente</h2>
              <p className="text-dl-muted font-bold text-lg">Lo que te hace único en el aula.</p>
           </div>
           
           <StepIdentity 
              initialData={formData} 
              onBack={() => setCurrentStep(2)} 
              onFinish={handleFinish} 
           />
        </div>
      )}
    </div>
  );
}
