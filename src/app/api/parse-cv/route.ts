import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite',
})

const ParsedCVSchema = z.object({
  es_cv_docente: z.boolean().optional().nullable().default(true),
  observaciones: z.string().optional().nullable(),
  nombre: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  resumen: z.string().optional().nullable(),
  tituloHabilitante: z.string().optional().nullable(),
  experiencia: z.array(z.object({
    institucion: z.string().optional().nullable().default(""),
    cargo: z.string().optional().nullable().default(""),
    desde: z.string().optional().nullable(),
    hasta: z.string().optional().nullable(),
    descripcion: z.string().optional().nullable(),
  })).default([]),
  formacion: z.array(z.object({
    titulo: z.string().optional().nullable().default(""),
    institucion: z.string().optional().nullable().default(""),
    anio: z.union([z.string(), z.number()]).transform(val => String(val)).optional().nullable(),
  })).default([]),
  cursos: z.array(z.object({
    nombre: z.string().optional().nullable().default(""),
    institucion: z.string().optional().nullable().default(""),
  })).default([]),
})

const PROMPT = `Sos un asistente veloz especializado en extraer información de currículums de docentes.
Analizá si el texto corresponde a un perfil docente o educacional (campo "es_cv_docente"). Si no lo es, dejá un aviso en "observaciones".

REGLAS CRÍTICAS DE EXTRACCIÓN:
1. NO REESCRIBAS NI ADAPTES LA INFORMACIÓN DE EXPERIENCIA/FORMACIÓN. Extraé los datos EXACTAMENTE como aparecen.
2. ORDEN CRONOLÓGICO: La lista de "experiencia" DEBE estar ordenada de la más RECIENTE a la más ANTIGUA.
3. INTEGRIDAD DE DATOS: Asegurate de que cada "descripcion" de tareas pertenezca exclusivamente a su "cargo".
4. FORMATO DE FECHAS (IMPORTANTE): Extraé las fechas de experiencia (desde/hasta) en formato "YYYY-MM" (Ej: "2020-03"). 
   - Si solo dice el año, usá "YYYY-01". 
   - Si dice "Actual", dejalo vacío o usá null.
5. FORMATO CAMEL CASE: Para nombres de "institucion", aplicá formato Capitalizado.
6. RESUMEN PROFESIONAL (IA): 
   - Si el CV TIENE un resumen/perfil, extraelo y refinalo para que sea profesional y cálido (máximo 400 caracteres).
   - Si NO TIENE un resumen, GENERÁ uno basado en los datos extraídos (años de experiencia, materias destacadas, títulos y logros).
   - El resumen debe estar en primera persona, ser entusiasta y profesional.

MAPEO JSON:
- "nombre", "email", "telefono": Datos personales.
- "resumen": Perfil profesional (extraído o generado).
- "experiencia": Array de objetos con {institucion, cargo, desde, hasta, descripcion}.
- "formacion": {institucion, titulo, anio}.
- "cursos": {nombre, institucion}.

Devolvé ÚNICAMENTE un JSON válido. NO inventes datos excepto para el campo "resumen" si falta. Usá null en lugar de omitir campos si no encuentras datos.
`

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    const result = await model.generateContent(PROMPT + "Texto del CV:\n" + text)
    const rawResponse = result.response.text();
    console.log("Respuesta raw de Gemini:", rawResponse);

    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No se encontró JSON en la respuesta de Gemini");
      throw new Error("Formato de respuesta inválido");
    }

    const cleanJson = jsonMatch[0];

    try {
      const parsed = ParsedCVSchema.parse(JSON.parse(cleanJson))
      return Response.json({ data: parsed, success: true })
    } catch (parseError) {
      console.error("Error al parsear el JSON de Gemini:", parseError);
      throw parseError;
    }
  } catch (error: any) {
    console.error("Error en Gemini Parser:", error);
    return Response.json({
      data: {},
      success: false,
      message: `No pudimos estructurar el CV: ${error.message || 'Error desconocido'}. Por favor, completa el formulario manualmente.`
    })
  }
}
