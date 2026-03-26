import React from 'react';
import { getPublicResumeAction } from '@/app/actions/get-public-cv';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { 
  Mail, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Award, 
  User as UserIcon,
  MapPin,
  Quote,
  EyeOff,
  Share2
} from 'lucide-react';
import Image from 'next/image';
import { syncClerkUserWithDb } from '@/lib/user';
import { getThemeColors, getPhotoShapeClass, DEFAULT_THEME, DEFAULT_PHOTO_SHAPE, DEFAULT_PHOTO_BORDER } from '@/lib/themes';
import { ThemeSelector } from '@/components/cv/ThemeSelector';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}): Promise<Metadata> {
  const { username } = await params;
  
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;

  try {
    const resume = await getPublicResumeAction(username);
    
    if (!resume || !resume.isPublic) {
      return {
        title: 'Perfil no disponible | DocenteLink',
      };
    }

    const jsonResume = resume.jsonResume as any;
    const name = jsonResume?.basics?.name || 'Docente';
    const titulo = jsonResume?.meta?.docente?.tituloHabilitante || 'Docente Profesional';
    const provincia = jsonResume?.meta?.docente?.provincia || '';

    // Use the captured static image from UploadThing if present
    // Fallback to dynamic if not (though static is preferred)
    const ogImage = resume.ogImageUrl || `${baseUrl}/api/og/${username}`;

    return {
      title: `${name} — ${titulo} | DocenteLink`,
      description: `Perfil profesional de ${name}, ${titulo}${provincia ? ` en ${provincia}` : ''}. Conectá con docentes calificados en DocenteLink.`,
      openGraph: {
        title: `${name} — ${titulo}`,
        description: `Perfil profesional de ${name}, ${titulo}${provincia ? ` en ${provincia}` : ''}.`,
        url: `${baseUrl}/cv/${username}`,
        siteName: 'DocenteLink',
        images: [{ 
          url: ogImage,
          secureUrl: ogImage,
          width: 1200,
          height: 630,
          alt: `${name} — ${titulo}`,
          type: 'image/jpeg',
        }],
        locale: 'es_AR',
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${name} — ${titulo}`,
        description: `Perfil profesional de ${name}`,
        images: [ogImage],
      },
    };
  } catch (error) {
    return {
      title: 'Perfil Docente | DocenteLink',
    };
  }
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr || dateStr === 'actual' || dateStr === '') return 'Actualidad';
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const [year, month] = dateStr.split('-');
  const m = parseInt(month, 10);
  if (year && m >= 1 && m <= 12) return `${months[m-1]} ${year}`;
  if (year) return year;
  return dateStr;
}

export default async function PublicCVPage({ params }: { params: Promise<{ username: string }> }) {
  const unwrappedParams = await params;
  const username = unwrappedParams?.username;

  if (!username) notFound();

  const resume = await getPublicResumeAction(username);
  if (!resume) notFound();

  const jsonResume = resume.jsonResume as any;
  const basics = jsonResume?.basics || {};
  const metaDocente = jsonResume?.meta?.docente || {};
  
  const isPublic = resume.isPublic ?? false;
  const hiddenUntil = metaDocente.hiddenUntil ? new Date(metaDocente.hiddenUntil) : null;
  const isHiddenTemporarily = hiddenUntil && hiddenUntil > new Date();
  const isActuallyPublic = isPublic && !isHiddenTemporarily;

  const user = await syncClerkUserWithDb().catch(() => null);
  const isOwner = user?.id === resume.userId;

  if (!isActuallyPublic && !isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--dl-primary-bg, #f8fafc)' }}>
         <div className="max-w-md w-full text-center space-y-4 p-10 rounded-3xl shadow-lg" style={{ backgroundColor: '#fff', borderColor: 'var(--dl-primary-light, #cbd5e1)' }}>
            <EyeOff className="w-12 h-12 mx-auto mb-2 opacity-50" style={{ color: 'var(--dl-muted, #64748b)' }} />
            <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--dl-primary-dark, #1e293b)' }}>Perfil no disponible</h1>
            <p className="text-sm font-bold leading-relaxed" style={{ color: 'var(--dl-muted, #64748b)' }}>Este perfil docente está oculto temporalmente o ha sido desactivado por su autor.</p>
         </div>
      </div>
    );
  }

  const nombre = basics.name || "Perfil Docente";
  const email = basics.email;
  const telefono = basics.phone;
  const foto = basics.image;
  const profesion = basics.label || metaDocente.tituloHabilitante || "Docente";
  
  const localidades = metaDocente.localidades || (metaDocente.localidad ? [metaDocente.localidad] : []);
  const provincia = metaDocente.provincia || basics.location?.region;

  const experiencia = jsonResume?.work || [];
  const formacion = jsonResume?.education || [];
  const cursos = metaDocente.cursos || [];
  const resumenIA = metaDocente.resumen || "";
  const mostrarResumenPublico = metaDocente.mostrarResumenPublico ?? true;
  const mostrarTelPublico = metaDocente.mostrarTelPublico ?? false;

  const themeId = (resume as any).theme || DEFAULT_THEME;
  const photoShapeId = (resume as any).photoShape || DEFAULT_PHOTO_SHAPE;
  const photoBorderEnabled = (resume as any).photoBorder ?? DEFAULT_PHOTO_BORDER;
  const themeColors = getThemeColors(themeId);
  const photoShapeClass = getPhotoShapeClass(photoShapeId);

  return (
    <div 
      className="min-h-screen pt-24 pb-20 px-4 md:px-6"
      style={{ backgroundColor: themeColors.bg }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --dl-primary: ${themeColors.primary};
          --dl-primary-dark: ${themeColors.primaryDark};
          --dl-primary-light: ${themeColors.primaryLight};
          --dl-accent: ${themeColors.accent};
          --dl-accent-mid: ${themeColors.accentMid};
          --dl-primary-bg: ${themeColors.bg};
          --dl-primary-bg-alt: ${themeColors.bgAlt};
          --dl-muted: ${themeColors.muted};
          --dl-primary-border: ${themeColors.border};
        }
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .shadow-lg, .shadow-md { box-shadow: none !important; }
          .rounded-3xl, .rounded-2xl, .rounded-xl { border-radius: 8px !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .fixed { display: none !important; }
        }
      `}} />
      
      <div className="max-w-[820px] mx-auto space-y-4">
        {isOwner && (
          <ThemeSelector
            resumeId={resume.id}
            initialTheme={themeId}
            initialPhotoShape={photoShapeId}
            initialPhotoBorder={photoBorderEnabled}
          />
        )}
        
        {!isActuallyPublic && isOwner && (
          <div className="mb-4 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-widest text-center py-3 px-4 rounded-xl border border-amber-200 shadow-sm animate-pulse">
            Ojo: Estás viendo tu perfil en modo oculto. Nadie más puede verlo en este momento.
          </div>
        )}

        <header className="rounded-3xl overflow-hidden shadow-lg" style={{ backgroundColor: '#fff', border: '1px solid var(--dl-primary-light)', borderColor: 'color-mix(in srgb, var(--dl-primary) 15%, transparent)' }}>
          
          <div className="flex items-start gap-8 p-8 md:p-10">
            
            <div 
              data-profile-photo
              className={`shrink-0 w-28 h-28 md:w-36 md:h-36 overflow-hidden border-4 relative ${photoShapeClass} ${photoBorderEnabled ? 'ring-4 ring-[var(--dl-accent)]' : ''}`}
              style={{ backgroundColor: 'var(--dl-primary-bg)', borderColor: 'var(--dl-primary-light)' }}
            >
              {foto ? (
                <Image 
                  src={foto} 
                  alt={nombre} 
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              ) : (
                <UserIcon className="w-12 h-12 opacity-20 absolute inset-0 m-auto" style={{ color: 'var(--dl-muted)' }} />
              )}
            </div>

            <div className="flex-1 min-w-0 pt-1 space-y-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight" style={{ color: 'var(--dl-primary-dark)' }}>
                {nombre}
              </h1>
              <p className="text-base font-bold leading-snug" style={{ color: 'var(--dl-accent)' }}>
                {profesion}
              </p>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                {provincia && (
                  <span className="text-[9px] font-black uppercase tracking-widest italic px-2 py-1 rounded-md" style={{ color: 'var(--dl-muted)', backgroundColor: 'var(--dl-primary-bg)' }}>
                    {provincia}
                  </span>
                )}
                {localidades.map((loc: string) => (
                  <span key={loc} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tight px-2 py-1 rounded-full shadow-sm" style={{ color: 'var(--dl-primary-dark)', backgroundColor: '#fff', border: '1px solid color-mix(in srgb, var(--dl-primary) 15%, transparent)' }}>
                    <MapPin className="w-2.5 h-2.5 shrink-0" style={{ color: 'var(--dl-accent)' }} />
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {mostrarResumenPublico && resumenIA && (
            <div className="px-8 md:px-10 pb-4 pt-1">
              <div className="flex items-start gap-3">
                <Quote className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--dl-accent)', opacity: 0.3 }} />
                <p className="text-sm font-medium leading-relaxed italic text-justify" style={{ color: 'var(--dl-primary-dark)', opacity: 0.75 }}>
                  {resumenIA}
                </p>
              </div>
            </div>
          )}

          <div className={`px-8 md:px-10 pb-7 flex flex-wrap justify-center gap-3 print:hidden ${mostrarResumenPublico && resumenIA ? 'pt-0' : 'pt-5'}`}>
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all" style={{ backgroundColor: 'var(--dl-primary-bg)', color: 'var(--dl-primary-dark)', border: '1px solid color-mix(in srgb, var(--dl-primary) 10%, transparent)' }}>
                <Mail className="w-3.5 h-3.5" /> {email}
              </a>
            )}
            {mostrarTelPublico && telefono && (
              <a href={`https://wa.me/${telefono.replace(/\+/g, '').replace(/\s/g, '')}`} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all" style={{ backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                <Phone className="w-3.5 h-3.5" /> Contactar
              </a>
            )}
            {/* Share profile button */}
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Te comparto mi perfil profesional docente en DocenteLink: https://docentelink.ar/cv/${username}`)}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all bg-[#25D366] text-white hover:bg-[#128C7E] shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" /> Compartir
            </a>
          </div>
          <div className="hidden print:block px-10 pb-6 text-xs font-bold space-y-1" style={{ color: 'var(--dl-muted)' }}>
            {email && <p>Email: {email}</p>}
            {telefono && <p>Tel: {telefono}</p>}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mt-6">
           
          <div className="md:col-span-4 space-y-6 order-last md:order-first">
            {formacion.length > 0 && (
              <section className="rounded-3xl p-7 shadow-md" style={{ backgroundColor: '#fff', border: '1px solid color-mix(in srgb, var(--dl-primary) 5%, transparent)' }}>
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2 group-hover:transition-colors" style={{ color: 'var(--dl-primary-dark)' }}>
                  <GraduationCap className="w-4 h-4" style={{ color: 'var(--dl-accent)' }} /> Formación
                </h2>
                <div className="space-y-5">
                  {formacion.map((edu: any, i: number) => (
                    <div key={i} className="space-y-0.5 group">
                      <p className="text-sm font-black leading-tight transition-colors group-hover:text-dl-accent" style={{ color: 'var(--dl-primary-dark)' }}>{edu.area || edu.titulo || edu.degree}</p>
                      <p className="text-[10px] font-bold uppercase tracking-tight leading-snug" style={{ color: 'var(--dl-muted)' }}>{edu.institution || edu.institucion}</p>
                      {(edu.year || edu.anio || edu.endDate) && (
                        <p className="text-[10px] font-black transition-colors group-hover:text-dl-accent" style={{ color: 'var(--dl-accent)' }}>{edu.year || edu.anio || edu.endDate}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {cursos.length > 0 && (
              <section className="rounded-3xl p-7 shadow-md" style={{ backgroundColor: 'var(--dl-primary-dark)', color: '#fff' }}>
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2" style={{ color: 'var(--dl-accent)' }}>
                  <Award className="w-4 h-4" /> Cursos
                </h2>
                <div className="space-y-4">
                  {cursos.map((c: any, i: number) => (
                    <div key={i} className="border-l-2 pl-3" style={{ borderColor: 'var(--dl-accent)', opacity: 0.4 }}>
                      <p className="text-[10px] font-black uppercase leading-snug" style={{ color: '#fff' }}>{c.nombre}</p>
                      <p className="text-[9px] font-bold mt-1 uppercase leading-tight break-words whitespace-normal" style={{ color: 'var(--dl-primary-light)', opacity: 0.8 }}>
                        {c.institucion}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="md:col-span-8 space-y-6">
            {experiencia.length > 0 && (
              <section className="rounded-3xl p-7 md:p-9 shadow-md" style={{ backgroundColor: '#fff', border: '1px solid color-mix(in srgb, var(--dl-primary) 10%, transparent)' }}>
                <h2 className="text-lg font-black mb-7 flex items-center gap-3" style={{ color: 'var(--dl-primary-dark)' }}>
                  Trayectoria Docente
                  <Briefcase className="w-5 h-5" style={{ color: 'var(--dl-accent)', opacity: 0.3 }} />
                </h2>

                <div className="space-y-8 relative">
                  <div className="absolute left-0 top-2 bottom-0 w-0.5 rounded-full hidden md:block" style={{ backgroundColor: 'var(--dl-primary-bg)' }} />

                  {experiencia.map((exp: any, i: number) => {
                    const desde = formatDate(exp.startDate || exp.desde);
                    const hasta = formatDate(exp.endDate || exp.hasta);
                    return (
                      <div key={i} className="relative md:pl-7 group">
                        <div className="absolute left-[-3.5px] top-2 w-2 h-2 rounded-full border-2 transition-all hidden md:block z-10" style={{ backgroundColor: 'var(--dl-primary-bg)', borderColor: '#fff' }} />
                        
                        <div className="space-y-2">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-1">
                            <h3 className="text-base font-black leading-tight transition-colors group-hover:text-dl-accent" style={{ color: 'var(--dl-primary-dark)' }}>
                              {exp.position || exp.cargo}
                            </h3>
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md w-fit transition-colors group-hover:text-dl-accent" style={{ color: 'var(--dl-accent)', backgroundColor: 'color-mix(in srgb, var(--dl-accent) 5%, transparent)' }}>
                              {desde} — {hasta}
                            </span>
                          </div>
                          
                          <p className="text-[10px] font-bold uppercase tracking-tight transition-colors group-hover:text-dl-accent" style={{ color: 'var(--dl-muted)' }}>
                            {exp.name || exp.institucion}
                          </p>

                          {(exp.summary || exp.descripcion) && (
                            <div className="p-4 rounded-xl mt-2" style={{ backgroundColor: 'color-mix(in srgb, var(--dl-primary-bg) 30%, transparent)', borderLeft: '2px solid color-mix(in srgb, var(--dl-primary) 20%, transparent)' }}>
                              <p className="text-xs font-medium leading-relaxed italic" style={{ color: 'var(--dl-primary-dark)', opacity: 0.7 }}>
                                &ldquo;{exp.summary || exp.descripcion}&rdquo;
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>

        <footer className="text-center pt-8" style={{ color: 'var(--dl-muted)', opacity: 0.5 }}>
          <p className="text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
            Perfil verificado en <span style={{ color: 'var(--dl-accent)' }}>docentelink.ar</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
