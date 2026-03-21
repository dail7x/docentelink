'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { MapPin, Briefcase, Clock, CheckCircle2, BadgeCheck, X, Search, ChevronDown, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIdentityProps {
  initialData: any;
  onFinish: (data: any) => void;
  onBack: () => void;
  onSaveOnly?: (data: any) => void;
}

const MATERIAS_SUGERIDAS = [
  "Matemática", "Lengua y Literatura", "Inglés", "Biología", "Química", "Física",
  "Geografía", "Historia", "Educación Física", "Artes Visuales", "Música",
  "Informática", "Construcción de Ciudadanía", "Filosofía", "Psicología", 
  "Economía", "Teatro", "Danza", "Robótica", "TIC", "Ciencias Naturales", 
  "Ciencias Sociales", "Catequesis", "Portugués", "Italiano", "Francés",
  "Formación Laboral"
].sort();

const LOCALIDADES_POR_PROVINCIA: Record<string, string[]> = {
  "CABA": ["Almagro", "Balvanera", "Belgrano", "Boedo", "Caballito", "Chacarita", "Coghlan", "Colegiales", "Constitución", "Flores", "Floresta", "La Boca", "La Paternal", "Liniers", "Mataderos", "Monte Castro", "Monserrat", "Nueva Pompeya", "Nuñez", "Palermo", "Parque Avellaneda", "Parque Chacabuco", "Parque Chas", "Parque Patricios", "Puerto Madero", "Recoleta", "Retiro", "Saavedra", "San Cristóbal", "San Nicolás", "San Telmo", "Vélez Sársfield", "Versalles", "Villa Crespo", "Villa del Parque", "Villa Devoto", "Villa General Mitre", "Villa Lugano", "Villa Luro", "Villa Ortúzar", "Villa Pueyrredón", "Villa Real", "Villa Riachuelo", "Villa Santa Rita", "Villa Soldati", "Villa Urquiza"],
  "Buenos Aires": ["San Isidro", "Vicente López", "Olivos", "Tigre", "Pilar", "Avellaneda", "Lanús", "Lomas de Zamora", "Quilmes", "La Plata", "Ramos Mejía", "Morón", "San Miguel", "Ituzaingó", "Castelar", "Bahía Blanca", "Mar del Plata", "Tandil", "Escobar", "Moreno", "Merlo", "José C. Paz", "Malvinas Argentinas"],
  "Catamarca": ["San Fernando del Valle", "Valle Viejo", "Fray Mamerto Esquiú", "Belén", "Andalgalá", "Santa María", "Tinogasta"],
  "Córdoba": ["Córdoba Capital", "Villa Carlos Paz", "Alta Gracia", "Río Cuarto", "Villa María", "Jesús María", "San Francisco", "Bell Ville", "La Falda"],
  "Santa Fe": ["Rosario", "Santa Fe Capital", "Rafaela", "Venado Tuerto", "Santo Tomé", "Reconquista", "Villa Constitución", "Esperanza"],
  "Mendoza": ["Mendoza Capital", "Godoy Cruz", "Guaymallén", "Maipú", "Luján de Cuyo", "San Rafael", "Tunuyán", "San Martín"],
  "Tucumán": ["San Miguel de Tucumán", "Yerba Buena", "Tafí Viejo", "Concepción", "Aguilares", "Famaillá", "Lules"],
  "Salta": ["Salta Capital", "San Ramón de la Nueva Orán", "Tartagal", "General Güemes", "Rosario de la Frontera", "Metán"],
  "Chaco": ["Resistencia", "Presidencia Roque Sáenz Peña", "Villa Ángela", "Barranqueras", "Fontana"],
  "Entre Ríos": ["Paraná", "Concordia", "Gualeguaychú", "Concepción del Uruguay", "Villaguay", "Chajarí"],
  "Jujuy": ["San Salvador de Jujuy", "San Pedro", "Palpalá", "Libertador General San Martín", "Perico"],
  "Corrientes": ["Corrientes Capital", "Goya", "Paso de los Libres", "Curuzú Cuatiá", "Mercedes"],
  "Misiones": ["Posadas", "Eldorado", "Oberá", "Puerto Iguazú", "Apóstoles"],
  "San Juan": ["San Juan Capital", "Rawson", "Rivadavia", "Chimbas", "Santa Lucía"],
  "San Luis": ["San Luis Capital", "Villa Mercedes", "Merlo"],
  "Neuquén": ["Neuquén Capital", "Cutral Có", "Centenario", "Plottier", "Zapala"],
  "Río Negro": ["Viedma", "Bariloche", "General Roca", "Cipolletti"],
  "Chubut": ["Rawson", "Trelew", "Comodoro Rivadavia", "Puerto Madryn", "Esquel"],
  "Santa Cruz": ["Río Gallegos", "Caleta Olivia", "El Calafate"],
  "Tierra del Fuego": ["Ushuaia", "Río Grande", "Tolhuin"],
  "La Pampa": ["Santa Rosa", "General Pico"],
  "La Rioja": ["La Rioja Capital", "Chilecito"],
  "Formosa": ["Formosa Capital", "Clorinda"],
  "Santiago del Estero": ["Santiago del Estero Capital", "La Banda", "Termas de Río Hondo"],
};

