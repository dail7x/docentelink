import { z } from 'zod';

export const personalSchema = z.object({
  nombre: z.string().min(2, 'El nombre es muy corto'),
  apellido: z.string().min(2, 'El apellido es muy corto'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(8, 'Teléfono inválido'),
  slug: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  mostrarTelPublico: z.boolean().default(false),
  photoUrl: z.string().optional(),
});

export type PersonalFormData = z.infer<typeof personalSchema>;

export const experienceItemSchema = z.object({
  institucion: z.string().optional(),
  cargo: z.string().optional(),
  desde: z.string().optional(),
  hasta: z.string().optional(),
  descripcion: z.string().optional(),
});

export const educationItemSchema = z.object({
  titulo: z.string().optional(),
  institucion: z.string().optional(),
  anio: z.string().optional(),
});

export const courseItemSchema = z.object({
  nombre: z.string().optional(),
  institucion: z.string().optional(),
});

export const experienceSchema = z.object({
  resumen: z.string().max(400).optional(),
  mostrarResumenPublico: z.boolean().default(true),
  experiencia: z.array(experienceItemSchema).default([]),
  formacion: z.array(educationItemSchema).default([]),
  cursos: z.array(courseItemSchema).default([]),
  habilidades: z.array(z.string()).default([]),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;

export const identitySchema = z.object({
  tituloHabilitante: z.string().optional(),
  nivelEducativo: z.array(z.string()).default([]),
  mostrarNivelesPublico: z.boolean().default(true),
  materias: z.array(z.string()).default([]),
  provincia: z.string().optional(),
  localidades: z.array(z.string()).default([]),
  disponibilidad: z
    .enum(['inmediata', 'a_partir_de', 'no_disponible'])
    .default('inmediata'),
  disponibleDesde: z.string().optional(),
  turnos: z.array(z.string()).default(['manana', 'tarde']),
  diasDisponibles: z
    .array(z.string())
    .default(['lun', 'mar', 'mie', 'jue', 'vie']),
  tipoEmpleo: z.array(z.string()).default([]),
});

export type IdentityFormData = z.infer<typeof identitySchema>;

export const fullWizardSchema = personalSchema
  .merge(experienceSchema)
  .extend(identitySchema.shape);

export type FullWizardFormData = z.infer<typeof fullWizardSchema>;

export const slugSchema = z
  .string()
  .min(3)
  .regex(/^[a-z0-9-]+$/);

export const MAX_RESUMEN_LENGTH = 400;
