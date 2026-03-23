export interface ExperienceItem {
  institucion?: string;
  cargo?: string;
  desde?: string;
  hasta?: string;
  descripcion?: string;
}

export interface EducationItem {
  titulo?: string;
  institucion?: string;
  anio?: string;
}

export interface CourseItem {
  nombre?: string;
  institucion?: string;
}

export interface WizardFormData {
  // Step 1 - Personal
  nombre?: string;
  apellido?: string;
  slug?: string;
  email?: string;
  telefono?: string;
  mostrarTelPublico?: boolean;
  photoUrl?: string;

  // Step 2 - Experience
  resumen?: string;
  mostrarResumenPublico?: boolean;
  experiencia?: ExperienceItem[];
  formacion?: EducationItem[];
  cursos?: CourseItem[];
  habilidades?: string[];

  // Step 3 - Identity
  tituloHabilitante?: string;
  nivelEducativo?: string[];
  mostrarNivelesPublico?: boolean;
  materias?: string[];
  provincia?: string;
  localidades?: string[];
  disponibilidad?: 'inmediata' | 'a_partir_de' | 'no_disponible';
  disponibleDesde?: string;
  turnos?: string[];
  diasDisponibles?: string[];
  tipoEmpleo?: string[];

  // Meta
  parsedFromPdf?: boolean;
  photoBlob?: Blob;
}

export interface ParsedCvData {
  es_cv_docente?: boolean;
  observaciones?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  resumen?: string;
  tituloHabilitante?: string;
  experiencia?: ExperienceItem[];
  formacion?: EducationItem[];
  cursos?: CourseItem[];
}

export interface WizardStepProps {
  initialData: Partial<WizardFormData>;
  onNext?: (data: Partial<WizardFormData>) => void;
  onFinish?: (data: Partial<WizardFormData>) => Promise<boolean>;
  onBack?: () => void;
  onSaveOnly?: (data: Partial<WizardFormData>) => void;
}
