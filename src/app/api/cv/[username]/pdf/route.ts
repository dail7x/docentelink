import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { getPublicCvAction } from '@/app/actions/get-public-cv';
import { CvPdfTemplate } from '@/components/pdf/CvPdfTemplate';

// Usar runtime de Node.js (no edge) para compatibilidad con @react-pdf/renderer
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    // Obtener el CV
    const result = await getPublicCvAction(username);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: 'CV no encontrado' },
        { status: 404 }
      );
    }

    const cv = result.data;

    // Verificar si el perfil es público
    if (!cv.meta?.docente?.isPublic && !request.headers.get('x-internal-request')) {
      return NextResponse.json(
        { error: 'Este perfil es privado' },
        { status: 403 }
      );
    }

    // TODO: Verificar plan del usuario para quitar watermark
    // Por ahora siempre mostramos watermark (plan free)
    const showWatermark = true;

    // Generar el PDF
    const pdfBuffer = await renderToBuffer(
      CvPdfTemplate({
        cv,
        username,
        showWatermark,
      })
    );

    // Configurar headers para descarga
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set(
      'Content-Disposition',
      `inline; filename="CV-${cv.basics?.name?.replace(/\s+/g, '-') || username}.pdf"`
    );

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Error al generar el PDF' },
      { status: 500 }
    );
  }
}
