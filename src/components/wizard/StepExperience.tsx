'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Briefcase, GraduationCap, Plus, Trash2, Calendar } from 'lucide-react';

interface StepExperienceProps {
  initialData: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export const StepExperience = ({ initialData, onNext, onBack }: StepExperienceProps) => {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      experiencia: initialData?.experiencia || [],
      formacion: initialData?.formacion || [],
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: "experiencia",
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: "formacion",
  });

  const onSubmit = (data: any) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* Sección Trayectoria */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl font-black text-dl-primary-dark tracking-tight flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-dl-accent" />
              Trayectoria Docente
           </h3>
           <Button type="button" variant="outline" size="sm" onClick={() => appendExp({ institucion: "", cargo: "", desde: "", hasta: "" })}>
              <Plus className="w-4 h-4 mr-1" /> Añadir cargo
           </Button>
        </div>

        <div className="space-y-4">
           {expFields.map((field, index) => (
             <div key={field.id} className="p-8 rounded-[2rem] bg-white border-2 border-dl-primary-light/30 shadow-sm relative group hover:border-dl-accent/30 transition-all">
                <button type="button" onClick={() => removeExp(index)} className="absolute top-6 right-6 p-2 text-dl-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Trash2 className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted">Institución</label>
                      <input {...register(`experiencia.${index}.institucion`)} className="w-full bg-transparent text-xl font-bold outline-none border-b-2 border-dl-primary-light/20 focus:border-dl-accent transition-colors pb-2" placeholder="Ej: Escuela Normal N° 1" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted">Cargo / Materia</label>
                      <input {...register(`experiencia.${index}.cargo`)} className="w-full bg-transparent text-xl font-bold outline-none border-b-2 border-dl-primary-light/20 focus:border-dl-accent transition-colors pb-2" placeholder="Ej: Profesor de Geografía" />
                   </div>
                   <div className="md:col-span-2 flex items-center gap-4 text-dl-muted">
                      <Calendar className="w-4 h-4" />
                      <input {...register(`experiencia.${index}.desde`)} className="bg-transparent font-medium outline-none border-b border-dl-primary-light/20" placeholder="Desde" />
                      <span>—</span>
                      <input {...register(`experiencia.${index}.hasta`)} className="bg-transparent font-medium outline-none border-b border-dl-primary-light/20" placeholder="Hasta (o 'Actual')" />
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Sección Formación */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl font-black text-dl-primary-dark tracking-tight flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-dl-accent" />
              Formación Académica
           </h3>
           <Button type="button" variant="outline" size="sm" onClick={() => appendEdu({ titulo: "", institucion: "", anio: "" })}>
              <Plus className="w-4 h-4 mr-1" /> Añadir título
           </Button>
        </div>

        <div className="space-y-4">
           {eduFields.map((field, index) => (
             <div key={field.id} className="p-8 rounded-[2rem] bg-dl-primary-bg/30 border-2 border-dl-primary-light/20 shadow-sm relative group">
                <button type="button" onClick={() => removeEdu(index)} className="absolute top-6 right-6 p-2 text-dl-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Trash2 className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted">Título Obtenido</label>
                      <input {...register(`formacion.${index}.titulo`)} className="w-full bg-transparent text-xl font-bold outline-none border-b-2 border-dl-primary-light/20 focus:border-dl-accent transition-colors pb-2" placeholder="Ej: Lic. en Ciencias de la Educación" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted">Institución</label>
                      <input {...register(`formacion.${index}.institucion`)} className="w-full bg-transparent text-xl font-bold outline-none border-b-2 border-dl-primary-light/20 focus:border-dl-accent transition-colors pb-2" placeholder="Ej: UBA" />
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-12 border-t-2 border-dl-primary-light/20">
         <Button type="button" variant="ghost" size="lg" onClick={onBack} className="font-black text-dl-muted">
            Atrás
         </Button>
         <Button type="submit" variant="primary" size="lg" className="px-16 font-black shadow-xl">
            Siguiente: Identidad Docente
         </Button>
      </div>
    </form>
  );
};
