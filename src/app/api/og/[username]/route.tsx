import { ImageResponse } from 'next/og';
import { getPublicResumeAction } from '@/app/actions/get-public-cv';

export const runtime = 'edge';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  
  try {
    const resume = await getPublicResumeAction(username);
    
    if (!resume) {
      return new Response('Not found', { status: 404 });
    }

    const cv = resume.jsonResume as any;
    const { name, label, image } = cv?.basics || {};
    const { tituloHabilitante, isVerified, provincia } = cv?.meta?.docente || {};

    return new ImageResponse(
      (
        <div
          style={{
            background: '#3C3489',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            padding: '60px',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          {/* Foto de perfil */}
          <div
            style={{
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '8px solid #5DCAA5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#534AB7',
              flexShrink: 0,
            }}
          >
            {image ? (
              <img
                src={image}
                alt={name || ''}
                width={280}
                height={280}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                }}
              />
            ) : (
              <div
                style={{
                  fontSize: '80px',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                {(name?.[0] || '?').toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
            }}
          >
            <div
              style={{
                color: '#fff',
                fontSize: '56px',
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {name || 'Docente'}
            </div>

            {isVerified && (
              <div
                style={{
                  color: '#5DCAA5',
                  fontSize: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>✓</span>
                <span>Perfil verificado DocenteLink</span>
              </div>
            )}

            <div
              style={{
                color: '#AFA9EC',
                fontSize: '32px',
                marginTop: '8px',
              }}
            >
              {tituloHabilitante || label || 'Docente Profesional'}
            </div>

            {provincia && (
              <div
                style={{
                  color: '#7F77DD',
                  fontSize: '24px',
                }}
              >
                📍 {provincia}
              </div>
            )}

            <div
              style={{
                position: 'absolute',
                bottom: '40px',
                right: '60px',
                color: '#7F77DD',
                fontSize: '20px',
              }}
            >
              docentelink.ar/cv/{username}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
