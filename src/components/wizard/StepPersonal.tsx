'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { PhotoEditor } from './PhotoEditor';
import { User, Mail, Phone, AtSign, CheckCircle2, ArrowRight } from 'lucide-react';

const formSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  telefono: z.string().optional(),
  slug: z.string().min(3, "El link debe tener al menos 3 caracteres").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
});

type FormValues = z.infer<typeof formSchema>;

interface StepPersonalProps {
  initialData: any;
  onNext: (data: any) => void;
}

export const StepPersonal = ({ initialData, onNext }: StepPersonalProps) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      email: initialData?.email || "",
      telefono: initialData?.telefono || "",
      slug: initialData?.slug || initialData?.nombre?.toLowerCase().replace(/\s+/g, '-') || "",
    },
  });

  const slug = watch('slug');

  const onSubmit = (data: FormValues) => {
    // Si hay una foto ya guardada en la BD, la pasamos si no se cambió
    onNext({ ...data, photoUrl: initialData?.imagen });
    console.log("Personal Data Submitting:", data);
  };

  const handlePhotoProcessed = (file: File) => {
    initialData.photoFile = file; // Para el proceso de subida en el Finish
    console.log("Foto procesada, lista para el paso final", file);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        
        {/* Lado Izquierdo: La Foto */}
        <div className="w-full md:w-auto flex-shrink-0">
          <PhotoEditor 
            onPhotoProcessed={handlePhotoProcessed} 
            initialImageUrl={initialData?.imagen}
          />
        </div>

        {/* Lado Derecho: Campos */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full space-y-6">
           <div className="space-y-6">
              {/* Nombre */}
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-dl-primary-dark uppercase tracking-[0.2em] opacity-70">
                    Nombre Completo
                 </label>
                 <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-dl-primary/40" />
                    <input 
                      {...register('nombre')}
                      className="w-full p-4 pl-14 text-base font-bold bg-white rounded-2xl border-2 border-dl-primary-light/20 focus:border-dl-accent focus:ring-0 transition-all outline-none"
                      placeholder="Nombre Completo"
                    />
                    {errors.nombre && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.nombre.message}</p>}
                 </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-dl-primary-dark uppercase tracking-[0.2em] opacity-70">
                    Correo de Contacto
                 </label>
                 <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-dl-primary/40" />
                    <input 
                      {...register('email')}
                      className="w-full p-4 pl-14 text-base font-bold bg-white rounded-2xl border-2 border-dl-primary-light/20 focus:border-dl-accent focus:ring-0 transition-all outline-none"
                      placeholder="Correo de Contacto"
                    />
                    {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.email.message}</p>}
                 </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-dl-primary-dark uppercase tracking-[0.2em] opacity-70">
                    WhatsApp / Teléfono
                 </label>
                 <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-dl-primary/40" />
                    <input 
                      {...register('telefono')}
                      className="w-full p-4 pl-14 text-base font-bold bg-white rounded-2xl border-2 border-dl-primary-light/20 focus:border-dl-accent focus:ring-0 transition-all outline-none"
                      placeholder="WhatsApp / Teléfono"
                    />
                 </div>
              </div>
           </div>

           {/* Fila del Slug - Integrado */}
           <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                 <label className="text-[10px] font-black text-dl-primary-dark uppercase tracking-[0.2em] opacity-70">
                    Tu Link Único (Slug)
                 </label>
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold border border-green-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Disponible
                 </div>
              </div>

              <div className="relative flex items-center p-1 bg-white/50 backdrop-blur-sm border-2 border-dl-primary-light/20 rounded-[1.5rem] group focus-within:border-dl-accent/40 focus-within:ring-4 focus-within:ring-dl-accent/5 transition-all outline-none">
                 <div className="px-6 py-4 bg-dl-primary-bg/80 rounded-[1.2rem] border-r border-dl-primary-light/10 text-dl-primary-dark/60 font-medium text-lg shrink-0">
                    docentelink.ar/cv/
                 </div>
                 <input 
                    {...register('slug')}
                    className="flex-1 px-4 py-4 text-xl font-bold bg-transparent text-dl-primary-dark placeholder:text-dl-primary/20 outline-none focus:ring-0"
                    placeholder="username"
                 />
              </div>
              {errors.slug && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.slug.message}</p>}
              <p className="text-[10px] text-dl-muted font-bold uppercase tracking-widest pl-2 opacity-50">
                 Crea tu enlace personalizado para compartir en redes y CVs.
              </p>
           </div>

           <div className="flex justify-end pt-8">
              <Button type="submit" variant="primary" size="lg" className="px-16 font-black shadow-xl group">
                 Siguiente: Experiencia & Formación
                 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
           </div>
        </form>
      </div>
    </div>
  );
};
