'use server';

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

const PROMPT = `Sos un experto en extracción de datos para CVs de docentes argentinos.
Tu misión es leer el texto de un CV y devolver un JSON con la estructura exacta detallada abajo.

REGLAS DE ORO:
1. ORDEN CRONOLÓGICO INVERSO: La lista de "experiencia" DEBE estar ordenada de la más RECIENTE a la más ANTIGUA.
2. FORMATEO DE NOMBRES: El campo "nombre" debe estar en CAPITAL CASE (Ej: "Juan Pérez"). No uses todo minúsculas ni todo mayúsculas.
3. MAX_CHARACTERS (RESUMEN): El campo "resumen" DEBE tener un máximo de 380 caracteres. Sé conciso, profesional y cálido (en primera persona).
4. PERSONAL DATA: Extraé el "nombre", "email" y "telefono" sin falta.
5. DATES (EXPERIENCIA): Formato "YYYY-MM" (ej: "2018-03"). Si es trabajo actual, "hasta" es null.
6. NO INVENTAR: Si un dato no está, devolvé null.

ESTRUCTURA JSON:
{
  "nombre": string | null,
  "email": string | null,
  "telefono": string | null,
  "resumen": string | null,
  "tituloHabilitante": string | null,
  "experiencia": [{"institucion", "cargo", "desde", "hasta", "descripcion"}],
  "formacion": [{"titulo", "institucion", "anio"}],
  "cursos": [{"nombre", "institucion"}]
}

Devolvé ÚNICAMENTE el JSON.`;

export type ParsedCvData = z.infer<typeof ParsedCVSchema>;

export async function parseCvFromText(text: string): Promise<{
  success: boolean;
  data?: ParsedCvData;
  message?: string;
}> {
  try {
    if (!text || text.trim().length < 50) {
      return { success: false, message: 'El texto es demasiado corto para analizar' };
    }

    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY no configurada");
    }

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
          { role: "user", content: `Texto del CV extraído:\n${text}` }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2500,
        temperature: 0.1
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Error en OpenRouter");

    const content = data.choices[0].message.content;
    const rawParsed = JSON.parse(content);

    // Normalizar nombre: Capital Case
    if (rawParsed.nombre) {
      rawParsed.nombre = rawParsed.nombre
        .split(' ')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }

    // Safety Crop Resumen
    if (rawParsed.resumen && rawParsed.resumen.length > 400) {
      rawParsed.resumen = rawParsed.resumen.substring(0, 397) + "...";
    }

    const parsed = ParsedCVSchema.parse(rawParsed);

    return {
      success: true,
      data: parsed
    };
  } catch (error) {
    console.error('Error parsing CV:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error al procesar el CV con IA'
    };
  }
}
