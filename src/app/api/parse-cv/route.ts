import { z } from 'zod';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

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
});

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

Devolvé ÚNICAMENTE un JSON válido. NO inventes datos excepto para el campo "resumen" si falta. Usá null en lugar de omitir campos si no encuentras datos.
`;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY no configurada");
    }

    // Usamos DeepSeek Chat (v3) vía OpenRouter, que es muy económico/gratuito según créditos
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://docentelink.ar",
        "X-Title": "DocenteLink Parser",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat", 
        messages: [
          { role: "system", content: PROMPT },
          { role: "user", content: `Texto del CV:\n${text}` }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Error de OpenRouter:", data);
      throw new Error(data.error?.message || "Error en OpenRouter");
    }

    const content = data.choices[0].message.content;
    const parsed = ParsedCVSchema.parse(JSON.parse(content));
    
    return Response.json({ data: parsed, success: true });

  } catch (error: any) {
    console.error("Error en Parser (DeepSeek/OpenRouter):", error);
    return Response.json({
      data: {},
      success: false,
      message: `No pudimos estructurar el CV: ${error.message || 'Error desconocido'}. Por favor, completa el formulario manualmente.`
    });
  }
}
