'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { PhotoEditor } from './PhotoEditor';
import { User, Mail, Phone, Hash, AtSign } from 'lucide-react';

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
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      email: initialData?.email || "",
      telefono: initialData?.telefono || "",
      slug: initialData?.nombre?.toLowerCase().replace(/\s+/g, '-') || "",
    },
  });

  const slug = watch('slug');

  const onSubmit = (data: FormValues) => {
    onNext({ ...data, photoFile: initialData?.photoFile });
    console.log("Personal Data Submitting:", data);
  };

  const handlePhotoProcessed = (file: File) => {
    // Guardamos el archivo procesado en el estado local del componente padre más adelante
    initialData.photoFile = file;
    console.log("Foto de perfil procesada lista para subir.", file);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        
        {/* Lado Izquierdo: La Foto Editorial */}
        <div className="w-full md:w-auto flex-shrink-0">
          <PhotoEditor 
            onPhotoProcessed={handlePhotoProcessed} 
            initialImageUrl={initialData?.imagen}
          />
        </div>

        {/* Lado Derecho: Los Campos */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Campo Nombre */}
              <div className="space-y-3">
                 <label className="text-xs font-black text-dl-primary-dark uppercase tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre Completo
                 </label>
                 <div className="relative group">
                    <input 
                      {...register('nombre')}
                      className="w-full p-6 text-xl font-bold bg-white rounded-3xl border-2 border-dl-primary-light/30 focus:border-dl-accent focus:ring-0 transition-all outline-none"
                      placeholder="Ej: Marcelo García"
                    />
                    {errors.nombre && <p className="text-red-500 text-xs font-bold pt-1">{errors.nombre.message}</p>}
                 </div>
              </div>

              {/* Campo Email */}
              <div className="space-y-3">
                 <label className="text-xs font-black text-dl-primary-dark uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Correo de Contacto
                 </label>
                 <div className="relative group">
                    <input 
                      {...register('email')}
                      className="w-full p-6 text-xl font-bold bg-white rounded-3xl border-2 border-dl-primary-light/30 focus:border-dl-accent focus:ring-0 transition-all outline-none"
                      placeholder="correo@ejemplo.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs font-bold pt-1">{errors.email.message}</p>}
                 </div>
              </div>

              {/* Campo Teléfono */}
              <div className="space-y-3">
                 <label className="text-xs font-black text-dl-primary-dark uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    WhatsApp / Teléfono
                 </label>
                 <div className="relative group">
                    <input 
                      {...register('telefono')}
                      className="w-full p-6 text-xl font-bold bg-white rounded-3xl border-2 border-dl-primary-light/30 focus:border-dl-accent focus:ring-0 transition-all outline-none"
                      placeholder="+54 11 ..."
                    />
                 </div>
              </div>

              {/* Campo Link Único (Slug) */}
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-black text-dl-primary-dark uppercase tracking-widest flex items-center gap-2">
                       <AtSign className="w-4 h-4" />
                       Tu Link Único (Slug)
                    </label>
                    <p className="text-[10px] text-dl-muted font-bold uppercase tracking-widest pb-1 opacity-60">
                       docentelink.ar/cv/<span className="text-dl-accent underline">{slug || "tu-nombre"}</span>
                    </p>
                 </div>
                 <div className="relative group">
                    <input 
                      {...register('slug')}
                      className="w-full p-6 text-xl font-medium bg-dl-accent-light/30 rounded-3xl border-2 border-dl-accent/20 focus:border-dl-accent focus:ring-0 transition-all outline-none"
                      placeholder="tu-identificador"
                    />
                    {errors.slug && <p className="text-red-500 text-xs font-bold pt-1">{errors.slug.message}</p>}
                 </div>
              </div>
           </div>

           <div className="flex justify-end pt-12">
              <Button type="submit" variant="primary" size="lg" className="px-16 font-black shadow-xl">
                 Siguiente: Experiencia & Formación
              </Button>
           </div>
        </form>
      </div>
    </div>
  );
};
