'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { MapPin, Briefcase, Clock, CheckCircle2, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIdentityProps {
  initialData: any;
  onFinish: (data: any) => void;
  onBack: () => void;
}

export const StepIdentity = ({ initialData, onFinish, onBack }: StepIdentityProps) => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      tituloHabilitante: initialData?.tituloHabilitante || "",
      nivelEducativo: initialData?.nivelEducativo || [],
      provincia: initialData?.provincia || "Buenos Aires",
      localidad: initialData?.localidad || "",
      disponibilidad: initialData?.disponibilidad || "inmediata",
    },
  });

  const selectedNiveles = watch('nivelEducativo');
  const niveles = [
    { id: 'inicial', label: 'Inicial' },
    { id: 'primaria', label: 'Primaria' },
    { id: 'secundaria', label: 'Secundaria' },
    { id: 'terciaria', label: 'Terciaria' },
    { id: 'universitaria', label: 'Universitaria' },
    { id: 'adultos', label: 'Adultos' },
  ];

  const onSubmit = (data: any) => {
    onFinish(data);
  };

  const toggleNivel = (id: string) => {
    const current = selectedNiveles || [];
    if (current.includes(id)) {
      setValue('nivelEducativo', current.filter((n: string) => n !== id));
    } else {
      setValue('nivelEducativo', [...current, id]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* Título y Niveles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
           <h3 className="text-xl font-bold text-dl-primary-dark flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-dl-accent" />
              Título Habilitante
           </h3>
           <input 
             {...register('tituloHabilitante')}
             className="w-full p-6 text-xl font-bold bg-white rounded-3xl border-2 border-dl-primary-light/30 focus:border-dl-accent transition-all outline-none"
             placeholder="Ej: Profesor de Educación Primaria"
           />
        </div>

        <div className="space-y-6">
           <h3 className="text-xl font-bold text-dl-primary-dark flex items-center gap-2">
              <Clock className="w-5 h-5 text-dl-accent" />
              Disponibilidad
           </h3>
           <select 
             {...register('disponibilidad')}
             className="w-full p-6 text-xl font-bold bg-white rounded-3xl border-2 border-dl-primary-light/30 focus:border-dl-accent transition-all outline-none appearance-none"
           >
              <option value="inmediata">Inmediata</option>
              <option value="a_partir_de">A partir de fecha...</option>
              <option value="no_disponible">No disponible por el momento</option>
           </select>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-xl font-bold text-dl-primary-dark flex items-center gap-2">
           <Briefcase className="w-5 h-5 text-dl-accent" />
           Niveles en los que ejerces
        </h3>
        <div className="flex flex-wrap gap-4">
           {niveles.map((n) => (
             <button
               key={n.id}
               type="button"
               onClick={() => toggleNivel(n.id)}
               className={cn(
                 "px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-300 border-2",
                 selectedNiveles.includes(n.id) 
                   ? "bg-dl-primary text-white border-dl-primary shadow-lg shadow-dl-primary/20 scale-105" 
                   : "bg-white text-dl-primary-dark border-dl-primary-light/30 hover:border-dl-accent/40"
               )}
             >
               {n.label}
             </button>
           ))}
        </div>
      </div>

      {/* Ubicación */}
      <div className="p-10 rounded-[2.5rem] bg-dl-primary-bg border-2 border-dl-primary-light/30 space-y-8">
         <h3 className="text-xl font-bold text-dl-primary-dark flex items-center gap-2">
            <MapPin className="w-5 h-5 text-dl-accent" />
            Zona de Trabajo
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted">Provincia</label>
               <input {...register('provincia')} className="w-full bg-transparent text-xl font-bold outline-none border-b-2 border-dl-primary-light/20 focus:border-dl-accent transition-colors pb-2" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted">Localidad / Barrio</label>
               <input {...register('localidad')} className="w-full bg-transparent text-xl font-bold outline-none border-b-2 border-dl-primary-light/20 focus:border-dl-accent transition-colors pb-2" placeholder="Ej: San Isidro, CABA..." />
            </div>
         </div>
      </div>

      <div className="flex items-center justify-between pt-12">
         <Button type="button" variant="ghost" size="lg" onClick={onBack} className="font-black text-dl-muted">
            Atrás
         </Button>
         <Button type="submit" variant="accent" size="xl" className="px-20 font-black shadow-xl animate-bounce-subtle">
            ¡Finalizar y Publicar Perfil!
            <CheckCircle2 className="ml-2 w-6 h-6" />
         </Button>
      </div>
    </form>
  );
};
