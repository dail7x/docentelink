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
  cursos: z.array(z.object({
    nombre:      z.string().optional().nullable().default(""),
    institucion: z.string().optional().nullable().default(""),
  })).default([]),
})

const PROMPT = `Sos un asistente veloz especializado en extraer información de currículums.
Analizá si el texto corresponde a un perfil docente o educacional (campo "es_cv_docente"). Si no lo es, dejá un aviso en "observaciones".
IMPORTANTE: NO REESCRIBAS NI ADAPTES LA INFORMACIÓN. Extraé los datos EXACTAMENTE como aparecen en el texto original.
Mapea la información estrictamente con estos nombres de llaves JSON:
- "nombre", "email", y "telefono": Datos personales.
- "experiencia": Array (institucion, cargo, desde, hasta, descripcion).
- "formacion": SOLO formación académica formal (Universitaria, Terciaria, Profesorados que otorguen TÍTULO). Cada objeto DEBE tener "institucion", "titulo" y "anio". Si no tiene año o es un curso corto, NO lo pongas acá.
- "cursos": Cursos, talleres, diplomaturas o certificaciones complementarias. Mapeá a "nombre" e "institucion".
Devolvé ÚNICAMENTE un JSON válido. NO inventes datos ni parafrasees. Usá null en lugar de omitir campos.
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
