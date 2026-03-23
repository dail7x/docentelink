export const NIVELES_EDUCATIVOS = [
  { id: 'inicial', label: 'Inicial' },
  { id: 'primaria', label: 'Primaria' },
  { id: 'secundaria', label: 'Secundaria' },
  { id: 'especial', label: 'Especial' },
  { id: 'laboral', label: 'Formación Laboral' },
  { id: 'terciaria', label: 'Terciaria' },
  { id: 'adultos', label: 'Adultos' },
] as const;

export type NivelEducativoId = (typeof NIVELES_EDUCATIVOS)[number]['id'];

export const MATERIAS_SUGERIDAS = [
  'Artes Visuales',
  'Biología',
  'Catequesis',
  'Ciencias Naturales',
  'Ciencias Sociales',
  'Construcción de Ciudadanía',
  'Danza',
  'Economía',
  'Educación Física',
  'Filosofía',
  'Formación Laboral',
  'Francés',
  'Física',
  'Geografía',
  'Historia',
  'Informática',
  'Inglés',
  'Italiano',
  'Lengua y Literatura',
  'Matemática',
  'Música',
  'Portugués',
  'Psicología',
  'Química',
  'Robótica',
  'Teatro',
  'TIC',
] as const;

export type Materia = (typeof MATERIAS_SUGERIDAS)[number];

export const TURNOS = [
  { id: 'manana', label: 'Mañana', icon: 'Sun' },
  { id: 'tarde', label: 'Tarde', icon: 'Moon' },
] as const;

export type TurnoId = (typeof TURNOS)[number]['id'];

export const DIAS_SEMANA = [
  { id: 'lun', label: 'Lun' },
  { id: 'mar', label: 'Mar' },
  { id: 'mie', label: 'Mié' },
  { id: 'jue', label: 'Jue' },
  { id: 'vie', label: 'Vie' },
  { id: 'sab', label: 'Sáb' },
  { id: 'dom', label: 'Dom' },
] as const;

export type DiaSemanaId = (typeof DIAS_SEMANA)[number]['id'];

export const HABILIDADES_SUGERIDAS = [
  'Microsoft Office',
  'Google Workspace',
  'Excel Avanzado',
  'PowerPoint',
  'Canva',
  'Adobe Photoshop',
  'Premiere Pro',
  'Audacity',
  'Inglés',
  'Portugués',
  'Italiano',
  'Francés',
  'Trabajo en equipo',
  'Comunicación asertiva',
  'Resolución de conflictos',
  'Gestión del tiempo',
  'Liderazgo',
  'Empatía',
  'Adaptabilidad',
  'Moodle',
  'Google Classroom',
  'Zoom',
  'Teams',
  'TIC aplicadas a la educación',
] as const;

export type Habilidad = (typeof HABILIDADES_SUGERIDAS)[number];

export const DISPONIBILIDAD_OPCIONES = [
  { value: 'inmediata', label: 'Inmediata' },
  { value: 'a_partir_de', label: 'A partir de fecha...' },
  { value: 'no_disponible', label: 'Ocupado / No disponible' },
] as const;

export type DisponibilidadValue = (typeof DISPONIBILIDAD_OPCIONES)[number]['value'];

export const filterMaterias = (input: string): Materia[] => {
  const normalized = input.toLowerCase();
  return MATERIAS_SUGERIDAS.filter((m) =>
    m.toLowerCase().includes(normalized)
  );
};

export const filterHabilidades = (input: string): Habilidad[] => {
  const normalized = input.toLowerCase();
  return HABILIDADES_SUGERIDAS.filter((h) =>
    h.toLowerCase().includes(normalized)
  );
};
