'use client';

import React, { useState } from 'react';
import { PdfUploader } from '@/components/parser/PdfUploader';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Sparkles, User, GraduationCap, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function CreateCvPage() {
  const [parsedData, setParsedData] = useState<any>(null);

  const handleDataParsed = (data: any) => {
    console.log("Datos recibidos de Gemini:", data);
    setParsedData(data);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-16 min-h-screen">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver
          </Button>
        </Link>
        <span className="text-xs font-black text-dl-muted uppercase tracking-[0.2em]">Paso 0 de 3</span>
      </div>

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
            <Button variant="outline" size="lg" className="w-full sm:w-auto font-black px-12">
               Completar manualmente
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-12 py-10 animate-in fade-in duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Datos Personales */}
             <div className="p-8 rounded-3xl bg-dl-accent/5 border-2 border-dl-accent/20 space-y-4 relative overflow-hidden group">
                <Sparkles className="absolute top-4 right-4 w-6 h-6 text-dl-accent opacity-20 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-dl-primary-dark font-black uppercase text-xs tracking-widest flex items-center gap-2">
                   <User className="w-4 h-4" />
                   Personales
                </h3>
                <div className="space-y-1">
                   <p className="text-dl-primary-dark font-black tracking-tight text-xl">{parsedData.nombre || "Sin nombre"}</p>
                   <p className="text-dl-muted font-bold text-sm">{parsedData.email || "Sin email"}</p>
                </div>
             </div>

             {/* Formación */}
             <div className="p-8 rounded-3xl bg-dl-primary-bg border-2 border-dl-primary-light/40 space-y-4">
                <h3 className="text-dl-primary-dark font-black uppercase text-xs tracking-widest flex items-center gap-2">
                   <GraduationCap className="w-4 h-4" />
                   Formación
                </h3>
                <p className="text-dl-primary-dark font-black text-4xl">{parsedData.formacion?.length || 0}</p>
                <p className="text-dl-muted font-bold text-sm leading-tight italic">Títulos e instituciones detectadas.</p>
             </div>

             {/* Experiencia */}
             <div className="p-8 rounded-3xl bg-dl-primary-bg border-2 border-dl-primary-light/40 space-y-4">
                <h3 className="text-dl-primary-dark font-black uppercase text-xs tracking-widest flex items-center gap-2">
                   <Briefcase className="w-4 h-4" />
                   Trayectoria
                </h3>
                <p className="text-dl-primary-dark font-black text-4xl">{parsedData.experiencia?.length || 0}</p>
                <p className="text-dl-muted font-bold text-sm leading-tight italic">Cargos e instituciones identificadas.</p>
             </div>
          </div>

          <div className="flex flex-col items-center gap-4 py-8">
            <Button variant="primary" size="xl" className="w-full sm:w-auto font-black px-16 shadow-xl active:scale-95 group transition-all">
                Lanzar Wizard con mis datos
                <Sparkles className="ml-2 w-6 h-6 animate-pulse" />
            </Button>
            <p className="text-xs text-dl-muted font-bold p-4 text-center">
               Podrás corregir y expandir cada dato en el siguiente paso.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
