import { extractText, getResolvedPDFJS } from 'unpdf'

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

export async function extractPhotoFromPdf(file: File): Promise<Blob | null> {
  try {
    const pdfjs = await getResolvedPDFJS();
    // En el cliente, no usamos canvas ni dependencias del servidor
    if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
       pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    // Buscar en las primeras 2 páginas
    const pagesToCheck = Math.min(pdf.numPages, 2);
    let bestCandidate: { blob: Blob; area: number } | null = null;

    for (let pageNum = 1; pageNum <= pagesToCheck; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const operatorList = await page.getOperatorList();

      for (let i = 0; i < operatorList.fnArray.length; i++) {
        // OPS.paintImageXObject = 85
        if (operatorList.fnArray[i] !== pdfjs.OPS.paintImageXObject) continue

        const imgKey = operatorList.argsArray[i][0]

        // Obtener datos de la imagen del objeto de la página
        const img = await new Promise<any>((resolve) => {
          page.objs.get(imgKey, resolve)
        });

        if (!img?.data) continue;

        const { width, height } = img;
        const area = width * height;

        // Filtrar imágenes muy pequeñas (logos, iconos, decoración)
        if (width < 60 || height < 60) continue;

        // Preferir imágenes con proporción de retrato o cuadrada (fotos de perfil)
        const ratio = width / height;
        if (ratio > 2.5 || ratio < 0.3) continue; // descartar banners/franjas

        if (!bestCandidate || area > bestCandidate.area) {
          // Renderizar en OffscreenCanvas para obtener el Blob
          const canvas = new OffscreenCanvas(width, height);
          const ctx = canvas.getContext('2d')!;
          
          let imageData: ImageData;
          if (img.data.length === width * height * 4) { // RGBA
             imageData = new ImageData(new Uint8ClampedArray(img.data), width, height);
          } else if (img.data.length === width * height * 3) { // RGB -> RGBA conversion
             const rgbaArray = new Uint8ClampedArray(width * height * 4);
             for (let j = 0, k = 0; j < img.data.length; j += 3, k += 4) {
                rgbaArray[k] = img.data[j];
                rgbaArray[k+1] = img.data[j+1];
                rgbaArray[k+2] = img.data[j+2];
                rgbaArray[k+3] = 255; // Alpha
             }
             imageData = new ImageData(rgbaArray, width, height);
          } else {
             // Formato desconocido, tratar de procesar o skip
             continue;
          }
          
          ctx.putImageData(imageData, 0, 0);
          const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.92 });
          bestCandidate = { blob, area };
        }
      }
    }

    return bestCandidate?.blob ?? null;
  } catch (error) {
    console.error("Error al extraer foto del PDF:", error);
    return null; // Fallo silencioso para la foto, no bloquea el parseo de texto
  }
}
