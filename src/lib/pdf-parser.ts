import { extractText } from 'unpdf'

export async function extractPdfText(file: File): Promise<string> {
  if (file.size > 10 * 1024 * 1024) throw new Error('El PDF no puede superar 10MB')
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const { text } = await extractText(arrayBuffer, { mergePages: true });
    
    // Truncamos a 10000 caracteres (el Free Tier de Gemini soporta hasta 1 millón de tokens por request, así que esto no impactará negativamente).
    return text.slice(0, 10000);
  } catch (error) {
    console.error("Error al extraer texto del PDF:", error);
    throw new Error('No se pudo extraer texto del PDF. Por favor, intenta subir otro archivo o completa los datos manualmente.');
  }
}
