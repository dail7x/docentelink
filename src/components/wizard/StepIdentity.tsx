'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { MapPin, Briefcase, Clock, CheckCircle2, BadgeCheck, X, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIdentityProps {
  initialData: any;
  onFinish: (data: any) => void;
  onBack: () => void;
}

const MATERIAS_SUGERIDAS = [
  "Matemática", "Lengua y Literatura", "Inglés", "Biología", "Química", "Física",
  "Geografía", "Historia", "Educación Física", "Artes Visuales", "Música",
  "Informática", "Construcción de Ciudadanía", "Filosofía", "Psicología", 
  "Economía", "Teatro", "Danza", "Robótica", "TIC", "Ciencias Naturales", 
  "Ciencias Sociales", "Catequesis", "Portugués", "Italiano", "Francés"
].sort();

export const StepIdentity = ({ initialData, onFinish, onBack }: StepIdentityProps) => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      tituloHabilitante: initialData?.tituloHabilitante || "",
      nivelEducativo: initialData?.nivelEducativo || [],
      materias: initialData?.materias || [],
      provincia: initialData?.provincia || "Buenos Aires",
      localidad: initialData?.localidad || "",
      disponibilidad: initialData?.disponibilidad || "inmediata",
    },
  });

  const selectedNiveles = watch('nivelEducativo');
  const selectedMaterias = watch('materias');
  const [materiaInput, setMateriaInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const niveles = [
    { id: 'inicial', label: 'Inicial' },
    { id: 'primaria', label: 'Primaria' },
    { id: 'secundaria', label: 'Secundaria' },
    { id: 'especial', label: 'Especial' },
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

  const addMateria = (materia: string) => {
    const m = materia.trim();
    if (m && !selectedMaterias.includes(m)) {
      setValue('materias', [...selectedMaterias, m]);
    }
    setMateriaInput("");
    setShowSuggestions(false);
  };

  const removeMateria = (m: string) => {
    setValue('materias', selectedMaterias.filter((item: string) => item !== m));
  };

  const filteredSuggestions = MATERIAS_SUGERIDAS.filter(
    s => s.toLowerCase().includes(materiaInput.toLowerCase()) && !selectedMaterias.includes(s)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700 pb-10">
      
      {/* Título y Disponibilidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-2">Título Habilitante</label>
           <div className="relative group">
              <BadgeCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-dl-accent group-focus-within:scale-110 transition-transform" />
              <input 
                {...register('tituloHabilitante')}
                className="w-full pl-14 pr-6 py-5 text-lg font-bold bg-white rounded-2xl border-2 border-dl-primary-light/30 focus:border-dl-accent transition-all outline-none shadow-sm"
                placeholder="Ej: Profesor de Educación Primaria"
              />
           </div>
        </div>

        <div className="space-y-4">
           <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-2">Disponibilidad</label>
           <div className="relative group">
              <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-dl-accent" />
              <select 
                {...register('disponibilidad')}
                className="w-full pl-14 pr-12 py-5 text-lg font-bold bg-white rounded-2xl border-2 border-dl-primary-light/30 focus:border-dl-accent transition-all outline-none appearance-none shadow-sm"
              >
                 <option value="inmediata">Inmediata</option>
                 <option value="a_partir_de">A partir de fecha...</option>
                 <option value="no_disponible">Ocupado / No disponible</option>
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-dl-muted pointer-events-none" />
           </div>
        </div>
      </div>

      {/* Niveles con Educación Especial */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-dl-primary-dark flex items-center gap-3">
           <Briefcase className="w-5 h-5 text-dl-accent" />
           Niveles en los que ejerces
        </h3>
        <div className="flex flex-wrap gap-3">
           {niveles.map((n) => (
             <button
               key={n.id}
               type="button"
               onClick={() => toggleNivel(n.id)}
               className={cn(
                 "px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border-2",
                 selectedNiveles.includes(n.id) 
                   ? "bg-dl-primary text-white border-dl-primary shadow-md scale-105" 
                   : "bg-white text-dl-primary-dark border-dl-primary-light/30 hover:border-dl-accent/40"
               )}
             >
               {n.label}
             </button>
           ))}
        </div>
      </div>

      {/* Materias con Autocompletado y Pills */}
      <div className="space-y-6" ref={suggestionRef}>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-dl-primary-dark flex items-center gap-3">
             <Search className="w-5 h-5 text-dl-accent" />
             Materias / Especialidades
          </h3>
          <p className="text-[10px] font-bold text-dl-muted uppercase tracking-widest pl-8">¿Qué materias dictás o en qué te especializás?</p>
        </div>

        <div className="space-y-4">
          <div className="relative group">
             <input 
               type="text"
               value={materiaInput}
               onChange={(e) => {
                 setMateriaInput(e.target.value);
                 setShowSuggestions(true);
               }}
               onFocus={() => setShowSuggestions(true)}
               onKeyDown={(e) => {
                 if (e.key === 'Enter') {
                   e.preventDefault();
                   addMateria(materiaInput);
                 }
               }}
               className="w-full px-6 py-4 text-md font-bold bg-white rounded-2xl border-2 border-dl-primary-light/30 focus:border-dl-accent outline-none shadow-sm transition-all"
               placeholder="Escribí una materia (Ej: Inglés, Robótica...)"
             />
             
             {showSuggestions && materiaInput.length > 0 && (
               <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-dl-primary-light/20 shadow-xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                 {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addMateria(s)}
                        className="w-full text-left px-6 py-3 hover:bg-dl-primary-bg font-bold text-sm text-dl-primary-dark transition-colors border-b last:border-0 border-dl-primary-light/10"
                      >
                        {s}
                      </button>
                    ))
                 ) : (
                    <button
                      type="button"
                      onClick={() => addMateria(materiaInput)}
                      className="w-full text-left px-6 py-3 hover:bg-dl-accent/10 font-black text-xs text-dl-accent transition-colors"
                    >
                      Añadir "{materiaInput}" como materia personalizada
                    </button>
                 )}
               </div>
             )}
          </div>

          {/* Pills de materias */}
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {selectedMaterias.map((m: string) => (
              <div 
                key={m}
                className="flex items-center gap-2 bg-dl-accent/10 text-dl-accent border-2 border-dl-accent/20 px-4 py-2 rounded-xl animate-in zoom-in-95 duration-200"
              >
                <span className="text-xs font-black uppercase tracking-tight">{m}</span>
                <button 
                  type="button" 
                  onClick={() => removeMateria(m)}
                  className="hover:bg-dl-accent/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zona de Trabajo */}
      <div className="p-10 rounded-[3rem] bg-dl-primary-bg/40 border-2 border-dl-primary-light/30 space-y-8 shadow-inner">
         <h3 className="text-xl font-black text-dl-primary-dark flex items-center gap-3">
            <MapPin className="w-5 h-5 text-dl-accent" />
            Zona de Trabajo
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-1">Provincia</label>
               <select 
                 {...register('provincia')}
                 className="w-full bg-white px-6 py-4 rounded-2xl border-2 border-dl-primary-light/20 focus:border-dl-accent outline-none font-bold shadow-sm"
               >
                 <option value="CABA">CABA</option>
                 <option value="Buenos Aires">Buenos Aires</option>
                 <option value="Catamarca">Catamarca</option>
                 <option value="Chaco">Chaco</option>
                 <option value="Chubut">Chubut</option>
                 <option value="Córdoba">Córdoba</option>
                 <option value="Corrientes">Corrientes</option>
                 <option value="Entre Ríos">Entre Ríos</option>
                 <option value="Formosa">Formosa</option>
                 <option value="Jujuy">Jujuy</option>
                 <option value="La Pampa">La Pampa</option>
                 <option value="La Rioja">La Rioja</option>
                 <option value="Mendoza">Mendoza</option>
                 <option value="Misiones">Misiones</option>
                 <option value="Neuquén">Neuquén</option>
                 <option value="Río Negro">Río Negro</option>
                 <option value="Salta">Salta</option>
                 <option value="San Juan">San Juan</option>
                 <option value="San Luis">San Luis</option>
                 <option value="Santa Cruz">Santa Cruz</option>
                 <option value="Santa Fe">Santa Fe</option>
                 <option value="Santiago del Estero">Santiago del Estero</option>
                 <option value="Tierra del Fuego">Tierra del Fuego</option>
                 <option value="Tucumán">Tucumán</option>
               </select>
            </div>
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-1">Localidad / Barrio</label>
               <input 
                 {...register('localidad')} 
                 className="w-full bg-white px-6 py-4 rounded-2xl border-2 border-dl-primary-light/20 focus:border-dl-accent outline-none font-bold shadow-sm" 
                 placeholder="Ej: San Isidro, Almagro..." 
               />
            </div>
         </div>
      </div>

      <div className="flex items-center justify-between pt-12">
         <Button type="button" variant="ghost" size="lg" onClick={onBack} className="font-black text-dl-muted hover:text-dl-primary">
            Atrás
         </Button>
         <Button type="submit" variant="accent" size="xl" className="px-20 font-black shadow-xl group">
            ¡Finalizar Perfil!
            <CheckCircle2 className="ml-2 w-6 h-6 group-hover:scale-110 transition-transform" />
         </Button>
      </div>
    </form>
  );
};
