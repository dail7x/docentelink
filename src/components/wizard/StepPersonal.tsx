'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { User, Mail, Phone, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { checkSlugAction } from '@/app/actions/check-slug';

const personalSchema = z.object({
  nombre: z.string().min(3, "El nombre es muy corto"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(8, "Teléfono inválido"),
  slug: z.string()
    .min(3, "Mínimo 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  photoUrl: z.string().optional(),
});

interface StepPersonalProps {
  initialData: any;
  onNext: (data: any) => void;
}

export const StepPersonal = ({ initialData, onNext }: StepPersonalProps) => {
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      email: initialData?.email || "",
      telefono: initialData?.telefono || "",
      slug: initialData?.slug || "",
      photoUrl: initialData?.photoUrl || "",
    },
    mode: "onBlur"
  });

  const slugValue = watch("slug");

  // Validación de Slug solo ON BLUR (corregida para disparar siempre)
  const validateSlugOnBlur = async () => {
    if (slugValue && slugValue.length >= 3) {
      setSlugStatus('checking');
      try {
        const { available } = await checkSlugAction(slugValue);
        setSlugStatus(available ? 'available' : 'taken');
      } catch (err) {
        console.error("Error validando slug:", err);
        setSlugStatus('idle');
      }
    } else {
      setSlugStatus('idle');
    }
  };

  const onSubmit = (data: any) => {
    if (slugStatus === 'taken' || slugStatus === 'checking') return;
    onNext(data);
  };

  // Formateadores automáticos (estRICTO: Limpia puntos y números en vivo)
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleanVal = rawVal.replace(/[0-9\.]/g, ""); // Eliminar números y puntos
    const camel = cleanVal.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    setValue("nombre", camel, { shouldValidate: true });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setValue("slug", val, { shouldValidate: true });
    if (slugStatus !== 'idle') setSlugStatus('idle');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const val = e.target.value.replace(/[^0-9+\s-]/g, "");
     setValue("telefono", val, { shouldValidate: true });
  };

  const inputClasses = "w-full bg-white border-2 border-dl-primary-light/20 focus:border-dl-accent rounded-2xl py-4 pl-14 pr-6 text-lg font-bold outline-none transition-all shadow-sm group-focus-within:shadow-md group-focus-within:border-dl-accent";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
      
      {/* Datos Personales con fondo blanco y mejor estética */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-4">Nombre y Apellido</label>
           <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-dl-muted group-focus-within:text-dl-accent transition-colors z-10">
                 <User className="w-5 h-5" />
              </div>
              <input 
                {...register("nombre")} 
                onChange={handleNombreChange}
                className={inputClasses}
                placeholder="Ej: Juan Perez"
              />
           </div>
           {errors.nombre && <p className="text-xs text-red-500 font-bold pl-4 uppercase tracking-tighter mt-1">{errors.nombre.message}</p>}
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-4">Correo Electrónico</label>
           <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-dl-muted group-focus-within:text-dl-accent transition-colors z-10">
                 <Mail className="w-5 h-5" />
              </div>
              <input 
                {...register("email")}
                autoComplete="email"
                className={inputClasses}
                placeholder="tu@email.com"
              />
           </div>
        </div>

        <div className="space-y-2 md:col-span-2">
           <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-4">Teléfono / WhatsApp</label>
           <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-dl-muted group-focus-within:text-dl-accent transition-colors z-10">
                 <Phone className="w-5 h-5" />
              </div>
              <input 
                {...register("telefono")} 
                onChange={handlePhoneChange}
                autoComplete="tel"
                className={inputClasses}
                placeholder="+54 9 11 1234-5678"
              />
           </div>
        </div>
      </div>

      {/* Tu Link Único Abajo */}
      <div className="space-y-3 pt-6 border-t-2 border-dl-primary-light/10">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-dl-muted pl-1">TU LINK ÚNICO (PERFIL)</label>
        <div className={`
          relative flex items-center bg-white border-2 rounded-[2rem] px-8 py-6 transition-all duration-300 shadow-sm
          ${slugStatus === 'available' ? 'border-green-500 shadow-green-50' : 
            slugStatus === 'taken' ? 'border-red-500 shadow-red-50' : 
            'border-dl-primary-light/30 focus-within:border-dl-accent focus-within:shadow-xl focus-within:shadow-dl-accent/5'}
        `}>
          <span className="text-dl-muted font-bold text-xl select-none mr-1 opacity-50">docentelink.ar/cv/</span>
          <input 
            {...register("slug")}
            onChange={handleSlugChange}
            onBlur={validateSlugOnBlur}
            autoComplete="off"
            className="flex-1 bg-transparent text-xl font-black outline-none placeholder:font-normal placeholder:opacity-30" 
            placeholder="nombre-usuario"
          />
          <div className="flex items-center gap-2">
            {slugStatus === 'checking' && <Loader2 className="w-6 h-6 text-dl-accent animate-spin" />}
            {slugStatus === 'available' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
            {slugStatus === 'taken' && <AlertCircle className="w-6 h-6 text-red-500" />}
          </div>
        </div>
        
        <div className="flex justify-between items-center px-6">
           <p className="text-[10px] text-dl-muted font-bold italic">Solo letras minúsculas, números y guiones.</p>
           {slugStatus === 'available' && <span className="text-[10px] text-green-600 font-black uppercase tracking-widest animate-pulse">¡DISPONIBLE!</span>}
           {slugStatus === 'taken' && <span className="text-[10px] text-red-600 font-black uppercase tracking-widest text-right">Este link ya está en uso</span>}
        </div>
      </div>

      <div className="flex justify-end pt-8">
         <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="px-16 font-black shadow-xl group disabled:opacity-50"
            disabled={slugStatus === 'taken' || slugStatus === 'checking'}
         >
            Siguiente: Experiencia
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
         </Button>
      </div>
    </form>
  );
};
