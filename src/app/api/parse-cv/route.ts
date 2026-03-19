import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: { responseMimeType: 'application/json' },
})

const ParsedCVSchema = z.object({
  nombre:            z.string().optional().nullable(),
  email:             z.string().email().optional().nullable(),
  telefono:          z.string().optional().nullable(),
  tituloHabilitante: z.string().optional().nullable(),
  experiencia: z.array(z.object({
    institucion:  z.string(),
    cargo:        z.string(),
    desde:        z.string().optional().nullable(),
    hasta:        z.string().optional().nullable(),
    descripcion:  z.string().optional().nullable(),
  })).default([]),
  formacion: z.array(z.object({
    titulo:      z.string(),
    institucion: z.string(),
    anio:        z.string().optional().nullable(),
  })).default([]),
})

const PROMPT = `Sos un asistente especializado en CVs de docentes argentinos.
Extraé los datos del siguiente texto y devolvé ÚNICAMENTE un JSON válido que siga la estructura solicitada.
No inventes datos ausentes. Usá null u omití campos no encontrados.

Texto del CV:\n`

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    
    if (!text || text.length < 10) {
      return Response.json({ success: false, message: 'Texto insuficiente para procesar.' })
    }

    const result = await model.generateContent(PROMPT + text)
    const rawResponse = result.response.text();
    
    // Parseamos con Zod para asegurar la integridad de la respuesta
    const parsed = ParsedCVSchema.parse(JSON.parse(rawResponse))
    
    return Response.json({ data: parsed, success: true })
  } catch (error) {
    console.error("Error en Gemini Parser:", error);
    return Response.json({ 
      data: {}, 
      success: false, 
      message: 'No pudimos estructurar el CV. Por favor, completa el formulario manualmente.' 
    })
  }
}
