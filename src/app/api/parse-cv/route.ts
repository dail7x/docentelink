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
    anio:        z.string().optional().nullable(),
  })).default([]),
})

const PROMPT = `Sos un asistente veloz especializado en extraer información de currículums.
Analizá si el texto corresponde a un perfil docente o relacionado a la educación (campo "es_cv_docente"). Si no lo es, dejá un breve aviso en "observaciones".
IMPORTANTE: AÚN SI NO ES UN CV DOCENTE, DEBÉS EXTRAER TODA LA INFORMACIÓN POSIBLE Y ADAPTARLA AL ESQUEMA:
- Mapeá el nombre de la "Empresa" o lugar de trabajo al campo "institucion" de la "experiencia".
- Mapeá el "Puesto" al campo "cargo" de la "experiencia".
- Para la educación y estudios, el array DEBE llamarse EXACTAMENTE "formacion" (NO "educacion"). Cada elemento debe tener: "institucion", "titulo", y "anio" (NO uses "fecha_obtencion").
Devolvé ÚNICAMENTE un JSON válido. No inventes datos. Usá null u omití campos no encontrados.

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
