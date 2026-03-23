import { LucideIcon, User, GraduationCap, Briefcase } from 'lucide-react';

export const WIZARD_STEPS = [
  { id: 1, label: 'Personal', description: 'Datos básicos y foto', icon: User },
  { id: 2, label: 'Experiencia', description: 'Trayectoria y formación', icon: GraduationCap },
  { id: 3, label: 'Identidad', description: 'Especialidades docentes', icon: Briefcase },
] as const;

export const WIZARD_STEP_COUNT = WIZARD_STEPS.length;

export const WIZARD_STEP_INDEXES = {
  UPLOAD: 0,
  PERSONAL: 1,
  EXPERIENCE: 2,
  IDENTITY: 3,
} as const;

export type WizardStepId = typeof WIZARD_STEPS[number]['id'];
export type WizardStepLabel = typeof WIZARD_STEPS[number]['label'];
