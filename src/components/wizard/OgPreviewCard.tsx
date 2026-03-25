'use client';

import React from 'react';

interface OgPreviewProps {
  name: string;
  title: string;
  province: string;
  image?: string | null;
  isVerified?: boolean;
  // Nuevas props opcionales para el diseño extendido
  especialidadDestacada?: string;
  especialidadesPills?: string[];
  aliasPerfil?: string;
}

export function OgPreviewCard({
  name,
  title,
  province,
  image,
  isVerified = false,
  especialidadDestacada,
  especialidadesPills = [],
  aliasPerfil
}: OgPreviewProps) {
  // Colores del diseño
  const COLORS = {
    limeGreen: '#84cc16', // verde lima brillante
    limeDark: '#65a30d',
    tealDark: '#134e4a', // verde azulado oscuro para pills
    tealLight: '#2dd4bf',
    darkBg1: '#0f172a', // azul marino profundo casi negro
    darkBg2: '#020617', // negro puro
    white: '#ffffff',
    whiteMuted: '#94a3b8',
    borderDark: '#1e293b',
  };

  // Extraer ciudad de la provincia o usar el valor completo
  const ciudadDisplay = province || 'Ciudad';

  return (
    <div
      id="og-preview-card"
      style={{
        width: '1200px',
        height: '630px',
        background: `linear-gradient(145deg, ${COLORS.darkBg1} 0%, ${COLORS.darkBg2} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '24px',
      }}
    >
      {/* ÁREA PRINCIPAL DE CONTENIDO */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '60px 70px',
        gap: '60px',
      }}>
        {/* COLUMNA IZQUIERDA - FOTO */}
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
            // Doble borde: exterior oscuro grueso + interior verde lima
            boxShadow: `
              0 0 0 12px ${COLORS.borderDark},
              0 0 0 16px ${COLORS.limeGreen},
              0 20px 60px rgba(0,0,0,0.5)
            `,
          }}
        >
          {image ? (
            <img
              src={image}
              alt={name || 'Docente'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
            />
          ) : (
            <div style={{
              fontSize: '120px',
              color: 'rgba(255,255,255,0.2)',
              fontWeight: 700,
            }}>
              {(name?.[0] || 'D').toUpperCase()}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA - INFORMACIÓN */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          flex: 1,
        }}>
          {/* NOMBRE COMPLETO */}
          <div style={{
            color: COLORS.white,
            fontSize: '64px',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            {name || 'Nombre del Docente'}
          </div>

          {/* TÍTULO PROFESIONAL */}
          <div style={{
            color: COLORS.whiteMuted,
            fontSize: '28px',
            fontWeight: 400,
            marginTop: '8px',
          }}>
            {title || 'Título Profesional'}
          </div>

          {/* ESPECIALIDAD DESTACADA - verde lima brillante */}
          {especialidadDestacada && (
            <div style={{
              color: COLORS.limeGreen,
              fontSize: '28px',
              fontWeight: 600,
              marginTop: '4px',
            }}>
              {especialidadDestacada}
            </div>
          )}

          {/* UBICACIÓN */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '8px',
          }}>
            {/* Punto verde lima */}
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: COLORS.limeGreen,
              flexShrink: 0,
            }} />
            <span style={{
              color: COLORS.whiteMuted,
              fontSize: '20px',
              fontWeight: 400,
            }}>
              {ciudadDisplay} · Argentina
            </span>
          </div>

          {/* PASTILLAS DE ESPECIALIDADES */}
          {especialidadesPills.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '16px',
            }}>
              {especialidadesPills.slice(0, 6).map((pill, index) => (
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
                    border: `1px solid ${COLORS.tealLight}30`,
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          )}

          {/* Badge verificado (si aplica) */}
          {isVerified && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: `${COLORS.limeGreen}15`,
              borderRadius: '8px',
              alignSelf: 'flex-start',
            }}>
              <span style={{
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
              }}>✓</span>
              <span style={{
                color: COLORS.limeGreen,
                fontSize: '16px',
                fontWeight: 600,
              }}>
                Perfil verificado
              </span>
            </div>
          )}
        </div>
      </div>

      {/* BARRA INFERIOR DE MARCA (FOOTER) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 70px',
        borderTop: `1px solid ${COLORS.borderDark}`,
        backgroundColor: 'rgba(0,0,0,0.2)',
      }}>
        {/* Lado izquierdo - Logo/Icono + DocenteLink */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          {/* Icono cuadrado de marca */}
          <div style={{
            width: '28px',
            height: '28px',
            backgroundColor: COLORS.white,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
              <path d="M9 17H7A5 5 0 0 1 7 7h2"/>
              <path d="M15 7h2a5 5 0 1 1 0 10h-2"/>
              <line x1="8" x2="16" y1="12" y2="12"/>
            </svg>
          </div>
          <span style={{
            color: COLORS.white,
            fontSize: '18px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}>
            DocenteLink
          </span>
        </div>

        {/* Lado derecho - URL del perfil */}
        <div style={{
          color: COLORS.whiteMuted,
          fontSize: '16px',
          fontWeight: 300,
          letterSpacing: '0.02em',
        }}>
          {aliasPerfil
            ? `docentelink.ar/cv/${aliasPerfil}`
            : 'docentelink.ar'
          }
        </div>
      </div>
    </div>
  );
}
