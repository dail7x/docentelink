# DocenteLink — Especificación para el Agente de Codificación
*Versión 1.0 · Next.js 16.2 · Self-hosted en Hetzner + Coolify*

---

## 1. Contexto del producto

DocenteLink es un SaaS para docentes argentinos. Permite crear un perfil profesional con link único compartible (`docentelink.ar/cv/[username]`), generado mediante un wizard de 3 pasos con importación de PDF, editor de foto y sistema de gamificación que incentiva completar el perfil al 100%.

**Tagline:** *La carrera docente tiene un lugar propio.*

**Modelo Freemium:**
- **Plan gratuito:** CV completo, perfil público con link, PDF con watermark, editor de foto básico
- **Plan Pro ($2.990 ARS, pago único):** Sin watermark, slug personalizable, marcos de foto premium

**Deploy:** La app corre en un VPS Hetzner CX22 con Coolify. El repositorio se crea y conecta a Coolify mediante un script de automatización existente (`coolify-automation`). El agente no configura infra — solo escribe el código de la app.

---

## 2. Stack

```
Framework:          Next.js 16.2 — App Router, RSC + Server Actions
Styling:            Tailwind CSS 4 — tokens DocenteLink custom (ver Sección 3)
UI Primitives:      Radix UI selectivos — solo Select, Dialog, Checkbox, Switch
Database:           Turso (libsql) — SQLite edge, externo al VPS
ORM:                Drizzle ORM
Auth:               Auth.js v5 — Google OAuth (Fase 1), Magic Link/Resend (Fase 2)
Validación:         Zod — formularios y respuestas de API
Forms:              React Hook Form + Zod resolver

PDF — Extracción:   unpdf (cliente) → texto plano del PDF en browser
PDF — Parser:       Gemini 2.0 Flash API — texto → JSON estructurado
PDF — Generación:   @react-pdf/renderer — template JSX, client-side

Foto — Detección:   face-api.js TinyFaceDetector (~190KB) — auto-crop centrado
Foto — Fondo:       @imgly/background-removal (~5MB WASM, OSS) — client-side
Foto — Filtros:     Canvas API nativa — sin dependencias extra
Foto — Marcos:      SVG inline — sin dependencias extra
Foto — Upload:      Uploadthing — free tier, integración Next.js nativa

OG Images:          next/og — ImageResponse de Next.js 16.2
Pagos:              MercadoPago SDK — Checkout Pro (Fase 2)
Email:              Resend (Fase 2)
```

---

## 3. Identidad visual

