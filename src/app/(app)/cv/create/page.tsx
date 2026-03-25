'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sparkles, User, GraduationCap, Briefcase, ArrowLeft, Loader2 } from 'lucide-react';

import { PdfUploader } from '@/components/parser/PdfUploader';
import { Button } from '@/components/ui/Button';
import { WizardProgress } from '@/components/wizard/WizardProgress';
import { StepPersonal } from '@/components/wizard/StepPersonal';
import { StepExperience } from '@/components/wizard/StepExperience';
import { StepIdentity } from '@/components/wizard/StepIdentity';
import { saveResumeAction } from '@/app/actions/cv';
import { getResumeAction } from '@/app/actions/get-cv';
import { WIZARD_STEP_INDEXES } from '@/data/wizard';
import type { ParsedCvData, WizardFormData } from '@/types/wizard';
import { getOgDeps } from '@/lib/og';

function LoadingState({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-1000">
      <div className="relative">
        <Loader2 className="w-24 h-24 text-dl-accent animate-spin" />
        <Sparkles className="absolute top-0 right-0 w-8 h-8 text-dl-primary animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-dl-primary-dark">{message}</h2>
      </div>
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-black text-dl-primary-dark">{title}</h2>
      <p className="text-dl-muted font-bold text-lg">{subtitle}</p>
    </div>
  );
}

