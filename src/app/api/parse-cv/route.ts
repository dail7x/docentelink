import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
})

const ParsedCVSchema = z.object({
  es_cv_docente:     z.boolean().optional().nullable().default(true),
  observaciones:     z.string().optional().nullable(),
  nombre:            z.string().optional().nullable(),
  email:             z.string().optional().nullable(),
  telefono:          z.string().optional().nullable(),
  tituloHabilitante: z.string().optional().nullable(),
  experiencia: z.array(z.object({
    institucion:  z.string().optional().nullable().default(""),
    cargo:        z.string().optional().nullable().default(""),
    desde:        z.string().optional().nullable(),
    hasta:        z.string().optional().nullable(),
    descripcion:  z.string().optional().nullable(),
  })).default([]),
  formacion: z.array(z.object({
    titulo:      z.string().optional().nullable().default(""),
    institucion: z.string().optional().nullable().default(""),
    anio:        z.union([z.string(), z.number()]).transform(val => String(val)).optional().nullable(),
  })).default([]),
})

const PROMPT = `Sos un asistente veloz especializado en extraer información de currículums.
Analizá si el texto corresponde a un perfil docente o educacional (campo "es_cv_docente"). Si no lo es, dejá un aviso en "observaciones".
IMPORTANTE: NO REESCRIBAS NI ADAPTES LA INFORMACIÓN. Extraé los datos EXACTAMENTE como aparecen en el texto original, sin importar el rubro (IT, Marketing, etc). 
Mapea la información estrictamente con estos nombres de llaves JSON:
- Extraé siempre los datos personales: "nombre", "email", y "telefono". No los dejes vacíos si existen en el texto.
- "experiencia": Array donde mapearás la "Empresa" al campo "institucion" (usá el nombre literal de la empresa), el "Puesto" al campo "cargo" (USÁ EL TÍTULO LITERAL DEL PUESTO, NO LO CAMBIES), la fecha de inicio al campo "desde" y la de fin al campo "hasta". Extraé también todo el detalle de tareas/responsabilidades en el campo "descripcion" TAL CUAL aparezcan.
- "formacion": Array para estudios universitarios/cursos. Cada objeto DEBE tener las llaves "institucion", "titulo" y "anio" (NO uses "educacion" ni "fecha_obtencion").
Devolvé ÚNICAMENTE un JSON válido. NO inventes datos ni parafrasees. Usá null en lugar de omitir campos.

Texto del CV:\n`

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    
    const result = await model.generateContent(PROMPT + text)
    const rawResponse = result.response.text();
    console.log("Respuesta raw de Gemini:", rawResponse);

    // Limpiamos la respuesta y extraemos lo que parece un JSON si hay basura alrededor
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
