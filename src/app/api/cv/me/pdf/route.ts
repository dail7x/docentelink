import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/db';
import { resumes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { JsonResume } from '@/db/schema';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session.userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const db = getDb();

    // Obtener el CV del usuario logueado
    const resume = await db.query.resumes.findFirst({
      where: eq(resumes.userId, session.userId),
    });

    if (!resume) {
      return NextResponse.json(
        { error: 'No tienes un CV creado' },
        { status: 404 }
      );
    }

    // Importar dinámicamente para evitar problemas de bundling
    const [{ renderToBuffer }, { CvPdfTemplate }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('@/components/pdf/CvPdfTemplate'),
    ]);

    const cv = resume.jsonResume as JsonResume;
    const username = resume.username;

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