function CreateCvContent() {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const [currentStep, setCurrentStep] = useState<number>(WIZARD_STEP_INDEXES.UPLOAD);
  const [parsedData, setParsedData] = useState<ParsedCvData | null>(null);
  const [formData, setFormData] = useState<Partial<WizardFormData>>({});
  const [originalOgData, setOriginalOgData] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    async function loadData() {
      if (isEditMode) {
        setIsLoading(true);
        const existingData = await getResumeAction();
        if (existingData) {
          setFormData(existingData);
          setOriginalOgData(getOgDeps(existingData));
          setCurrentStep(WIZARD_STEP_INDEXES.PERSONAL);
        }
        setIsLoading(false);
      }
    }
    loadData();
  }, [isEditMode]);

  const autosave = useCallback(async (data: Partial<WizardFormData>) => {
    try {
      await saveResumeAction({ ...formData, ...data, isAutosave: true });
    } catch (e) {
      console.warn('Autosave falló:', e);
    }
  }, [formData]);

  const handleDataParsed = (data: ParsedCvData) => {
    setParsedData(data);
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNextStep = (stepData: Partial<WizardFormData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    autosave(updatedData);
    setCurrentStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveOnly = async (stepData: Partial<WizardFormData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    setIsSubmitting(true);
    try {
      await saveResumeAction({ ...updatedData, isAutosave: true });
      alert('Cambios guardados correctamente');
    } catch {
      alert('Error al guardar cambios');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinish = async (finalData: Partial<WizardFormData>) => {
    try {
      setIsSubmitting(true);
      const fullData = { ...formData, ...finalData, parsedFromPdf: !!parsedData, skipRedirect: true };
      await saveResumeAction(fullData);
      window.location.href = '/dashboard?status=success';
      return true;
    } catch (error: unknown) {
      const err = error as { message?: string; digest?: string };
      if (err.message?.includes('NEXT_REDIRECT') || err.digest?.includes('NEXT_REDIRECT')) {
        return true;
      }
      alert(`Error al guardar: ${err.message}`);
      setIsSubmitting(false);
      return false;
    }
  };

  const handleManualStart = () => {
    setCurrentStep(WIZARD_STEP_INDEXES.PERSONAL);
  };

  const handleLaunchWizard = () => {
    setCurrentStep(WIZARD_STEP_INDEXES.PERSONAL);
  };

  if (isLoading || isSubmitting) {
    return (
      <LoadingState
        message={isSubmitting ? 'Estamos publicando tu perfil...' : 'Cargando tus datos...'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-sm border-b border-dl-primary-light/10 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {currentStep > WIZARD_STEP_INDEXES.UPLOAD ? (
              <Button variant="ghost" size="sm" onClick={handleGoBack} className="group h-8 px-2">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="group h-8 px-2">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
            <span className="text-xs font-black text-dl-accent uppercase tracking-wider hidden sm:inline">
              Paso {currentStep} de 3
            </span>
          </div>

          <div className="flex-1 max-w-lg">
            <WizardProgress currentStep={currentStep} />
          </div>

          <div className="w-8" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-20 space-y-12">
        {currentStep === WIZARD_STEP_INDEXES.UPLOAD && (
          <UploadStep
            parsedData={parsedData}
            onDataParsed={handleDataParsed}
            onManualStart={handleManualStart}
            onLaunchWizard={handleLaunchWizard}
          />
        )}

        {currentStep === WIZARD_STEP_INDEXES.PERSONAL && (
          <section className="space-y-8 max-w-5xl mx-auto">
            <StepHeader
              title="Datos Personales & Foto"
              subtitle="Contanos quién sos y cómo te vemos"
            />
            <StepPersonal
              initialData={formData}
              onNext={handleNextStep}
              onSaveOnly={handleSaveOnly}
            />
          </section>
        )}

        {currentStep === WIZARD_STEP_INDEXES.EXPERIENCE && (
          <section className="space-y-8 max-w-5xl mx-auto">
            <StepHeader
              title="Experiencia & Educación"
              subtitle="Tu camino recorrido hasta hoy"
            />
            <StepExperience
              initialData={formData}
              onBack={handleGoBack}
              onNext={handleNextStep}
              onSaveOnly={handleSaveOnly}
            />
          </section>
        )}

        {currentStep === WIZARD_STEP_INDEXES.IDENTITY && (
          <section className="space-y-8 max-w-5xl mx-auto">
            <StepHeader
              title="Identidad Docente"
              subtitle="Lo que te hace único en el aula"
            />
            <StepIdentity
              initialData={formData}
              originalOgData={originalOgData}
              onBack={handleGoBack}
              onFinish={handleFinish}
              onSaveOnly={handleSaveOnly}
            />
          </section>
        )}
      </main>
    </div>
  );
}

interface UploadStepProps {
  parsedData: ParsedCvData | null;
  onDataParsed: (data: ParsedCvData) => void;
  onManualStart: () => void;
  onLaunchWizard: () => void;
}

function UploadStep({
  parsedData,
  onDataParsed,
  onManualStart,
  onLaunchWizard,
}: UploadStepProps) {
  return (
    <>
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-dl-primary-dark tracking-tight leading-tight">
          ¡Hola! Vamos a crear{' '}
          <span className="text-dl-accent">tu perfil profesional docente.</span>
        </h1>
        <p className="text-xl text-dl-muted font-medium max-w-2xl leading-relaxed">
          Nuestra IA puede leer tu CV actual en PDF y completar el formulario
          por vos.
        </p>
      </div>

      {!parsedData ? (
        <div className="space-y-12 py-10">
          <PdfUploader onDataParsed={onDataParsed} />
          <div className="flex flex-col items-center gap-4 pt-10">
            <p className="text-dl-muted font-bold tracking-tight">
              O también podés
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={onManualStart}
              className="font-black px-12"
            >
              Completar manualmente
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-12 py-10 animate-in fade-in duration-700">
          <ParsedDataSummary parsedData={parsedData} />
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="xl"
              onClick={onLaunchWizard}
              className="font-black px-16 shadow-xl"
            >
              Lanzar Wizard <Sparkles className="ml-2 w-6 h-6 animate-pulse" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function ParsedDataSummary({ parsedData }: { parsedData: ParsedCvData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-10 rounded-[2.5rem] bg-dl-accent/5 border-2 border-dl-accent/20 space-y-4">
        <h3 className="text-dl-primary-dark font-black uppercase text-xs tracking-widest flex items-center gap-2">
          <User className="w-4 h-4" /> Personales
        </h3>
        <p className="text-dl-primary-dark font-black tracking-tight text-xl">
          {parsedData.nombre || 'Sin nombre'}
        </p>
      </div>
      <div className="p-10 rounded-[2.5rem] bg-dl-primary-bg border-2 border-dl-primary-light/40 space-y-4 text-center">
        <h3 className="text-dl-primary-dark font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
          <GraduationCap className="w-4 h-4" /> Formación
        </h3>
        <p className="text-dl-primary-dark font-black text-6xl">
          {parsedData.formacion?.length || 0}
        </p>
      </div>
      <div className="p-10 rounded-[2.5rem] bg-dl-primary-bg border-2 border-dl-primary-light/40 space-y-4 text-center">
        <h3 className="text-dl-primary-dark font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
          <Briefcase className="w-4 h-4" /> Trayectoria
        </h3>
        <p className="text-dl-primary-dark font-black text-6xl">
          {parsedData.experiencia?.length || 0}
        </p>
      </div>
    </div>
  );
}

export default function CreateCvPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-dl-accent animate-spin" />
        </div>
      }
    >
      <CreateCvContent />
    </Suspense>
  );
}