const PROVINCIAS = [
  "CABA", "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"
];

const DIAS_SEMANA = [
  { id: 'lun', label: 'Lun' },
  { id: 'mar', label: 'Mar' },
  { id: 'mie', label: 'Mié' },
  { id: 'jue', label: 'Jue' },
  { id: 'vie', label: 'Vie' },
  { id: 'sab', label: 'Sáb' },
  { id: 'dom', label: 'Dom' },
];

const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={cn(
      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200",
      checked ? "bg-dl-accent" : "bg-dl-primary-light/30"
    )}
  >
    <span className={cn(
      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200",
      checked ? "translate-x-4" : "translate-x-0"
    )} />
  </button>
);

export const StepIdentity = ({ initialData, onFinish, onBack, onSaveOnly }: StepIdentityProps) => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      tituloHabilitante: initialData?.tituloHabilitante || "",
      nivelEducativo: initialData?.nivelEducativo || [],
      mostrarNivelesPublico: initialData?.mostrarNivelesPublico ?? true,
      materias: initialData?.materias || [],
      provincia: initialData?.provincia || "Buenos Aires",
      localidades: initialData?.localidades || (initialData?.localidad ? [initialData.localidad] : []),
      disponibilidad: initialData?.disponibilidad || "inmediata",
      disponibleDesde: initialData?.disponibleDesde || "",
      turnos: initialData?.turnos || ["manana", "tarde"],
      diasDisponibles: initialData?.diasDisponibles || ["lun", "mar", "mie", "jue", "vie"],
    },
  });

  const selectedNiveles = watch('nivelEducativo');
  const mostrarNivelesPublico = watch('mostrarNivelesPublico');
  const selectedMaterias = watch('materias');
  const selectedProvincia = watch('provincia');
  const selectedLocalidades = watch('localidades');
  const disponibilidad = watch('disponibilidad');
  const selectedTurnos = watch('turnos');
  const selectedDias = watch('diasDisponibles');

  const [materiaInput, setMateriaInput] = useState("");
  const [locInput, setLocInput] = useState("");
  const [showMatSug, setShowMatSug] = useState(false);
  const [showLocSug, setShowLocSug] = useState(false);

  const matRef = useRef<HTMLDivElement>(null);
  const locRef = useRef<HTMLDivElement>(null);

  const niveles = [
    { id: 'inicial', label: 'Inicial' },
    { id: 'primaria', label: 'Primaria' },
    { id: 'secundaria', label: 'Secundaria' },
    { id: 'especial', label: 'Especial' },
    { id: 'laboral', label: 'Formación Laboral' },
    { id: 'terciaria', label: 'Terciaria' },
    { id: 'adultos', label: 'Adultos' },
  ];

  const onSubmit = (data: any) => { onFinish(data); };

  const toggleNivel = (id: string) => {
    const c = selectedNiveles || [];
    setValue('nivelEducativo', c.includes(id) ? c.filter((n: string) => n !== id) : [...c, id]);
  };

  const toggleTurno = (id: string) => {
    const c = selectedTurnos || [];
    setValue('turnos', c.includes(id) ? c.filter((t: string) => t !== id) : [...c, id]);
  };

  const toggleDia = (id: string) => {
    const c = selectedDias || [];
    setValue('diasDisponibles', c.includes(id) ? c.filter((d: string) => d !== id) : [...c, id]);
  };

  const addItem = (field: 'materias' | 'localidades', val: string, setInput: (v: string) => void, setShow: (b: boolean) => void) => {
    const v = val.trim();
    const current = watch(field) || [];
    if (v && !current.includes(v)) setValue(field, [...current, v]);
    setInput(""); setShow(false);
  };

  const removeItem = (field: 'materias' | 'localidades', val: string) => {
    const current = watch(field) || [];
    setValue(field, current.filter((item: string) => item !== val));
  };

  const filteredMatSug = MATERIAS_SUGERIDAS.filter(s => s.toLowerCase().includes(materiaInput.toLowerCase()) && !selectedMaterias.includes(s));
  const filteredLocSug = (LOCALIDADES_POR_PROVINCIA[selectedProvincia] || []).filter(s => s.toLowerCase().includes(locInput.toLowerCase()) && !selectedLocalidades.includes(s));

  useEffect(() => {
    const opt = (e: MouseEvent) => {
      if (matRef.current && !matRef.current.contains(e.target as Node)) setShowMatSug(false);
      if (locRef.current && !locRef.current.contains(e.target as Node)) setShowLocSug(false);
    };
    document.addEventListener("mousedown", opt);
    return () => document.removeEventListener("mousedown", opt);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700 pb-10">
      
      {/* Título y Disponibilidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-2">Título Habilitante</label>
          <div className="relative group">
            <BadgeCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-dl-accent" />
            <input {...register('tituloHabilitante')} className="w-full pl-14 pr-6 py-5 text-lg font-bold bg-white rounded-2xl border-2 border-dl-primary-light/30 focus:border-dl-accent transition-all outline-none shadow-sm" placeholder="Ej: Profesor de Educación Primaria" />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-2">Disponibilidad</label>
          <div className="relative group">
            <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-dl-accent" />
            <select {...register('disponibilidad')} className="w-full pl-14 pr-12 py-5 text-lg font-bold bg-white rounded-2xl border-2 border-dl-primary-light/30 focus:border-dl-accent transition-all outline-none appearance-none shadow-sm">
              <option value="inmediata">Inmediata</option>
              <option value="a_partir_de">A partir de fecha...</option>
              <option value="no_disponible">Ocupado / No disponible</option>
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-dl-muted pointer-events-none" />
          </div>
          {/* Campo de fecha condicional */}
          {disponibilidad === 'a_partir_de' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-2 block mb-2">Disponible a partir del</label>
              <input
                type="date"
                {...register('disponibleDesde')}
                className="w-full px-6 py-4 text-md font-bold bg-white rounded-2xl border-2 border-dl-accent/30 focus:border-dl-accent outline-none shadow-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Turnos y Días (datos privados) */}
      <div className="p-8 rounded-[2.5rem] bg-dl-primary-bg/30 border-2 border-dl-primary-light/20 space-y-6">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-dl-muted" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-dl-muted">Turnos y Días Disponibles <span className="text-dl-accent/60 italic font-bold normal-case ml-1">(privado, no visible en perfil)</span></h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Turnos */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-1">Turnos</label>
            <div className="flex gap-3">
              {[{ id: 'manana', label: 'Mañana', Icon: Sun }, { id: 'tarde', label: 'Tarde', Icon: Moon }].map(({ id, label, Icon }) => (
                <button key={id} type="button" onClick={() => toggleTurno(id)}
                  className={cn("flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border-2",
                    selectedTurnos.includes(id) ? "bg-dl-primary text-white border-dl-primary shadow-md" : "bg-white text-dl-primary-dark border-dl-primary-light/30 hover:border-dl-accent/30"
                  )}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Días */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-1">Días</label>
            <div className="flex gap-1.5 flex-wrap">
              {DIAS_SEMANA.map(({ id, label }) => (
                <button key={id} type="button" onClick={() => toggleDia(id)}
                  className={cn("px-3 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2",
                    selectedDias.includes(id) ? "bg-dl-accent text-white border-dl-accent shadow-sm" : "bg-white text-dl-muted border-dl-primary-light/20 hover:border-dl-accent/30"
                  )}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Niveles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-dl-primary-dark flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-dl-accent" />
            Niveles en los que ejerces
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            {mostrarNivelesPublico ? <Eye className="w-3.5 h-3.5 text-dl-accent" /> : <EyeOff className="w-3.5 h-3.5 text-dl-muted" />}
            <span className="text-[9px] font-black uppercase tracking-widest text-dl-muted">Mostrar en perfil</span>
            <ToggleSwitch checked={mostrarNivelesPublico} onChange={() => setValue('mostrarNivelesPublico', !mostrarNivelesPublico)} />
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          {niveles.map((n) => (
            <button key={n.id} type="button" onClick={() => toggleNivel(n.id)} className={cn("px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border-2", selectedNiveles.includes(n.id) ? "bg-dl-primary text-white border-dl-primary shadow-md scale-105" : "bg-white text-dl-primary-dark border-dl-primary-light/30 hover:border-dl-accent/40")}>
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Materias (Pills) */}
      <div className="space-y-6" ref={matRef}>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-dl-primary-dark flex items-center gap-3"><Search className="w-5 h-5 text-dl-accent" /> Materias / Especialidades</h3>
          <p className="text-[10px] font-bold text-dl-muted uppercase tracking-widest pl-8">Dictado de materias o campos específicos.</p>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input type="text" value={materiaInput} onChange={(e) => { setMateriaInput(e.target.value); setShowMatSug(true); }} onFocus={() => setShowMatSug(true)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('materias', materiaInput, setMateriaInput, setShowMatSug); }}} className="w-full px-6 py-4 text-md font-bold bg-white rounded-2xl border-2 border-dl-primary-light/30 focus:border-dl-accent outline-none shadow-sm" placeholder="Escribí una materia (Ej: Formación Laboral...)" />
            {showMatSug && materiaInput.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-dl-primary-light/20 shadow-xl max-h-60 overflow-y-auto">
                {filteredMatSug.map(s => <button key={s} type="button" onClick={() => addItem('materias', s, setMateriaInput, setShowMatSug)} className="w-full text-left px-6 py-3 hover:bg-dl-primary-bg font-bold text-sm text-dl-primary-dark border-b last:border-0 border-dl-primary-light/10">{s}</button>)}
                {filteredMatSug.length === 0 && <button type="button" onClick={() => addItem('materias', materiaInput, setMateriaInput, setShowMatSug)} className="w-full text-left px-6 py-3 hover:bg-dl-accent/10 font-black text-xs text-dl-accent italic">Añadir "{materiaInput}" como materia personalizada</button>}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedMaterias.map((m: string) => (
              <div key={m} className="flex items-center gap-2 bg-dl-accent/10 text-dl-accent border-2 border-dl-accent/20 px-4 py-2 rounded-xl animate-in zoom-in-95">
                <span className="text-xs font-black uppercase">{m}</span>
                <button type="button" onClick={() => removeItem('materias', m)} className="hover:bg-dl-accent/20 rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zona de Trabajo + Localidades Pills */}
      <div className="p-10 rounded-[3rem] bg-dl-primary-bg/40 border-2 border-dl-primary-light/30 space-y-10 shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-1">Provincia</label>
            <select {...register('provincia')} className="w-full bg-white px-6 py-4 rounded-2xl border-2 border-dl-primary-light/20 focus:border-dl-accent outline-none font-bold shadow-sm">
              {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          
          <div className="space-y-4" ref={locRef}>
            <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-1">Zonas / Barrios Deseables</label>
            <div className="relative">
              <input type="text" value={locInput} onChange={(e) => { setLocInput(e.target.value); setShowLocSug(true); }} onFocus={() => setShowLocSug(true)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('localidades', locInput, setLocInput, setShowLocSug); }}} className="w-full bg-white px-6 py-4 rounded-2xl border-2 border-dl-primary-light/20 focus:border-dl-accent outline-none font-bold shadow-sm" placeholder="Agregá barrios o zonas (Ej: Boedo, Caballito...)" />
              {showLocSug && locInput.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-dl-primary-light/20 shadow-xl max-h-60 overflow-y-auto">
                  {filteredLocSug.map(s => <button key={s} type="button" onClick={() => addItem('localidades', s, setLocInput, setShowLocSug)} className="w-full text-left px-6 py-3 hover:bg-dl-primary-bg font-bold text-sm text-dl-primary-dark">{s}</button>)}
                  <button type="button" onClick={() => addItem('localidades', locInput, setLocInput, setShowLocSug)} className="w-full text-left px-6 py-3 hover:bg-dl-accent/10 font-bold text-xs text-dl-accent italic border-t border-dl-primary-light/10">Añadir "{locInput}" manualmente</button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedLocalidades.map((l: string) => (
                <div key={l} className="flex items-center gap-2 bg-white text-dl-primary-dark border-2 border-dl-primary-light/30 px-4 py-2 rounded-xl">
                  <MapPin className="w-3 h-3 text-dl-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{l}</span>
                  <button type="button" onClick={() => removeItem('localidades', l)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-12 flex-wrap gap-4">
        <Button type="button" variant="ghost" size="lg" onClick={onBack} className="font-black text-dl-muted">Atrás</Button>
        <div className="flex gap-4 ml-auto">
          {onSaveOnly && (
             <Button type="button" variant="outline" size="lg" className="font-black" onClick={() => handleSubmit(onSaveOnly)()}>
                Guardar cambios
             </Button>
          )}
          <Button type="submit" variant="accent" size="lg" className="px-10 font-black shadow-xl group">¡Finalizar Perfil! <CheckCircle2 className="ml-2 w-6 h-6 group-hover:scale-110 transition-transform" /></Button>
        </div>
      </div>
    </form>
  );
};
