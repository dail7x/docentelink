'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Briefcase, Clock, CheckCircle2, BadgeCheck, X, Search, ChevronDown, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WizardStepProps } from '@/types/wizard';
import { PROVINCIAS, getLocalidades } from '@/data/argentina';
import {
  NIVELES_EDUCATIVOS,
  MATERIAS_SUGERIDAS,
  TURNOS,
  DIAS_SEMANA,
  DISPONIBILIDAD_OPCIONES,
} from '@/data/education';
import { OgPreviewCard } from './OgPreviewCard';

const ToggleSwitch = memo(({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={cn(
      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200',
      checked ? 'bg-dl-accent' : 'bg-dl-primary-light/30'
    )}
  >
    <span
      className={cn(
        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200',
        checked ? 'translate-x-4' : 'translate-x-0'
      )}
    />
  </button>
));

ToggleSwitch.displayName = 'ToggleSwitch';

export const StepIdentity = memo(({ initialData, onFinish, onBack, onSaveOnly }: WizardStepProps) => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      tituloHabilitante: initialData?.tituloHabilitante || '',
      nivelEducativo: initialData?.nivelEducativo || [],
      mostrarNivelesPublico: initialData?.mostrarNivelesPublico ?? true,
      materias: initialData?.materias || [],
      provincia: initialData?.provincia || 'Buenos Aires',
      localidades: initialData?.localidades || [],
      disponibilidad: initialData?.disponibilidad || 'inmediata',
      disponibleDesde: initialData?.disponibleDesde || '',
      turnos: initialData?.turnos || ['manana', 'tarde'],
      diasDisponibles: initialData?.diasDisponibles || ['lun', 'mar', 'mie', 'jue', 'vie'],
    },
  });

  const selectedNiveles = watch('nivelEducativo');
  const mostrarNivelesPublico = watch('mostrarNivelesPublico');
  const selectedMaterias = watch('materias');
  const selectedProvincia = watch('provincia');
  const selectedLocalidads = watch('localidades');
  const disponibilidad = watch('disponibilidad');
  const selectedTurnos = watch('turnos');
  const selectedDias = watch('diasDisponibles');

  const [materiaInput, setMateriaInput] = useState('');
  const [locInput, setLocInput] = useState('');
  const [showMatSug, setShowMatSug] = useState(false);
  const [showLocSug, setShowLocSug] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const matRef = useRef<HTMLDivElement>(null);
  const locRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showPreviewModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPreviewModal]);

  const onSubmit = (data: Record<string, unknown>) => {
    setShowPreviewModal(true);
  };

  const handleConfirmFinish = () => {
    const formData = watch();
    onFinish?.(formData as Partial<Record<string, unknown>> & { [key: string]: unknown });
  };

  const toggleNivel = (id: string) => {
    const current = selectedNiveles || [];
    setValue(
      'nivelEducativo',
      current.includes(id)
        ? current.filter((n: string) => n !== id)
        : [...current, id]
    );
  };

  const toggleTurno = (id: string) => {
    const current = selectedTurnos || [];
    setValue(
      'turnos',
      current.includes(id)
        ? current.filter((t: string) => t !== id)
        : [...current, id]
    );
  };

  const toggleDia = (id: string) => {
    const current = selectedDias || [];
    setValue(
      'diasDisponibles',
      current.includes(id)
        ? current.filter((d: string) => d !== id)
        : [...current, id]
    );
  };

  const addItem = (
    field: 'materias' | 'localidades',
    val: string,
    setInput: (v: string) => void,
    setShow: (b: boolean) => void
  ) => {
    const v = val.trim();
    const current = watch(field) || [];
    if (v && !current.includes(v)) setValue(field, [...current, v]);
    setInput('');
    setShow(false);
  };

  const removeItem = (field: 'materias' | 'localidades', val: string) => {
    const current = watch(field) || [];
    setValue(field, current.filter((item: string) => item !== val));
  };

  const filteredMatSug = MATERIAS_SUGERIDAS.filter(
    (s) =>
      s.toLowerCase().includes(materiaInput.toLowerCase()) &&
      !selectedMaterias.includes(s)
  );
  const localidadesDisponibles = getLocalidades(selectedProvincia as typeof PROVINCIAS[number]);
  const filteredLocSug = localidadesDisponibles.filter(
    (s) =>
      s.toLowerCase().includes(locInput.toLowerCase()) &&
      !selectedLocalidads.includes(s)
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (matRef.current && !matRef.current.contains(e.target as Node)) {
        setShowMatSug(false);
      }
      if (locRef.current && !locRef.current.contains(e.target as Node)) {
        setShowLocSug(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700 pb-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-2">
            Titulo Habilitante
          </label>
          <div className="relative group">
            <BadgeCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-dl-accent" />
            <input
              {...register('tituloHabilitante')}
              className="w-full pl-14 pr-6 py-5 text-lg font-bold bg-white rounded-2xl border-2 border-dl-primary-light/30 focus:border-dl-accent transition-all outline-none shadow-sm"
              placeholder="Ej: Profesor de Educacion Primaria"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-2">
            Disponibilidad
          </label>
          <div className="relative group">
            <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-dl-accent" />
            <select
              {...register('disponibilidad')}
              className="w-full pl-14 pr-12 py-5 text-lg font-bold bg-white rounded-2xl border-2 border-dl-primary-light/30 focus:border-dl-accent transition-all outline-none appearance-none shadow-sm"
            >
              {DISPONIBILIDAD_OPCIONES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-dl-muted pointer-events-none" />
          </div>
          {disponibilidad === 'a_partir_de' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-2 block mb-2">
                Disponible a partir del
              </label>
              <input
                type="date"
                {...register('disponibleDesde')}
                className="w-full px-6 py-4 text-md font-bold bg-white rounded-2xl border-2 border-dl-accent/30 focus:border-dl-accent outline-none shadow-sm"
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-dl-primary-bg/30 border-2 border-dl-primary-light/20 space-y-6">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-dl-muted" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-dl-muted">
            Turnos y Dias Disponibles{' '}
            <span className="text-dl-accent/60 italic font-bold normal-case ml-1">
              (privado, no visible en perfil)
            </span>
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-1">
              Turnos
            </label>
            <div className="flex gap-3">
              {TURNOS.map(({ id, label }) => {
                const Icon = id === 'manana' ? Sun : Moon;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleTurno(id)}
                    className={cn(
                      'flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border-2',
                      selectedTurnos.includes(id)
                        ? 'bg-dl-primary text-white border-dl-primary shadow-md'
                        : 'bg-white text-dl-primary-dark border-dl-primary-light/30 hover:border-dl-accent/30'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-1">
              Dias
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {DIAS_SEMANA.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleDia(id)}
                  className={cn(
                    'px-3 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2',
                    selectedDias.includes(id)
                      ? 'bg-dl-accent text-white border-dl-accent shadow-sm'
                      : 'bg-white text-dl-muted border-dl-primary-light/20 hover:border-dl-accent/30'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-dl-primary-dark flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-dl-accent" />
            Niveles en los que ejerces
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            {mostrarNivelesPublico ? (
              <Eye className="w-3.5 h-3.5 text-dl-accent" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-dl-muted" />
            )}
            <span className="text-[9px] font-black uppercase tracking-widest text-dl-muted">
              Mostrar en perfil
            </span>
            <ToggleSwitch
              checked={mostrarNivelesPublico}
              onChange={() => setValue('mostrarNivelesPublico', !mostrarNivelesPublico)}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          {NIVELES_EDUCATIVOS.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => toggleNivel(n.id)}
              className={cn(
                'px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border-2',
                selectedNiveles.includes(n.id)
                  ? 'bg-dl-primary text-white border-dl-primary shadow-md scale-105'
                  : 'bg-white text-dl-primary-dark border-dl-primary-light/30 hover:border-dl-accent/40'
              )}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6" ref={matRef}>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-dl-primary-dark flex items-center gap-3">
            <Search className="w-5 h-5 text-dl-accent" /> Materias / Especialidades
          </h3>
          <p className="text-[10px] font-bold text-dl-muted uppercase tracking-widest pl-8">
            Dictado de materias o campos especificos.
          </p>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={materiaInput}
              onChange={(e) => {
                setMateriaInput(e.target.value);
                setShowMatSug(true);
              }}
              onFocus={() => setShowMatSug(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem('materias', materiaInput, setMateriaInput, setShowMatSug);
                }
              }}
              className="w-full px-6 py-4 text-md font-bold bg-white rounded-2xl border-2 border-dl-primary-light/30 focus:border-dl-accent outline-none shadow-sm"
              placeholder="Escribi una materia (Ej: Formacion Laboral...)"
            />
            {showMatSug && materiaInput.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-dl-primary-light/20 shadow-xl max-h-60 overflow-y-auto">
                {filteredMatSug.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addItem('materias', s, setMateriaInput, setShowMatSug)}
                    className="w-full text-left px-6 py-3 hover:bg-dl-primary-bg font-bold text-sm text-dl-primary-dark border-b last:border-0 border-dl-primary-light/10"
                  >
                    {s}
                  </button>
                ))}
                {filteredMatSug.length === 0 && (
                  <button
                    type="button"
                    onClick={() => addItem('materias', materiaInput, setMateriaInput, setShowMatSug)}
                    className="w-full text-left px-6 py-3 hover:bg-dl-accent/10 font-black text-xs text-dl-accent italic"
                  >
                    Anadir &ldquo;{materiaInput}&rdquo; como materia personalizada
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedMaterias.map((m: string) => (
              <div
                key={m}
                className="flex items-center gap-2 bg-dl-accent/10 text-dl-accent border-2 border-dl-accent/20 px-4 py-2 rounded-xl animate-in zoom-in-95"
              >
                <span className="text-xs font-black uppercase">{m}</span>
                <button
                  type="button"
                  onClick={() => removeItem('materias', m)}
                  className="hover:bg-dl-accent/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-10 rounded-[3rem] bg-dl-primary-bg/40 border-2 border-dl-primary-light/30 space-y-10 shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-1">
              Provincia
            </label>
            <select
              {...register('provincia')}
              className="w-full bg-white px-6 py-4 rounded-2xl border-2 border-dl-primary-light/20 focus:border-dl-accent outline-none font-bold shadow-sm"
            >
              {PROVINCIAS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4" ref={locRef}>
            <label className="text-[10px] font-black uppercase tracking-widest text-dl-muted pl-1">
              Zonas / Barrios Deseables
            </label>
            <div className="relative">
              <input
                type="text"
                value={locInput}
                onChange={(e) => {
                  setLocInput(e.target.value);
                  setShowLocSug(true);
                }}
                onFocus={() => setShowLocSug(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('localidades', locInput, setLocInput, setShowLocSug);
                  }
                }}
                className="w-full bg-white px-6 py-4 rounded-2xl border-2 border-dl-primary-light/20 focus:border-dl-accent outline-none font-bold shadow-sm"
                placeholder="Agrega barrios o zonas (Ej: Boedo, Caballito...)"
              />
              {showLocSug && locInput.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-dl-primary-light/20 shadow-xl max-h-60 overflow-y-auto">
                  {filteredLocSug.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addItem('localidades', s, setLocInput, setShowLocSug)}
                      className="w-full text-left px-6 py-3 hover:bg-dl-primary-bg font-bold text-sm text-dl-primary-dark"
                    >
                      {s}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => addItem('localidades', locInput, setLocInput, setShowLocSug)}
                    className="w-full text-left px-6 py-3 hover:bg-dl-accent/10 font-bold text-xs text-dl-accent italic border-t border-dl-primary-light/10"
                  >
                    Anadir &ldquo;{locInput}&rdquo; manualmente
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedLocalidads.map((l: string) => (
                <div
                  key={l}
                  className="flex items-center gap-2 bg-white text-dl-primary-dark border-2 border-dl-primary-light/30 px-4 py-2 rounded-xl"
                >
                  <MapPin className="w-3 h-3 text-dl-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{l}</span>
                  <button
                    type="button"
                    onClick={() => removeItem('localidades', l)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-12 flex-wrap gap-4">
        <button
          type="button"
          onClick={onBack}
          className="font-black text-dl-muted px-6 py-3 hover:bg-dl-primary-light rounded-lg transition-colors"
        >
          Atras
        </button>
        <div className="flex gap-4 ml-auto">
          {onSaveOnly && (
            <button
              type="button"
              onClick={() => handleSubmit(onSaveOnly as (data: Record<string, unknown>) => void)()}
              className="font-black px-6 py-3 border-2 border-dl-primary text-dl-primary rounded-lg hover:bg-dl-primary-light transition-colors"
            >
              Guardar cambios
            </button>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-10 py-3 font-black bg-dl-accent text-white rounded-xl shadow-xl hover:bg-dl-accent-dark transition-colors"
          >
            Finalizar Perfil! <CheckCircle2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </form>

    {showPreviewModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
          <div className="p-6 border-b flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-xl font-black text-dl-primary-dark">
                Así se verá tu perfil
              </h2>
              <p className="text-sm text-dl-muted">
                Vista previa de WhatsApp
              </p>
            </div>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-6 flex items-start justify-center bg-gray-50">
            <div className="transform scale-50 sm:scale-65 md:scale-75 lg:scale-85 origin-top">
              <OgPreviewCard
                name={`${initialData?.nombre || ''} ${initialData?.apellido || ''}`.trim() || 'Nombre del Docente'}
                title={watch('tituloHabilitante') || 'Título Profesional'}
                province={watch('provincia') || watch('localidades')?.[0] || ''}
                image={initialData?.photoUrl}
                isVerified={false}
                especialidadDestacada={selectedMaterias?.[0] || undefined}
                especialidadesPills={selectedMaterias || []}
                aliasPerfil={initialData?.slug || undefined}
              />
            </div>
          </div>

          <div className="p-4 border-t flex items-center justify-between gap-4 shrink-0 bg-white">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="px-4 py-2 text-sm font-bold text-dl-muted hover:text-dl-primary-dark transition-colors"
            >
              ← Editar
            </button>
            <button
              onClick={handleConfirmFinish}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-dl-accent text-white rounded-lg shadow-lg hover:bg-dl-accent-dark transition-colors"
            >
              Confirmar y Publicar <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
});

StepIdentity.displayName = 'StepIdentity';
