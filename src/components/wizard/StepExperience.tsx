'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Briefcase, GraduationCap, Plus, Trash2, Calendar, ArrowRight, Check, Sparkles, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepExperienceProps {
  initialData: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export const StepExperience = ({ initialData, onNext, onBack }: StepExperienceProps) => {
  const { register, control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      resumen: initialData?.resumen || "",
      experiencia: initialData?.experiencia || [],
      formacion: initialData?.formacion || [],
      cursos: initialData?.cursos || [],
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

  const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({
    control,
    name: "cursos",
  });

  const resumenValue = watch("resumen");
  const MAX_RESUMEN = 400;

  const onSubmit = (data: any) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700 pb-20">
      
      {/* Sección Resumen Profesional (IA) */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-dl-primary-dark tracking-tight flex items-center gap-3">
             <Quote className="w-6 h-6 text-dl-accent" />
             Resumen Profesional
          </h3>
          <p className="text-xs text-dl-muted font-bold uppercase tracking-widest pl-9">
            Una breve presentación sobre quién sos y tu pasión docente.
          </p>
        </div>

        <div className="relative p-8 rounded-[2.5rem] bg-dl-accent/5 border-2 border-dl-accent/20 group focus-within:border-dl-accent/40 transition-all shadow-sm">
           <div className="absolute top-6 right-8 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-dl-accent animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-dl-accent">Generado por IA docente</span>
           </div>
           
           <textarea 
             {...register("resumen")}
             className="w-full bg-transparent text-lg font-medium text-dl-primary-dark outline-none min-h-[120px] resize-none leading-relaxed placeholder:text-dl-muted/40"
             placeholder="Contanos un poco de tu trayectoria..."
             maxLength={MAX_RESUMEN}
           />
           
           <div className="flex justify-between items-center mt-4 pt-4 border-t border-dl-accent/10">
              <p className="text-[9px] text-dl-accent/60 font-black uppercase tracking-widest italic">
                 {resumenValue?.length < 50 ? "¡Un buen resumen te ayuda a destacar!" : "¡Se ve profesional!"}
              </p>
              <div className="flex items-center gap-2">
                 <span className={cn(
                   "text-[10px] font-black tracking-widest uppercase",
                   resumenValue?.length > MAX_RESUMEN * 0.9 ? "text-orange-500" : "text-dl-muted"
                 )}>
                   {resumenValue?.length || 0} / {MAX_RESUMEN}
                 </span>
              </div>
           </div>
        </div>
      </div>

      {/* Sección Trayectoria */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="text-2xl font-black text-dl-primary-dark tracking-tight flex items-center gap-3">
                 <Briefcase className="w-6 h-6 text-dl-accent" />
                 Trayectoria Docente
              </h3>
              <p className="text-xs text-dl-muted font-bold uppercase tracking-widest pl-9">Experiencia laboral en instituciones</p>
           </div>
           <Button type="button" variant="outline" size="sm" onClick={() => appendExp({ institucion: "", cargo: "", desde: "", hasta: "", descripcion: "" })}>
              <Plus className="w-4 h-4 mr-1" /> Añadir cargo
           </Button>
        </div>

        <div className="space-y-6">
           {expFields.map((field, index) => {
             const hastaValue = watch(`experiencia.${index}.hasta`);
             const isActual = hastaValue === "actual" || !hastaValue || hastaValue === "";

             const toggleActual = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (isActual) {
                  setValue(`experiencia.${index}.hasta`, "temporal-val");
                  setTimeout(() => setValue(`experiencia.${index}.hasta`, "unset"), 0); 
                } else {
                  setValue(`experiencia.${index}.hasta`, "actual");
                }
             };

             const realIsActual = hastaValue === "actual" || !hastaValue || hastaValue === "";

             return (
               <div key={field.id} className="p-8 rounded-[2rem] bg-white border-2 border-dl-primary-light/30 shadow-sm relative group hover:border-dl-accent/30 transition-all">
                  <button type="button" onClick={() => removeExp(index)} className="absolute top-6 right-6 p-2 text-dl-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted">Institución / Colegio / Empresa</label>
                          <input {...register(`experiencia.${index}.institucion`)} className="w-full bg-transparent text-xl font-bold outline-none border-b-2 border-dl-primary-light/20 focus:border-dl-accent transition-colors pb-2" placeholder="Ej: Escuela Normal N° 1" />
                     </div>
                     <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted">Cargo / Materia dictada</label>
                          <input {...register(`experiencia.${index}.cargo`)} className="w-full bg-transparent text-xl font-bold outline-none border-b-2 border-dl-primary-light/20 focus:border-dl-accent transition-colors pb-2" placeholder="Ej: Profesor de Geografía" />
                     </div>
                     
                     <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-start bg-dl-primary-bg/10 p-6 rounded-2xl border-2 border-transparent transition-all">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted italic flex items-center gap-2">
                             Desde <Calendar className="w-3.5 h-3.5 opacity-40" />
                          </label>
                          <input 
                             type="month"
                             {...register(`experiencia.${index}.desde`)} 
                             className="w-full bg-white px-4 py-2.5 rounded-lg border-2 border-dl-primary-light/10 focus:border-dl-accent outline-none font-bold text-dl-primary-dark transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1">
                             <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted italic flex items-center gap-2">
                                Hasta <Calendar className="w-3.5 h-3.5 opacity-40" />
                             </label>
                             <button 
                               type="button" 
                               onClick={toggleActual}
                               className="flex items-center gap-2 group cursor-pointer"
                             >
                                <div className={cn(
                                   "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                                   realIsActual ? "bg-dl-accent border-dl-accent" : "border-dl-muted/30 bg-white"
                                )}>
                                   {realIsActual && <Check className="w-3 h-3 text-white stroke-[4]" />}
                                </div>
                                <span className={cn("text-[9px] font-black uppercase tracking-widest", realIsActual ? "text-dl-accent" : "text-dl-muted")}>
                                   Trabajo Actual
                                </span>
                             </button>
                          </div>

                          <div className="relative">
                             <input 
                                type={realIsActual ? "text" : "month"}
                                {...register(`experiencia.${index}.hasta`)} 
                                value={realIsActual ? "Actualmente trabajando aquí" : (hastaValue || "")}
                                onChange={(e) => {
                                   if (!realIsActual) setValue(`experiencia.${index}.hasta`, e.target.value);
                                }}
                                className={cn(
                                   "w-full px-4 py-2.5 rounded-lg border-2 outline-none font-bold transition-all",
                                   realIsActual 
                                     ? "bg-dl-accent/5 border-dl-accent/20 text-dl-accent/70 italic text-sm cursor-default" 
                                     : "bg-white border-dl-primary-light/10 focus:border-dl-accent text-dl-primary-dark"
                                )}
                                readOnly={realIsActual}
                             />
                          </div>
                        </div>
                     </div>

                     <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted">Descripción de tareas</label>
                        <textarea {...register(`experiencia.${index}.descripcion`)} className="w-full bg-dl-primary-bg/50 p-4 rounded-xl text-sm font-medium outline-none border-2 border-transparent focus:border-dl-accent/20 min-h-[80px]" placeholder="Breve detalle de lo que hacías..." />
                     </div>
                  </div>
               </div>
             );
           })}
        </div>
      </div>

      {/* Sección Formación Académica */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="text-2xl font-black text-dl-primary-dark tracking-tight flex items-center gap-3">
                 <GraduationCap className="w-6 h-6 text-dl-accent" />
                 Formación Académica Formal
              </h3>
              <p className="text-xs text-dl-muted font-bold uppercase tracking-widest pl-9">Títulos de grado, técnicos o profesorados</p>
           </div>
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted">Institución / Universidad</label>
                      <input {...register(`formacion.${index}.institucion`)} className="w-full bg-transparent text-xl font-bold outline-none border-b-2 border-dl-primary-light/20 focus:border-dl-accent transition-colors pb-2" placeholder="Ej: UBA" />
                   </div>
                   <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted italic">Año de Egreso</label>
                      <input 
                         type="number"
                         min="1950"
                         max="2030"
                         {...register(`formacion.${index}.anio`)} 
                         className="w-40 block bg-white px-4 py-2.5 rounded-lg border-2 border-dl-primary-light/10 focus:border-dl-accent outline-none font-bold text-dl-primary-dark transition-all" 
                         placeholder="Ej: 2015" 
                      />
                      <p className="text-[9px] text-dl-muted font-bold mt-2 opacity-60 italic pl-1">Deja vacío si tus estudios aún NO terminaron.</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Sección Cursos */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="text-2xl font-black text-dl-primary-dark tracking-tight flex items-center gap-3">
                 <Plus className="w-6 h-6 text-dl-accent" />
                 Capacitaciones & Cursos
              </h3>
              <p className="text-xs text-dl-muted font-bold uppercase tracking-widest pl-9">Formación complementaria y talleres</p>
           </div>
           <Button type="button" variant="outline" size="sm" onClick={() => appendCourse({ nombre: "", institucion: "" })}>
              <Plus className="w-4 h-4 mr-1" /> Añadir curso
           </Button>
        </div>

        <div className="space-y-4">
           {courseFields.map((field, index) => (
             <div key={field.id} className="p-8 rounded-[2rem] bg-white border-2 border-dl-primary-light/10 shadow-sm relative group">
                <button type="button" onClick={() => removeCourse(index)} className="absolute top-6 right-6 p-2 text-dl-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Trash2 className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted">Nombre del Curso / Taller</label>
                      <input {...register(`cursos.${index}.nombre`)} className="w-full bg-transparent font-bold outline-none border-b-2 border-dl-primary-light/20 focus:border-dl-accent transition-colors pb-2" placeholder="Ej: Introducción a la Robótica" />
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted">Institución / Dictado por</label>
                       <input {...register(`cursos.${index}.institucion`)} className="w-full bg-transparent font-black outline-none border-b-2 border-dl-primary-light/20 focus:border-dl-accent transition-colors pb-2 text-dl-muted/70" placeholder="Ej: Coursera / Google" />
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
         <Button type="submit" variant="primary" size="lg" className="px-16 font-black shadow-xl group">
            Siguiente: Identidad Docente
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
         </Button>
      </div>
    </form>
  );
};
