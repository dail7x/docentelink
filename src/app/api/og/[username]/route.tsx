import { ImageResponse } from 'next/og';
import { getPublicResumeAction } from '@/app/actions/get-public-cv';

export const dynamic = 'force-dynamic';

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
    const { tituloHabilitante, isVerified, provincia, materias } = cv?.meta?.docente || {};

    // Colores del nuevo diseño
    const COLORS = {
      limeGreen: '#84cc16',
      tealDark: '#134e4a',
      darkBg1: '#0f172a',
      darkBg2: '#020617',
      white: '#ffffff',
      whiteMuted: '#94a3b8',
      borderDark: '#1e293b',
    };

    // Extraer materias para pills
    const materiasArray = materias || [];
    const displayMaterias = materiasArray.slice(0, 5);

    return new ImageResponse(
      (
        <div
          style={{
            background: `linear-gradient(145deg, ${COLORS.darkBg1} 0%, ${COLORS.darkBg2} 100%)`,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '24px',
            overflow: 'hidden',
          }}
        >
          {/* ÁREA PRINCIPAL */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '60px 70px',
              gap: '60px',
            }}
          >
            {/* FOTO CON DOBLE BORDE */}
            <div
              style={{
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: COLORS.darkBg2,
                flexShrink: 0,
                position: 'relative',
                boxShadow: `0 0 0 12px ${COLORS.borderDark}, 0 0 0 16px ${COLORS.limeGreen}, 0 20px 60px rgba(0,0,0,0.5)`,
              }}
            >
              {image ? (
                <img
                  src={image}
                  alt={name || ''}
                  width={320}
                  height={320}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: '120px',
                    color: 'rgba(255,255,255,0.2)',
                    fontWeight: 700,
                  }}
                >
                  {(name?.[0] || 'D').toUpperCase()}
                </div>
              )}
            </div>

            {/* INFORMACIÓN */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                flex: 1,
              }}
            >
              {/* NOMBRE */}
              <div
                style={{
                  color: COLORS.white,
                  fontSize: '64px',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                {name || 'Docente'}
              </div>

              {/* TÍTULO */}
              <div
                style={{
                  color: COLORS.whiteMuted,
                  fontSize: '28px',
                  fontWeight: 400,
                  marginTop: '4px',
                }}
              >
                {tituloHabilitante || label || 'Docente Profesional'}
              </div>

              {/* ESPECIALIDAD DESTACADA */}
              {displayMaterias[0] && (
                <div
                  style={{
                    color: COLORS.limeGreen,
                    fontSize: '28px',
                    fontWeight: 600,
                  }}
                >
                  {displayMaterias[0]}
                </div>
              )}

              {/* UBICACIÓN */}
              {provincia && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: COLORS.limeGreen,
                    }}
                  />
                  <span
                    style={{
                      color: COLORS.whiteMuted,
                      fontSize: '20px',
                      fontWeight: 400,
                    }}
                  >
                    {provincia} · Argentina
                  </span>
                </div>
              )}

              {/* VERIFICADO */}
              {isVerified && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    padding: '8px 16px',
                    backgroundColor: `${COLORS.limeGreen}15`,
                    borderRadius: '8px',
                    alignSelf: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: COLORS.limeGreen,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: COLORS.darkBg2,
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      color: COLORS.limeGreen,
                      fontSize: '16px',
                      fontWeight: 600,
                    }}
                  >
                    Perfil verificado
                  </span>
                </div>
              )}

              {/* PASTILLAS DE ESPECIALIDADES */}
              {displayMaterias.length > 1 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginTop: '16px',
                  }}
                >
                  {displayMaterias.slice(1).map((materia: string, index: number) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: COLORS.tealDark,
                        color: COLORS.white,
                        fontSize: '13px',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        padding: '8px 16px',
                        borderRadius: '9999px',
                        border: '1px solid rgba(45, 212, 191, 0.3)',
                      }}
                    >
                      {materia}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px 70px',
              borderTop: `1px solid ${COLORS.borderDark}`,
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  backgroundColor: COLORS.white,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.darkBg2}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 17H7A5 5 0 0 1 7 7h2" />
                  <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
                  <line x1="8" x2="16" y1="12" y2="12" />
                </svg>
              </div>
              <span
                style={{
                  color: COLORS.white,
                  fontSize: '18px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                DocenteLink
              </span>
            </div>

            {/* URL */}
            <div
              style={{
                color: COLORS.whiteMuted,
                fontSize: '16px',
                fontWeight: 300,
                letterSpacing: '0.02em',
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
