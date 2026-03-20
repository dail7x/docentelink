'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { User, Mail, Phone, CheckCircle2, AlertCircle, Loader2, ArrowRight, Globe } from 'lucide-react';
import { checkSlugAction } from '@/app/actions/check-slug';
import { PhotoEditor } from './PhotoEditor';
import { uploadFiles } from '@/lib/uploadthing';

const personalSchema = z.object({
  nombre: z.string().min(2, "El nombre es muy corto"),
  apellido: z.string().min(2, "El apellido es muy corto"),
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
  const [isUploading, setIsUploading] = useState(false);

  const generateSuggestedSlug = (nombre: string, apellido: string) => {
    const clean = (str: string) => str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "") || "";
    const n = clean(nombre);
    const a = clean(apellido);
    const randomSuffix = Math.random().toString(36).substring(2, 5);
    return `${n}-${a}-${randomSuffix}`.replace(/-+$/, "");
  };

  const splitName = (fullName: string) => {
    if (!fullName) return { nombre: "", apellido: "" };
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return { nombre: parts[0], apellido: "" };
    const apellido = parts.pop() || "";
    const nombre = parts.join(" ");
    return { nombre, apellido };
  };

  const nameData = splitName(initialData?.nombre);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      nombre: initialData?.name || nameData.nombre,
      apellido: initialData?.surname || nameData.apellido,
      email: initialData?.email || "",
      telefono: initialData?.telefono || "",
      slug: initialData?.slug || "",
      photoUrl: initialData?.photoUrl || "",
    },
    mode: "onBlur"
  });

  const slugValue = watch("slug");
  const currentNombre = watch("nombre");
  const currentApellido = watch("apellido");
  const photoUrl = watch("photoUrl");

  const validateSlug = useCallback(async (val: string) => {
    if (val && val.length >= 3) {
      setSlugStatus('checking');
      try {
        const { available } = await checkSlugAction(val);
        setSlugStatus(available ? 'available' : 'taken');
      } catch (err) {
        console.error("Error validando slug:", err);
        setSlugStatus('idle');
      }
    }
  }, []);

  useEffect(() => {
    if (!initialData?.slug && currentNombre && currentApellido) {
      const suggested = generateSuggestedSlug(currentNombre, currentApellido);
      setValue("slug", suggested, { shouldValidate: true });
      validateSlug(suggested);
    } else if (initialData?.slug) {
      validateSlug(initialData.slug);
    }
  }, []); 

  const onSubmit = (data: any) => {
    if (slugStatus === 'taken' || slugStatus === 'checking') return;
    onNext({
      ...data,
      nombre: `${data.nombre} ${data.apellido}`.trim()
    });
  };

  const handlePhotoProcessed = async (file: File) => {
    setIsUploading(true);
    try {
      const res = await uploadFiles("imageUploader", { files: [file] });
      if (res?.[0]?.url) {
        setValue("photoUrl", res[0].url, { shouldValidate: true });
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatText = (val: string) => {
    const clean = val.replace(/[0-9\.]/g, "");
    return clean.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("nombre", formatText(e.target.value), { shouldValidate: true });
  };

  const handleApellidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("apellido", formatText(e.target.value), { shouldValidate: true });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "-").replace(/[^a-z0-9-]/g, "");
    setValue("slug", val, { shouldValidate: true });
    if (slugStatus !== 'idle') setSlugStatus('idle');
  };

  const inputClasses = "w-full bg-white border-2 border-dl-primary-light/20 focus:border-dl-accent rounded-2xl py-3 pl-12 pr-4 text-md font-bold outline-none transition-all shadow-sm focus:shadow-md focus:border-dl-accent";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Foto */}
        <div className="w-full lg:w-fit flex flex-col items-center shrink-0">
          <PhotoEditor 
            onPhotoProcessed={handlePhotoProcessed}
            initialImageUrl={photoUrl}
          />
          {isUploading && (
            <div className="mt-2 flex items-center gap-2 text-dl-accent animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest">Subiendo...</span>
            </div>
          )}
        </div>

        {/* Datos */}
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-2">Nombre</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dl-muted group-focus-within:text-dl-accent transition-colors" />
              <input {...register("nombre")} onChange={handleNombreChange} className={inputClasses} placeholder="Nombre" />
            </div>
            {errors.nombre && <p className="text-[10px] text-red-500 font-bold pl-2">{errors.nombre.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-2">Apellido</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dl-muted group-focus-within:text-dl-accent transition-colors" />
              <input {...register("apellido")} onChange={handleApellidoChange} className={inputClasses} placeholder="Apellido" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-2">Correo Electrónico</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dl-muted group-focus-within:text-dl-accent transition-colors" />
              <input {...register("email")} className={inputClasses} placeholder="Email" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-2">Teléfono / WhatsApp</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dl-muted group-focus-within:text-dl-accent transition-colors" />
              <input {...register("telefono")} className={inputClasses} placeholder="Teléfono" />
            </div>
          </div>
        </div>
      </div>

      {/* Slug centrado y resaltado */}
      <div className="pt-4 border-t-2 border-dl-primary-light/5 flex flex-col items-center">
        <div className="w-full max-w-xl space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-2 block text-center sm:text-left">TU LINK ÚNICO (PERFIL)</label>
          
          {/* Link Preview (Visible en Mobile) */}
          <div className="sm:hidden flex items-center gap-2 px-2 pb-1 text-[10px] text-dl-muted font-bold truncate">
            <Globe className="w-3 h-3 text-dl-accent shrink-0" />
            <span>docentelink.ar/cv/{slugValue || "..."}</span>
          </div>

          <div className={`
            relative flex items-center bg-white border-2 rounded-2xl px-6 py-3 transition-all duration-300
            ${slugStatus === 'available' ? 'border-green-500 bg-green-50/20 shadow-lg shadow-green-500/5' : 
              slugStatus === 'taken' ? 'border-red-500 bg-red-50/20 shadow-lg shadow-red-500/5' : 
              'border-dl-primary-light/30 focus-within:border-dl-accent focus-within:shadow-xl'}
          `}>
            <span className="text-dl-muted font-bold text-xs hidden sm:inline select-none opacity-50 mr-1">docentelink.ar/cv/</span>
            <input 
              {...register("slug")}
              onChange={handleSlugChange}
              onBlur={(e) => validateSlug(e.target.value)}
              className="flex-1 bg-transparent text-md font-bold outline-none placeholder:font-normal" 
              placeholder="usuario"
            />
            <div className="flex items-center gap-2">
              {slugStatus === 'checking' && <Loader2 className="w-5 h-5 text-dl-accent animate-spin" />}
              {slugStatus === 'available' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {slugStatus === 'taken' && <AlertCircle className="w-5 h-5 text-red-500" />}
            </div>
          </div>
          <div className="flex justify-between px-2 mt-1">
             <p className="text-[9px] text-dl-muted font-bold italic uppercase tracking-tighter">Minúsculas, números y guiones.</p>
             {slugStatus === 'available' && <span className="text-[9px] text-green-600 font-black uppercase tracking-widest animate-pulse">¡DISPONIBLE!</span>}
             {slugStatus === 'taken' && <span className="text-[9px] text-red-600 font-black uppercase tracking-widest">Ya está ocupado</span>}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
         <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="px-12 font-black shadow-lg disabled:opacity-50"
            disabled={slugStatus === 'taken' || slugStatus === 'checking' || isUploading}
         >
            Siguiente
            <ArrowRight className="ml-2 w-4 h-4" />
         </Button>
      </div>
    </form>
  );
};
