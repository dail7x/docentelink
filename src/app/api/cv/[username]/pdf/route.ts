import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    // Importar dinámicamente para evitar problemas de bundling
    const [{ renderToBuffer }, { getPublicResumeAction }, { CvPdfTemplate }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('@/app/actions/get-public-cv'),
      import('@/components/pdf/CvPdfTemplate'),
    ]);

    // Obtener el CV
    const resume = await getPublicResumeAction(username);

    if (!resume) {
      return NextResponse.json(
        { error: 'CV no encontrado' },
        { status: 404 }
      );
    }

    const cv = resume.jsonResume as any;

    // Verificar si el perfil es público
    const isPublic = resume.isPublic ?? false;
    if (!isPublic && !request.headers.get('x-internal-request')) {
      return NextResponse.json(
        { error: 'Este perfil es privado' },
        { status: 403 }
      );
    }

    // TODO: Verificar plan del usuario para quitar watermark
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
      `inline; filename="CV-${cv?.basics?.name?.replace(/\s+/g, '-') || username}.pdf"`
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
