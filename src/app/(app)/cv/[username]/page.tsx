import React from 'react';
import { getPublicResumeAction } from '@/app/actions/get-public-cv';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
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
  Download
} from 'lucide-react';
import Image from 'next/image';
import { syncClerkUserWithDb } from '@/lib/user';

// Format "YYYY-MM" → "Mar 2023" 
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}): Promise<Metadata> {
  const { username } = await params;
  
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

    return {
      title: `${name} — ${titulo} | DocenteLink`,
      description: `Perfil profesional de ${name}, ${titulo}${provincia ? ` en ${provincia}` : ''}. Conectá con docentes calificados en DocenteLink.`,
      openGraph: {
        title: `${name} — ${titulo}`,
        description: `Perfil profesional de ${name}, ${titulo}${provincia ? ` en ${provincia}` : ''}.`,
        images: [`/api/og/${username}`],
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${name} — ${titulo}`,
        description: `Perfil profesional de ${name}`,
        images: [`/api/og/${username}`],
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
  
  // Checking visibility status
  const isPublic = resume.isPublic ?? false;
  const hiddenUntil = metaDocente.hiddenUntil ? new Date(metaDocente.hiddenUntil) : null;
  const isHiddenTemporarily = hiddenUntil && hiddenUntil > new Date();
  const isActuallyPublic = isPublic && !isHiddenTemporarily;

  // Let owner bypass the visibility lock
  const user = await syncClerkUserWithDb().catch(() => null);
  const isOwner = user?.id === resume.userId;

  if (!isActuallyPublic && !isOwner) {
    return (
      <div className="min-h-screen bg-dl-primary-bg flex items-center justify-center p-6">
         <div className="max-w-md w-full text-center space-y-4 bg-white p-10 rounded-3xl shadow-lg border border-dl-primary-light/20">
            <EyeOff className="w-12 h-12 text-dl-muted mx-auto mb-2 opacity-50" />
            <h1 className="text-2xl font-black text-dl-primary-dark tracking-tight">Perfil no disponible</h1>
            <p className="text-dl-muted text-sm font-bold leading-relaxed">Este perfil docente está oculto temporalmente o ha sido desactivado por su autor.</p>
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
  const mostrarNivelesPublico = metaDocente.mostrarNivelesPublico ?? true;
  const mostrarTelPublico = metaDocente.mostrarTelPublico ?? false;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-24 pb-20 px-4 md:px-6">
      <div className="max-w-[820px] mx-auto space-y-6">
        
        {!isActuallyPublic && isOwner && (
          <div className="mb-4 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-widest text-center py-3 px-4 rounded-xl border border-amber-200 shadow-sm animate-pulse">
            Ojo: Estás viendo tu perfil en modo oculto. Nadie más puede verlo en este momento.
          </div>
        )}

        {/* Header Card */}
        <header className="bg-white rounded-3xl overflow-hidden shadow-lg border border-dl-primary-light/10">
          
          {/* Top band: photo + name + title */}
          <div className="flex items-start gap-8 p-8 md:p-10">
            
            {/* Foto — contained, no overflow */}
            <div className="shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-dl-primary-bg bg-dl-primary-bg relative">
              {foto ? (
                <Image 
                  src={foto} 
                  alt={nombre} 
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              ) : (
                <UserIcon className="w-12 h-12 text-dl-muted opacity-20 absolute inset-0 m-auto" />
              )}
            </div>

            {/* Name + title block */}
            <div className="flex-1 min-w-0 pt-1 space-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-dl-primary-dark tracking-tight leading-tight">
                {nombre}
              </h1>
              <p className="text-base font-bold text-dl-accent leading-snug">
                {profesion}
              </p>
              
              {/* Localidades pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {provincia && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-dl-muted italic bg-dl-primary-bg px-2 py-1 rounded-md">
                    {provincia}
                  </span>
                )}
                {localidades.map((loc: string) => (
                  <span key={loc} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tight text-dl-primary-dark bg-white border border-dl-primary-light/20 px-2 py-1 rounded-full shadow-sm">
                    <MapPin className="w-2.5 h-2.5 text-dl-accent shrink-0" />
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen — full width, minimal gap */}
          {mostrarResumenPublico && resumenIA && (
            <div className="px-8 md:px-10 pb-4 pt-1">
              <div className="flex items-start gap-3">
                <Quote className="w-4 h-4 text-dl-accent/30 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-dl-primary-dark/75 leading-relaxed italic text-justify">
                  {resumenIA}
                </p>
              </div>
            </div>
          )}

          {/* Contacto */}
          <div className={`px-8 md:px-10 pb-7 flex flex-wrap justify-center gap-3 print:hidden ${
            mostrarResumenPublico && resumenIA ? 'pt-0' : 'pt-5'
          }`}>
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-2 px-4 py-2 bg-dl-primary-bg rounded-full text-xs font-black text-dl-primary-dark hover:bg-dl-accent hover:text-white transition-all border border-dl-primary-light/10">
                <Mail className="w-3.5 h-3.5" /> {email}
              </a>
            )}
            {mostrarTelPublico && telefono && (
              <a href={`https://wa.me/${telefono.replace(/\+/g, '').replace(/\s/g, '')}`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full text-xs font-black text-green-700 hover:bg-green-500 hover:text-white transition-all border border-green-100">
                <Phone className="w-3.5 h-3.5" /> WhatsApp
              </a>
            )}
            <a 
              href={`/api/cv/${username}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-dl-primary-dark rounded-full text-xs font-black text-white hover:bg-dl-accent transition-all border border-dl-primary-dark"
            >
              <Download className="w-3.5 h-3.5" /> Descargar CV (PDF)
            </a>
          </div>
          {/* Print contact */}
          <div className="hidden print:block px-10 pb-6 text-xs font-bold text-dl-muted space-y-1">
            {email && <p>Email: {email}</p>}
            {telefono && <p>Tel: {telefono}</p>}
          </div>
        </header>

        {/* Body: on mobile Experiencia first, sidebar second */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
           
          {/* Sidebar — appears 2nd on mobile (order-last), right column on desktop */}
          <div className="md:col-span-4 space-y-6 order-last md:order-first">
            {formacion.length > 0 && (
              <section className="bg-white rounded-3xl p-7 shadow-md border border-dl-primary-light/5">
                <h2 className="text-[10px] font-black text-dl-primary-dark uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-dl-accent" /> Formación
                </h2>
                <div className="space-y-5">
                  {formacion.map((edu: any, i: number) => (
                    <div key={i} className="space-y-0.5">
                      <p className="text-sm font-black text-dl-primary-dark leading-tight">{edu.area || edu.titulo || edu.degree}</p>
                      <p className="text-[10px] font-bold text-dl-muted uppercase tracking-tight leading-snug">{edu.institution || edu.institucion}</p>
                      {(edu.year || edu.anio || edu.endDate) && (
                        <p className="text-[10px] font-black text-dl-accent">{edu.year || edu.anio || edu.endDate}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {cursos.length > 0 && (
              <section className="bg-dl-primary-dark rounded-3xl p-7 shadow-md text-white">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-5 text-dl-accent flex items-center gap-2">
                  <Award className="w-4 h-4" /> Cursos
                </h2>
                <div className="space-y-4">
                  {cursos.map((c: any, i: number) => (
                    <div key={i} className="border-l-2 border-dl-accent/30 pl-3">
                      <p className="text-[10px] font-black uppercase leading-snug">{c.nombre}</p>
                      {/* FIX: break-words, no truncate */}
                      <p className="text-[9px] font-bold text-white/50 mt-1 uppercase leading-tight break-words whitespace-normal">
                        {c.institucion}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Main content */}
          <div className="md:col-span-8 space-y-6">
            {experiencia.length > 0 && (
              <section className="bg-white rounded-3xl p-7 md:p-9 shadow-md border border-dl-primary-light/10">
                <h2 className="text-lg font-black text-dl-primary-dark mb-7 flex items-center gap-3">
                  Trayectoria Docente
                  <Briefcase className="w-5 h-5 text-dl-accent opacity-30" />
                </h2>

                <div className="space-y-8 relative">
                  <div className="absolute left-0 top-2 bottom-0 w-0.5 bg-dl-primary-bg rounded-full hidden md:block" />

                  {experiencia.map((exp: any, i: number) => {
                    const desde = formatDate(exp.startDate || exp.desde);
                    const hasta = formatDate(exp.endDate || exp.hasta);
                    return (
                      <div key={i} className="relative md:pl-7 group">
                        <div className="absolute left-[-3.5px] top-2 w-2 h-2 rounded-full bg-dl-primary-bg border-2 border-white group-hover:bg-dl-accent transition-all hidden md:block z-10" />
                        
                        <div className="space-y-2">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-1">
                            <h3 className="text-base font-black text-dl-primary-dark group-hover:text-dl-accent transition-colors leading-tight">
                              {exp.position || exp.cargo}
                            </h3>
                            {/* FIX: w-fit to prevent full-width stretch on mobile */}
                            <span className="text-[9px] font-black uppercase tracking-widest text-dl-accent bg-dl-accent/5 px-2 py-1 rounded-md w-fit">
                              {desde} — {hasta}
                            </span>
                          </div>
                          
                          <p className="text-[10px] font-bold text-dl-muted uppercase tracking-tight">
                            {exp.name || exp.institucion}
                          </p>

                          {(exp.summary || exp.descripcion) && (
                            <div className="bg-dl-primary-bg/30 p-4 rounded-xl border-l-2 border-dl-primary-light/20 mt-2">
                              <p className="text-xs font-medium text-dl-primary-dark/70 leading-relaxed italic">
                                "{exp.summary || exp.descripcion}"
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

        <footer className="text-center pt-8 text-dl-muted/50 print:hidden">
          <p className="text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
            Perfil verificado en <span className="text-dl-accent">docentelink.ar</span>
          </p>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .bg-\\[\\#F8FAFC\\] { background: white !important; }
          .shadow-lg, .shadow-md { box-shadow: none !important; }
          .rounded-3xl { border-radius: 0 !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
      `}} />
    </div>
  );
}