### Paleta — tokens Tailwind

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        dl: {
          primary: {
            DEFAULT: '#534AB7',
            dark:    '#3C3489',
            mid:     '#7F77DD',
            light:   '#EEEDFE',
            bg:      '#F5F4FE',
          },
          accent: {
            DEFAULT: '#1D9E75',
            dark:    '#0F6E56',
            mid:     '#5DCAA5',
            light:   '#E1F5EE',
          },
          text:  '#2C2C2A',
          muted: '#5F5E5A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

### Reglas de uso
- **Violeta `#3C3489`** — header del perfil público, fondos oscuros de marca
- **Violeta `#534AB7`** — botones primarios, links, texto de acento
- **Teal `#1D9E75`** — "Link" en el logo, CTAs secundarios, éxito, badge verificado
- Barra de progreso: gradiente CSS `linear-gradient(90deg, #534AB7, #1D9E75)`
- Avatar sin foto: fondo `#534AB7`, iniciales en blanco

### Logo
Texto: **"Docente"** en `#3C3489` + **"Link"** en `#1D9E75`. Ícono: cadena de link (dos semicírculos enlazados).

---

## 4. Schema de base de datos

```typescript
// db/schema.ts
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id:            text('id').primaryKey(),
  email:         text('email').notNull().unique(),
  name:          text('name'),
  imageUrl:      text('image_url'),
  plan:          text('plan', { enum: ['free', 'pro'] }).default('free'),
  // Referidos (Fase 2)
  proExpiresAt:  integer('pro_expires_at', { mode: 'timestamp' }), // null = Pro pago permanente; fecha = Pro por referido
  referredBy:    text('referred_by'),      // username del referidor, null si registro orgánico
  referralCount: integer('referral_count').default(0), // cuántos referidos válidos generó
  createdAt:     integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
// Plan efectivo: plan='pro' AND (proExpiresAt IS NULL OR proExpiresAt > NOW())
// Si proExpiresAt venció → degradar a free en cada login o cron diario

export const resumes = sqliteTable('resumes', {
  id:             text('id').primaryKey(),
  userId:         text('user_id').notNull().references(() => users.id),
  username:       text('username').notNull(),
  title:          text('title'),

  // Datos del CV — JSON Resume estándar + meta.docente
  jsonResume:     text('json_resume', { mode: 'json' }).notNull(),

  // Visibilidad
  isPublic:       integer('is_public',     { mode: 'boolean' }).default(false),
  parsedFromPdf:  integer('parsed_from_pdf', { mode: 'boolean' }).default(false),

  // Foto
  photoProcessed: integer('photo_processed', { mode: 'boolean' }).default(false),
  photoFrame:     text('photo_frame').default('none'),

  // Gamificación
  completionScore: integer('completion_score').default(0),    // 0–100
  isVerified:      integer('is_verified', { mode: 'boolean' }).default(false),
  unlockedBadges:  text('unlocked_badges', { mode: 'json' })
                     .$defaultFn(() => JSON.stringify([])),   // string[]

  // Analytics — activar en Fase 2
  views:     integer('views').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at',  { mode: 'timestamp' }).$onUpdateFn(() => new Date()),
}, (t) => ({
  usernameIdx: uniqueIndex('username_idx').on(t.username),
  userIdx:     uniqueIndex('user_idx').on(t.userId),
}))
```

### Extensión JSON Resume para campos docentes

El campo `jsonResume` sigue el estándar JSON Resume 1.0.0. Los campos específicos de DocenteLink van en `meta.docente`:

```typescript
interface DocenteMeta {
  tituloHabilitante: string
  nivelEducativo:    ('inicial' | 'primaria' | 'secundaria' | 'terciaria' | 'universitaria' | 'adultos')[]
  materias:          string[]           // tags libres, ej: ["Matemática", "Lengua"]
  provincia:         string             // una de las 24 provincias argentinas
  localidad:         string
  disponibilidad:    'inmediata' | 'a_partir_de' | 'no_disponible'
  tipoEmpleo:        ('planta' | 'suplencia' | 'reemplazo' | 'horas_catedra')[]
  completionScore:   number             // 0–100, sincronizado con columna en DB
  isVerified:        boolean
  parsedFromPdf:     boolean
}
```

> `nivelEducativo`, `materias`, `provincia` y `tipoEmpleo` son críticos para el matching futuro con escuelas. Nunca omitirlos en transformaciones.

```bash
# .env.local — declarar todas; configurar valores reales en Coolify UI
GEMINI_API_KEY=           # Google AI Studio — free tier, sin tarjeta de crédito
TURSO_DATABASE_URL=       # libsql://...turso.io
TURSO_AUTH_TOKEN=
AUTH_SECRET=              # string random ≥32 chars
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
NEXTAUTH_URL=https://docentelink.ar
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Fase 2
MERCADOPAGO_ACCESS_TOKEN=
RESEND_API_KEY=
```

---

## 6. Estructura de archivos

```
/app
  /(marketing)
    page.tsx                      # Landing page
  /(auth)
    /login/page.tsx
  /(app)
    /dashboard/page.tsx           # CV del usuario, link, plan, badges
    /dashboard/error.tsx          # unstable_retry() de Next.js 16.2
    /cv
      /create/page.tsx            # Wizard completo
      /[username]/page.tsx        # Perfil público — RSC puro
      /[username]/error.tsx
  /api
    /health/route.ts              # GET → { status: 'ok' } — requerido por Coolify
    /parse-cv/route.ts            # POST text → Gemini → JSON wizard
    /resume/create/route.ts
    /resume/update/route.ts
    /og/[username]/route.tsx      # OG image dinámica por perfil

/components
  /brand
    Logo.tsx                      # Variantes light/dark/accent
  /photo
    PhotoEditor.tsx               # Orquestador — lazy load de librerías
    FaceDetector.ts               # face-api.js TinyFaceDetector
    BackgroundRemover.ts          # @imgly/background-removal
    FilterControls.tsx            # Sliders brillo/contraste/saturación/calidez/nitidez
    FrameSelector.tsx             # Grid marcos free y Pro
    PhotoPreview.tsx              # Canvas live + mini preview
    frameDefinitions.ts           # SVG de cada marco como constantes
  /parser
    PdfUploader.tsx               # Drag-drop + botón — extrae texto con unpdf
    ParsingProgress.tsx           # Estados: extracting → parsing → done → error
    PdfErrorBoundary.tsx          # unstable_catchError (Next.js 16.2)
  /wizard
    WizardContainer.tsx           # React Hook Form + Context de estado entre pasos
    WizardStepBar.tsx             # Indicador 1/2/3 — done/active/pending
    StepPersonal.tsx              # Paso 1: datos + foto + slug preview
    StepTrayectoria.tsx           # Paso 2: experiencia (array) + formación (array)
    StepPreferences.tsx           # Paso 3: nivel, materias, provincia, disponibilidad
    WizardSuccessShare.tsx        # Pantalla final: link del perfil + botones de compartir
  /gamification
    ProfileProgress.tsx           # Barra de progreso + porcentaje + checklist
    BadgeShowcase.tsx             # Grid de insignias desbloqueadas/bloqueadas
    VerifiedBadge.tsx             # Checkmark teal en avatar
  /resume
    ResumePreview.tsx             # Preview live del CV (debounce 300ms)
    PublicProfile.tsx             # Perfil público renderizado
    CvTemplate.tsx                # Template @react-pdf/renderer con identidad DocenteLink
  /ui
    Button.tsx                    # Variantes: primary, accent, ghost, outline
    Badge.tsx
    SlugPreview.tsx               # Muestra docentelink.ar/cv/[slug] en tiempo real
    TagInput.tsx                  # Para campo materias

/lib
  completion-score.ts             # calculateCompletionScore() — ver Sección 9
  badge-definitions.ts            # Definición de cada insignia y su threshold
  pdf-parser.ts                   # extractPdfText() con unpdf
  json-resume.ts                  # Transform wizard data → JSON Resume + meta.docente
  slug.ts                         # Generación y deduplicación de slugs

/db
  schema.ts
  index.ts                        # Turso client
```

---

## 7. Features — especificación detallada

### 7.1 Parser PDF — unpdf + Gemini Flash

**Flujo:**
1. Usuario sube PDF → queda 100% en browser (nunca llega al servidor)
2. `unpdf` extrae texto plano client-side
3. Solo el texto plano (≤4.000 chars) viaja a `/api/parse-cv`
4. Gemini Flash devuelve JSON estructurado con todos los campos del wizard
5. Wizard se pre-llena; el docente solo corrige

**Límites:** PDFs hasta 10MB. Texto truncado a 4.000 chars (~3 páginas).

**Graceful degradation:** Si Gemini falla o el PDF no tiene texto extraíble → wizard vacío con mensaje amigable. Nunca bloquear el flujo.

```typescript
// lib/pdf-parser.ts — extracción client-side
import { extractText } from 'unpdf'

export async function extractPdfText(file: File): Promise<string> {
  if (file.size > 10 * 1024 * 1024) throw new Error('El PDF no puede superar 10MB')
  const { text } = await extractText(await file.arrayBuffer(), { mergePages: true })
  return text.slice(0, 4000)
}
```

```typescript
// app/api/parse-cv/route.ts — estructuración con Gemini
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: { responseMimeType: 'application/json' },
})

const ParsedCVSchema = z.object({
  nombre:            z.string().optional(),
  email:             z.string().email().optional(),
  telefono:          z.string().optional(),
  tituloHabilitante: z.string().optional(),
  experiencia: z.array(z.object({
    institucion:  z.string(),
    cargo:        z.string(),
    desde:        z.string().optional(),
    hasta:        z.string().optional(),
    descripcion:  z.string().optional(),
  })).default([]),
  formacion: z.array(z.object({
    titulo:      z.string(),
    institucion: z.string(),
    anio:        z.string().optional(),
  })).default([]),
})

const PROMPT = `Sos un asistente especializado en CVs de docentes argentinos.
Extraé los datos del siguiente texto y devolvé ÚNICAMENTE un JSON válido.
No inventes datos ausentes. Usá null u omití campos no encontrados.
Texto del CV:\n`

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    const result = await model.generateContent(PROMPT + text)
    const parsed = ParsedCVSchema.parse(JSON.parse(result.response.text()))
    return Response.json({ data: parsed, success: true })
  } catch {
    return Response.json({ data: {}, success: false,
      message: 'No pudimos leer el CV. Completá el formulario manualmente.' })
  }
}
```

### 7.2 Wizard de 3 pasos

Estado global persistido en `sessionStorage` entre pasos. Validación Zod por paso — no avanza si hay errores.

**Paso 1 — Datos personales**
- Nombre completo, email, teléfono *(pre-llenados si hubo parser)*
- Título habilitante *(pre-llenado si hubo parser)*
- Foto de perfil (via PhotoEditor — ver 7.3)
- Preview del slug en tiempo real: `docentelink.ar/cv/maria-gonzalez-a3x9`
- Indicador visual "Detectado de tu CV" en campos pre-llenados

**Paso 2 — Trayectoria** *(pre-llenado desde Gemini cuando hay parser)*
- Experiencia docente: array dinámico con `useFieldArray` — Institución, Cargo, Período, Descripción
- Formación: array dinámico — Título, Institución, Año

**Paso 3 — Preferencias laborales**
- `nivelEducativo`: multi-select `[Inicial, Primaria, Secundaria, Terciaria, Universitaria, Adultos]`
- `materias`: TagInput — texto libre con tags (ej: "Matemática", "Lengua")
- `provincia`: Select con 24 provincias argentinas
- `localidad`: texto libre
- `disponibilidad`: Select `[Inmediata, A partir de fecha, No disponible]`
- `tipoEmpleo`: multi-select `[Planta permanente, Suplencia, Reemplazo, Horas cátedra]`

Navegación entre pasos usa `transitionTypes={['slide']}` de Next.js 16.2.

### 7.3 Editor de foto de perfil

Todo el procesamiento ocurre 100% en browser. Ninguna imagen sale del dispositivo.

**Pipeline (en orden):**
1. **face-api.js TinyFaceDetector** — detecta rostro, genera recorte cuadrado centrado. Si no detecta: recorte centrado por defecto.
2. **@imgly/background-removal** — modelo ONNX + WASM, elimina fondo, devuelve PNG transparente.
3. **Canvas API** — aplica filtros y el marco SVG seleccionado.
4. **Canvas.toBlob()** → upload via Uploadthing → URL guardada en DB.

**Carga lazy y secuencial** — no bloquear el wizard:
1. `face-api.js` — carga al montar `PhotoEditor`
2. `@imgly/background-removal` — carga solo cuando el usuario inicia el editor
3. El modelo WASM se cachea en Cache API del browser después de la primera descarga

**Presets de filtros:**

| Preset | Brillo | Contraste | Saturación | Calidez | Nitidez |
|---|---|---|---|---|---|
| Natural | 100 | 100 | 100 | 0 | 0 |
| Vívido | 105 | 115 | 140 | +5 | 20 |
| Cálido | 108 | 105 | 110 | +25 | 0 |
| Suave | 112 | 90 | 80 | +8 | 0 |
| B&N | 100 | 110 | 0 | 0 | 10 |

Calidez: ajuste de canales R/B directamente en `ImageData`. Nitidez: kernel de convolución 3×3.

**Marcos — Plan gratuito:** Sin marco, Violeta simple, Teal simple, Doble anillo, Punteado.
**Marcos — Plan Pro:** Insignia DocenteLink (badge teal "DocenteLink" en arco inferior), Dorado, Verificado (checkmark en esquina).

Al seleccionar un marco Pro desde plan free → modal de upgrade con CTA a MercadoPago.

### 7.4 Sistema de gamificación

**Filosofía:** Cada campo completado suma puntos visibles en tiempo real. Al llegar a 100 pts → insignia verificada DocenteLink. Las insignias solo se otorgan, nunca se revocan.

**Tabla de puntos (total: 100):**

| Ítem | Pts |
|---|---|
| Foto de perfil subida | 10 |
| Nombre completo | 5 |
| Email verificado | 5 |
| Teléfono | 5 |
| Título habilitante | 10 |
| ≥1 experiencia docente | 15 |
| ≥3 experiencias | 5 |
| ≥1 formación académica | 15 |
| Preferencias completas (nivel + provincia + disponibilidad) | 15 |
| ≥1 materia cargada | 5 |
| Perfil público activado | 5 |
| Foto con mejora aplicada | 5 |

**Insignias:**

| Insignia | Pts requeridos |
|---|---|
| Perfil iniciado | 25 |
| Disponible | 60 |
| CV completo | 70 |
| Primer link | 75 |
| Experiencia sólida | 90 |
| **Perfil verificado DocenteLink** | **100** |

**Función de cálculo** (`lib/completion-score.ts`):

```typescript
export function calculateCompletionScore(
  resume: JsonResume,
  meta: { hasPhoto: boolean; photoProcessed: boolean; isPublic: boolean }
): { score: number; nextMilestone: string; unlockedBadges: string[] } {
  const checks = {
    hasPhoto:       { done: meta.hasPhoto,                                    pts: 10 },
    hasName:        { done: !!resume.basics?.name,                            pts: 5  },
    hasEmail:       { done: !!resume.basics?.email,                           pts: 5  },
    hasPhone:       { done: !!resume.basics?.phone,                           pts: 5  },
    hasTitulo:      { done: !!resume.meta?.docente?.tituloHabilitante,        pts: 10 },
    hasExp1:        { done: (resume.work?.length ?? 0) >= 1,                  pts: 15 },
    hasExp3:        { done: (resume.work?.length ?? 0) >= 3,                  pts: 5  },
    hasEdu:         { done: (resume.education?.length ?? 0) >= 1,             pts: 15 },
    hasPrefs:       { done: !!(resume.meta?.docente?.nivelEducativo?.length
                            && resume.meta?.docente?.provincia
                            && resume.meta?.docente?.disponibilidad),         pts: 15 },
    hasMaterias:    { done: (resume.meta?.docente?.materias?.length ?? 0) >= 1, pts: 5 },
    isPublic:       { done: meta.isPublic,                                    pts: 5  },
    photoProcessed: { done: meta.photoProcessed,                              pts: 5  },
  }

  const score = Object.values(checks).filter(c => c.done).reduce((s, c) => s + c.pts, 0)

  const BADGES = [
    { score: 25,  name: 'perfil-iniciado'    },
    { score: 60,  name: 'disponible'         },
    { score: 70,  name: 'cv-completo'        },
    { score: 75,  name: 'primer-link'        },
    { score: 90,  name: 'experiencia-solida' },
    { score: 100, name: 'verificado'         },
  ]

  const unlockedBadges = BADGES.filter(b => score >= b.score).map(b => b.name)
  const next = BADGES.find(b => score < b.score)
  const nextMilestone = next
    ? `${next.score - score} pts para "${next.name.replace(/-/g, ' ')}"`
    : '¡Perfil completo! Insignia verificada obtenida.'

  return { score, nextMilestone, unlockedBadges }
}
```

Recalcular en cada `onChange` del wizard (debounce 1s) y en cada guardado en DB. El `completionScore` se persiste en DB para ordenar búsquedas futuras.

**UX del progreso:**
- En el wizard: `WizardStepBar` (pasos done/active/pending) + `ProfileProgress` (barra gradiente + checklist con puntos)
- En el perfil público: mini barra de progreso bajo el nombre + badge "Perfil verificado DocenteLink" cuando `isVerified = true`
- Al desbloquear una insignia: toast sutil en esquina inferior
- Al llegar a 100 pts: toast prominente animado

### 7.5 Perfiles públicos `/cv/[username]`

React Server Component — SSR puro para SEO. Renderizado 25–60% más rápido con Next.js 16.2.

Si `isPublic = false` o el username no existe → `notFound()` (404). No revelar que el perfil existe.

```typescript
// app/cv/[username]/page.tsx
export async function generateMetadata({ params }) {
  const resume = await getResumeByUsername(params.username)
  if (!resume?.isPublic) return { title: 'DocenteLink' }
  const d = resume.jsonResume.meta.docente
  return {
    title: `${resume.jsonResume.basics.name} — Docente | DocenteLink`,
    description: `${d.tituloHabilitante} · ${d.provincia}`,
    openGraph: { images: [`/api/og/${params.username}`] },
  }
}
```

**OG Image dinámica** (`/api/og/[username]`): header violeta `#3C3489`, nombre del docente, título habilitante en teal, checkmark verde si `isVerified`. Usar Next.js 16.2 `ImageResponse` (Geist Sans por defecto, hasta 20x más rápido).

```tsx
// app/api/og/[username]/route.tsx
import { ImageResponse } from 'next/og'

export async function GET(_req: Request, { params }: { params: { username: string } }) {
  const resume = await getResumeByUsername(params.username)
  if (!resume?.isPublic) return new Response('Not found', { status: 404 })
  const { name } = resume.jsonResume.basics
  const { tituloHabilitante, isVerified } = resume.jsonResume.meta.docente

  return new ImageResponse(
    <div style={{ background: '#3C3489', width: '100%', height: '100%',
                  display: 'flex', flexDirection: 'column', padding: '60px' }}>
      <div style={{ color: '#fff', fontSize: 48, fontWeight: 500 }}>{name}</div>
      {isVerified && (
        <div style={{ color: '#5DCAA5', fontSize: 20, marginTop: 8 }}>
          ✓ Perfil verificado DocenteLink
        </div>
      )}
      <div style={{ color: '#AFA9EC', fontSize: 26, marginTop: 16 }}>{tituloHabilitante}</div>
      <div style={{ position: 'absolute', bottom: 40, right: 60,
                    color: '#7F77DD', fontSize: 18 }}>docentelink.ar</div>
    </div>,
    { width: 1200, height: 630 }
  )
}
```

### 7.6 Auth

Auth.js v5. En Fase 1: solo Google OAuth. Magic Link (Resend) en Fase 2.

Middleware Next.js protege `/dashboard/*` y `/cv/create`. Post-login: redirect a `/dashboard`.

### 7.7 Generación de PDF

`@react-pdf/renderer` client-side. Template con identidad DocenteLink (header violeta, acentos teal, tipografía limpia).

Watermark en plan free: texto diagonal "DocenteLink.com", `opacity: 0.08`, `fontSize: 36`, rotado 45°, color `#534AB7`.
Sin watermark en plan Pro.
Nombre de archivo: `CV-[Apellido]-[Nombre].pdf`.

### 7.8 Slugs y URLs

- Auto-generación: `{nombre}-{apellido}-{random4}` → `maria-gonzalez-a3x9`
- Validación: único, minúsculas + números + guiones, máx 40 chars
- Deduplicación: si existe → probar `{slug}-2`, `{slug}-3`...
- Preview del slug visible en Paso 1 del wizard
- Plan Pro: puede editar el slug (sin el random4)

### 7.9 Landing page

Secciones en orden:
1. **Hero** — tagline + CTA "Creá tu perfil gratis"
2. **Cómo funciona** — 3 pasos ilustrados (Subí tu PDF → Completá → Compartí)
3. **Preview mockup** — captura del perfil público con paleta DocenteLink
4. **Pricing** — Free vs Pro, tabla simple
5. **FAQ** — 5–6 preguntas frecuentes
6. **Footer** — "Hecho en Argentina, para docentes argentinos"

### 7.10 Pantalla de éxito del wizard — compartir

Después de guardar el CV, mostrar una pantalla de éxito (no redirigir directo al dashboard) con el link del perfil y botones de compartir. El docente probablemente lo hace desde el celular — WhatsApp es la primera opción.

**Componente `WizardSuccessShare`:**

```tsx
'use client'

const profileUrl = `https://docentelink.ar/cv/${username}`
const shareText = `¡Creé mi perfil docente en DocenteLink! Mirá mi CV: ${profileUrl}`

// 1. WhatsApp — primer botón, más prominente
const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`

// 2. Web Share API — abre el share sheet nativo del sistema operativo
//    Funciona en iOS Safari, Android Chrome, y escritorio moderno
const handleNativeShare = async () => {
  if (navigator.share) {
    await navigator.share({ title: 'Mi perfil DocenteLink', url: profileUrl })
  }
}

// 3. Copiar link — fallback siempre disponible
const handleCopy = () => {
  navigator.clipboard.writeText(profileUrl)
  // Toast: "Link copiado"
}
```

**Orden de botones:**
1. **WhatsApp** — botón verde, ícono WhatsApp, texto "Compartir por WhatsApp" — siempre visible
2. **Compartir** — solo si `navigator.share` está disponible (detectar client-side)
3. **Copiar link** — siempre visible como fallback

**URL de referido en el share:**
El link compartido incluye `?ref=[username]` para el sistema de referidos (Fase 2).
La URL funciona igual sin el parámetro — es aditivo y no rompe nada.

```
https://docentelink.ar/cv/maria-gonzalez-a3x9?ref=maria-gonzalez-a3x9
```

Preparar el link con `?ref=` desde Fase 1 para no tener que actualizar los links ya compartidos cuando se active el sistema de referidos en Fase 2.

### 7.11 Sistema de referidos — 1 mes Pro gratis (Fase 2)

Cuando alguien llega al sitio desde el link de un docente (`?ref=[username]`) y se registra, el docente que compartió recibe 30 días de plan Pro gratuito.

**Flujo completo:**

```
Visitante llega a docentelink.ar/cv/maria-gonzalez?ref=maria-gonzalez
        │
        ▼
Middleware Next.js lee ?ref → guarda en cookie httpOnly (30 días, SameSite=Lax)
        │
        ▼
Visitante se registra con Google OAuth
        │
Auth.js callback → leer cookie ref → guardar users.referredBy = 'maria-gonzalez'
        │
        ▼
Usuario crea su primer CV (trigger en /api/resume/create)
        │
        ▼
handleReferralReward(newUserId) — ver lógica abajo
        │
        ▼
Email a maria-gonzalez: "¡Alguien se registró con tu link! Tenés 30 días de Pro."
```

**Implementación:**

```typescript
// middleware.ts — capturar ?ref y guardarlo en cookie
export function middleware(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref')
  const response = NextResponse.next()
  if (ref && !request.cookies.get('dl_ref')) {
    response.cookies.set('dl_ref', ref, {
      maxAge: 60 * 60 * 24 * 30,  // 30 días
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    })
  }
  return response
}

// lib/referral.ts — recompensar al referidor
export async function handleReferralReward(newUserId: string) {
  const newUser = await db.query.users.findFirst({ where: eq(users.id, newUserId) })
  if (!newUser?.referredBy) return

  const referrer = await db.query.users.findFirst({
    where: eq(users.username, newUser.referredBy)
  })
  if (!referrer) return

  // Solo recompensar si el referidor es plan free
  // Si ya es Pro pago (proExpiresAt IS NULL), solo incrementar el contador
  if (referrer.plan === 'free') {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)
    await db.update(users)
      .set({ plan: 'pro', proExpiresAt: expiresAt })
      .where(eq(users.id, referrer.id))
  }

  await db.update(users)
    .set({ referralCount: sql`referral_count + 1` })
    .where(eq(users.id, referrer.id))

  await sendReferralRewardEmail(referrer.email, referrer.name)
}
```

**Reglas de negocio:**
- El referido debe crear al menos un CV para que el referidor reciba la recompensa (no basta con registrarse)
- Si el referidor ya tiene Pro pago → solo incrementar `referralCount`, no pisar `proExpiresAt`
- Si el referidor ya tiene Pro trial y consigue otro referido → extender 30 días más desde la fecha actual
- Un usuario solo puede ser referido una vez (la cookie se lee solo si `referredBy` está vacío)

**Expiración del trial:**
Chequear `proExpiresAt` en cada Server Action protegida y en el middleware de dashboard. Si venció → setear `plan = 'free'` y limpiar `proExpiresAt`.

```typescript
// lib/check-plan.ts — helper para usar en Server Actions
export async function getEffectivePlan(userId: string): Promise<'free' | 'pro'> {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!user) return 'free'
  if (user.plan === 'free') return 'free'
  if (!user.proExpiresAt) return 'pro'  // Pro pago permanente
  if (user.proExpiresAt > new Date()) return 'pro'  // Trial vigente
  // Trial vencido — degradar
  await db.update(users).set({ plan: 'free', proExpiresAt: null }).where(eq(users.id, userId))
  return 'free'
}
```

---

## 8. Estados UX y edge cases

| Situación | Comportamiento |
|---|---|
| PDF escaneado sin texto extraíble | `unpdf` devuelve string vacío → skip Gemini → wizard vacío + mensaje amigable |
| Gemini no disponible / timeout | Graceful degradation — wizard vacío, continuar manualmente |
| Gemini free tier agotado (1.500 req/día) | Mismo fallback silencioso |
| PDF > 10MB | Rechazar antes de procesar, mensaje de límite |
| Slug duplicado | Sugerir variante automática `{slug}-2` |
| Perfil privado accedido por URL | `notFound()` — no revelar que el perfil existe |
| Error en guardado (Turso timeout) | `unstable_retry()` de Next.js 16.2 en `error.tsx` — botón "Reintentar" rehace el fetch |
| Usuario sin foto | Avatar con iniciales, fondo `#534AB7` |
| Primera carga modelo WASM (~5MB) | Spinner "Preparando editor..." — se cachea, solo ocurre una vez por browser |
| Marco Pro desde plan free | Modal con CTA de upgrade a MercadoPago |
| Score baja (usuario borra experiencia) | Recalcular score, badges ya ganados no se revocan |
| Nuevo badge desbloqueado | Toast sutil en esquina inferior |
| 100 pts alcanzados | Toast prominente animado + badge verificado aparece en avatar |
| `navigator.share` no disponible | Ocultar botón "Compartir", mostrar solo WhatsApp + Copiar link |
| Referido llega sin completar registro | Cookie persiste 30 días — si vuelve y se registra, el referido se acredita igual |
| Referidor ya tiene Pro pago | Solo incrementar `referralCount`, no tocar `proExpiresAt` |
| Trial de referido vencido | `getEffectivePlan()` lo detecta y degrada a free en el próximo request |
| Auto-referido (`ref` = propio username) | Ignorar silenciosamente en `handleReferralReward` |

---

## 9. Configuración Next.js

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Requerido para self-hosted en Coolify
  // Genera servidor Node.js standalone — reduce imagen Docker de ~500MB a ~150MB
  output: 'standalone',

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.uploadthing.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google OAuth avatars
    ],
  },
}

