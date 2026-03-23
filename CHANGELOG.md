# Changelog

## [Unreleased] - Theme Selector Feature + Bug Fix

### Added

- **Theme Selector Feature**
  - 5 temas de color: Default (Azul), Ocean (Verde azulado), Sunset (Naranja), Forest (Verde), Royal (Púrpura)
  - 3 formas de foto: Círculo, Cuadrado, Esquinas redondeadas
  - Toggle para borde de foto
  - Preview en vivo con CSS variables
  - Selector visible solo para el dueño del perfil

- **Acciones de Servidor** (`src/app/actions/update-appearance.ts`)
  - `updateAppearanceAction()` para guardar preferencias de tema

- **Base de Datos**
  - Nuevas columnas: `theme`, `photoShape`, `photoBorder` en schema

### Fixed

- **Build Error** en `page.tsx`
  - Corregido JSX malformado (contenido duplicado después del return)
  - Fix de comillas sin escapar en descripción de experiencia

---

## Fase 1: Progress Indicator & Arquitectura

#### Added

- **Nuevo Progress Indicator** (`src/components/wizard/WizardProgress.tsx`)
  - Diseño horizontal compacto (single-line)
  - Íconos para cada paso (User, GraduationCap, Briefcase)
  - Barra de progreso animada como línea conectora
  - Componente memoizado para rendimiento
  - Ocupa ~50px vs ~150px anterior

- **Tipos Compartidos** (`src/types/wizard.ts`)
  - `WizardFormData` - tipo completo para datos del formulario
  - `WizardStepProps` - interfaz unificada para todos los Steps
  - `ParsedCvData` - tipo para datos del parser
  - `ExperienceItem`, `EducationItem`, `CourseItem` - tipos de elementos
  - Agregado campo `apellido` a WizardFormData

- **Constantes Centralizadas** (`src/data/wizard.ts`)
  - `WIZARD_STEPS` - definición de pasos del wizard
  - `WIZARD_STEP_INDEXES` - índices para navegación
  - Eliminación de hardcoded strings en componentes

#### Changed

- **Refactorizado** `src/app/(app)/cv/create/page.tsx`
  - Uso del nuevo componente `WizardProgress`
  - Extracción de subcomponentes (`LoadingState`, `StepHeader`, `UploadStep`, `ParsedDataSummary`)
  - Uso de constantes centralizadas
  - Mejora en tipado con tipos compartidos
  - Header sticky con backdrop-blur
  - Tipo explícito para `currentStep` (`number`)

- **Actualizado** `StepPersonal.tsx`
  - Ahora usa `WizardStepProps` de `@/types/wizard`
  - Tipado más preciso
  - Verificación de undefined para `onNext`

#### Removed

- **Eliminado** `src/app/api/parse-cv/route.ts`
  - Redundancia eliminada: el parser ahora usa `parseCvFromText` action
  - Simplificación de arquitectura

---

### Fase 2: Datos Externos & Validaciones

#### Added

- **Datos Geográficos** (`src/data/argentina.ts`)
  - `PROVINCIAS` - lista de 24 provincias argentinas (tipado como `const`)
  - `LOCALIDADES_POR_PROVINCIA` - localidades por provincia (tipado)
  - `getLocations()` - helper para obtener localidades
  - Tipos fuertemente tipados (`Provincia`, `Localidad`)

- **Datos Educativos** (`src/data/education.ts`)
  - `NIVELES_EDUCATIVOS` - 7 niveles de enseñanza
  - `MATERIAS_SUGERIDAS` - 27 materias predefinidas (ordenadas alfabéticamente)
  - `HABILIDADES_SUGERIDAS` - 24 habilidades sugeridas
  - `TURNOS` y `DIAS_SEMANA` - constantes de tiempo
  - `DISPONIBILIDAD_OPCIONES` - 3 opciones de disponibilidad
  - `filterMaterias()` y `filterHabilidades()` - helpers de filtrado
  - Tipos exportados para cada constante

- **Validaciones Zod** (`src/lib/validations.ts`)
  - `personalSchema` - validación de datos personales
  - `experienceSchema` - validación de experiencia
  - `identitySchema` - validación de identidad
  - `fullWizardSchema` - validación completa del wizard
  - `MAX_RESUMEN_LENGTH` - constante de límite (400)

#### Changed

- **Refactorizado** `StepIdentity.tsx`
  - Ahora usa datos de `src/data/argentina.ts`
  - Ahora usa datos de `src/data/education.ts`
  - 0 hardcoded de provincias/localidades/materias
  - Componente memoizado para rendimiento
  - Arreglado escape de entidades JSX
  - ToggleSwitch extraído como subcomponente memoizado

- **Refactorizado** `StepExperience.tsx`
  - Ahora usa `HABILIDADES_SUGERIDAS` de `src/data/education.ts`
  - Ahora usa `MAX_RESUMEN_LENGTH` de `src/lib/validations.ts`
  - 0 hardcoded de habilidades
  - Componente memoizado para rendimiento

#### Fixed

- **Bug de tipado en StepPersonal.tsx**
  - `initialData?.nombre` ahora maneja `undefined` correctamente
  - Campo `apellido` agregado a `WizardFormData`
  - Verificación de `onNext` antes de invocar

- **Bug de tipado en cv/create/page.tsx**
  - Tipo explícito `number` para `currentStep`

---

### Mejoras de Calidad de Código

| Área | Antes | Después |
|------|-------|---------|
| Hardcoded data | ~600 líneas en componentes | Datos centralizados en archivos `/data` |
| Tipado | `any` abundante | Tipos estrictos con TypeScript |
| Memoización | No usado | Componentes `memo()` para rendimiento |
| Validación | Solo client-side | Schemas Zod compartidos (preparado) |
| Mantenibilidad | Difícil cambios | Single source of truth |

---

### Próximas Fases (Pendientes)

- [ ] Fase 3: Simplificar `db/index.ts` (eliminar Proxy pattern)
- [ ] Fase 4: Rate limiting en actions
- [ ] Fase 4: Eliminar dependencias no usadas (`face-api.js`, `@react-pdf/renderer`)
- [ ] Fase 4: Actualizar README.md

## [0.1.0] - Initial Release

- Proyecto inicial DocenteLink
- Wizard de CV con 3 pasos
- Parser de CV con IA (OpenRouter)
- Autenticación con Clerk
- Base de datos con Turso/Drizzle