export default nextConfig
```

### Healthcheck endpoint — requerido por Coolify

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
}
```

---

## 10. Fases de implementación

### Fase 1 — Core MVP

1. Setup Next.js 16.2 + Tailwind con tokens DocenteLink + Drizzle + Turso
2. Auth.js v5 — Google OAuth
3. Parser: `PdfUploader` (unpdf) + `/api/parse-cv` (Gemini Flash)
4. Wizard 3 pasos — `WizardStepBar` + `ProfileProgress` + campos
5. Editor de foto — pipeline completo client-side
6. Generación PDF con `@react-pdf/renderer` + watermark free
7. Slugs + toggle público/privado
8. Perfiles públicos `/cv/[username]` RSC + OG images
9. Sistema de gamificación — score, checklist, badges, insignia verificada
10. Pantalla de éxito del wizard con botones de compartir (ver 7.10)
11. Landing page
12. `/api/health` endpoint

### Fase 2 — Monetización

- MercadoPago Checkout Pro — webhook actualiza `plan = 'pro'`
- Quitar watermark en Pro + habilitar slug personalizable + marcos premium
- Magic Link email (Auth.js + Resend)
- Sistema de referidos — 1 mes Pro gratis al referidor (ver 7.11)
- Analytics de views (activar campo `views` ya en schema)
- Health checks y alertas de uptime desde Coolify

### Fase 3 — Bolsa de trabajo (Post-MVP)

- Buscador público con filtros provincia / nivel / materias — `ORDER BY is_verified DESC`
- API para instituciones educativas
- Matching y postulación automática

---

*Spec para agente de codificación v1.0 — DocenteLink. No incluye configuración de infra (ver documento separado `docentelink-infra.md`).*
